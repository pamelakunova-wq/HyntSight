import { generateSVG } from "./gemini";
import {
  buildSVGGenerationPrompt,
  buildSVGIterationPrompt,
} from "./prompts";
import { normalizeSVG } from "./svg-utils";
import { createClient } from "@/lib/supabase/server";
import type { GenerationRequest, IterationRequest } from "@/types";

export async function generateDesign(
  request: GenerationRequest,
  userId: string
) {
  const supabase = await createClient();

  const prompt = buildSVGGenerationPrompt(request.prompt, request.garmentType);

  let referenceBuffers: Buffer[] | undefined;
  if (request.referenceImageUrls?.length) {
    referenceBuffers = await Promise.all(
      request.referenceImageUrls.map(async (url) => {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      })
    );
  }

  const { svg: rawSvg, notes, model: modelUsed } = await generateSVG(
    prompt,
    referenceBuffers
  );
  const svgContent = normalizeSVG(rawSvg);

  const { data: versions } = await supabase
    .from("design_versions")
    .select("version_number")
    .eq("design_id", request.designId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

  const svgPath = `${userId}/${request.designId}/v${nextVersion}.svg`;
  const svgBuffer = Buffer.from(svgContent, "utf-8");
  const { error: uploadError } = await supabase.storage
    .from("generated-designs")
    .upload(svgPath, svgBuffer, {
      contentType: "image/svg+xml",
      upsert: true,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(svgPath);

  const { data: version, error: versionError } = await supabase
    .from("design_versions")
    .insert({
      design_id: request.designId,
      version_number: nextVersion,
      canvas_json: {},
      generated_svg: svgContent,
      ai_notes: notes || null,
      generated_image_url: urlData.publicUrl,
      feedback_prompt: request.prompt,
    })
    .select()
    .single();

  if (versionError)
    throw new Error(`Version creation failed: ${versionError.message}`);

  await supabase
    .from("designs")
    .update({
      status: "ready",
      initial_prompt: request.prompt,
    })
    .eq("id", request.designId);

  await supabase.from("generation_logs").insert({
    user_id: userId,
    design_id: request.designId,
    model_used: modelUsed,
    image_count: 0,
    cost_usd: 0.01,
    prompt_text: request.prompt.substring(0, 500),
  });

  return {
    svgContent,
    aiNotes: notes || "",
    versionId: version.id,
    versionNumber: nextVersion,
  };
}

export async function iterateDesign(
  request: IterationRequest,
  userId: string
) {
  const supabase = await createClient();

  const { data: design } = await supabase
    .from("designs")
    .select("*, design_versions(*)")
    .eq("id", request.designId)
    .single();

  if (!design) throw new Error("Design not found");

  let currentSVG = request.currentSVG || "";

  if (!currentSVG) {
    const currentVersion = (
      design.design_versions as Array<{
        id: string;
        generated_svg: string | null;
      }>
    )?.find((v) => v.id === request.currentVersionId);

    currentSVG = currentVersion?.generated_svg || "";
  }

  const prompt = buildSVGIterationPrompt(
    currentSVG,
    design.initial_prompt || "",
    request.feedback,
    request.selectedArea
  );

  let referenceBuffers: Buffer[] | undefined;
  if (request.referenceImageUrls?.length) {
    referenceBuffers = await Promise.all(
      request.referenceImageUrls.map(async (url) => {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        return Buffer.from(arrayBuf);
      })
    );
  }

  const { svg: rawSvg, notes, model: modelUsed } = await generateSVG(
    prompt,
    referenceBuffers
  );
  const svgContent = normalizeSVG(rawSvg);

  const { data: versions } = await supabase
    .from("design_versions")
    .select("version_number")
    .eq("design_id", request.designId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

  const svgPath = `${userId}/${request.designId}/v${nextVersion}.svg`;
  const svgBuffer = Buffer.from(svgContent, "utf-8");
  await supabase.storage
    .from("generated-designs")
    .upload(svgPath, svgBuffer, {
      contentType: "image/svg+xml",
      upsert: true,
    });

  const { data: urlData } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(svgPath);

  const { data: version, error: versionError } = await supabase
    .from("design_versions")
    .insert({
      design_id: request.designId,
      version_number: nextVersion,
      canvas_json: {},
      generated_svg: svgContent,
      ai_notes: notes || null,
      generated_image_url: urlData.publicUrl,
      feedback_prompt: request.feedback,
      feedback_area: request.selectedArea ?? null,
      parent_version_id: request.currentVersionId,
    })
    .select()
    .single();

  if (versionError)
    throw new Error(`Version creation failed: ${versionError.message}`);

  await supabase.from("generation_logs").insert({
    user_id: userId,
    design_id: request.designId,
    model_used: modelUsed,
    image_count: 0,
    cost_usd: 0.012,
    prompt_text: request.feedback.substring(0, 500),
  });

  return {
    svgContent,
    aiNotes: notes || "",
    versionId: version.id,
    versionNumber: nextVersion,
  };
}
