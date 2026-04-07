import { generateImage } from "./gemini";
import { buildGenerationPrompt, buildIterationPrompt } from "./prompts";
import { createClient } from "@/lib/supabase/server";
import type { GenerationRequest, IterationRequest } from "@/types";

export async function generateDesign(
  request: GenerationRequest,
  userId: string
) {
  const supabase = await createClient();

  const prompt = buildGenerationPrompt(request.prompt, request.garmentType);

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

  const { imageBase64, text } = await generateImage(prompt, referenceBuffers);

  if (!imageBase64) {
    throw new Error("AI failed to generate an image");
  }

  const imageBuffer = Buffer.from(imageBase64, "base64");

  const { data: versions } = await supabase
    .from("design_versions")
    .select("version_number")
    .eq("design_id", request.designId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

  const imagePath = `${userId}/${request.designId}/v${nextVersion}.png`;
  const { error: uploadError } = await supabase.storage
    .from("generated-designs")
    .upload(imagePath, imageBuffer, { contentType: "image/png", upsert: true });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(imagePath);

  const imageUrl = urlData.publicUrl;

  const { data: version, error: versionError } = await supabase
    .from("design_versions")
    .insert({
      design_id: request.designId,
      version_number: nextVersion,
      canvas_json: {},
      generated_image_url: imageUrl,
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
      thumbnail_url: imageUrl,
    })
    .eq("id", request.designId);

  await supabase.from("generation_logs").insert({
    user_id: userId,
    design_id: request.designId,
    model_used: "gemini-2.0-flash-exp",
    image_count: 1,
    cost_usd: 0.039,
    prompt_text: request.prompt.substring(0, 500),
  });

  void text;

  return {
    imageUrl,
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

  const currentVersion = (
    design.design_versions as Array<{ id: string; generated_image_url: string | null }>
  )?.find((v) => v.id === request.currentVersionId);

  const prompt = buildIterationPrompt(
    design.initial_prompt || "",
    request.feedback,
    !!request.selectedArea
  );

  let referenceBuffers: Buffer[] | undefined;
  if (currentVersion?.generated_image_url) {
    const res = await fetch(currentVersion.generated_image_url);
    const buf = await res.arrayBuffer();
    referenceBuffers = [Buffer.from(buf)];
  }

  const { imageBase64 } = await generateImage(prompt, referenceBuffers);

  if (!imageBase64) throw new Error("AI failed to generate an image");

  const imageBuffer = Buffer.from(imageBase64, "base64");

  const { data: versions } = await supabase
    .from("design_versions")
    .select("version_number")
    .eq("design_id", request.designId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

  const imagePath = `${userId}/${request.designId}/v${nextVersion}.png`;
  await supabase.storage
    .from("generated-designs")
    .upload(imagePath, imageBuffer, { contentType: "image/png", upsert: true });

  const { data: urlData } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(imagePath);

  const imageUrl = urlData.publicUrl;

  const { data: version, error: versionError } = await supabase
    .from("design_versions")
    .insert({
      design_id: request.designId,
      version_number: nextVersion,
      canvas_json: {},
      generated_image_url: imageUrl,
      feedback_prompt: request.feedback,
      feedback_area: request.selectedArea ?? null,
      parent_version_id: request.currentVersionId,
    })
    .select()
    .single();

  if (versionError)
    throw new Error(`Version creation failed: ${versionError.message}`);

  await supabase
    .from("designs")
    .update({ thumbnail_url: imageUrl })
    .eq("id", request.designId);

  await supabase.from("generation_logs").insert({
    user_id: userId,
    design_id: request.designId,
    model_used: "gemini-2.0-flash-exp",
    image_count: 1,
    cost_usd: 0.044,
    prompt_text: request.feedback.substring(0, 500),
  });

  return {
    imageUrl,
    versionId: version.id,
    versionNumber: nextVersion,
  };
}
