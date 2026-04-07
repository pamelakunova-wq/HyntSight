import type { Canvas } from "fabric";
import { createClient } from "@/lib/supabase/client";
import type { Design } from "@/types";

export async function saveDesign(
  canvas: Canvas,
  designId: string,
  userId: string,
): Promise<void> {
  const supabase = createClient();
  const canvasJson = canvas.toJSON();
  const thumbnail = canvas.toDataURL({
    format: "png",
    multiplier: 0.25,
  });

  const thumbBlob = await fetch(thumbnail).then((r) => r.blob());
  const thumbPath = `${userId}/${designId}/thumbnail.png`;
  await supabase.storage
    .from("generated-designs")
    .upload(thumbPath, thumbBlob, { contentType: "image/png", upsert: true });

  const { data: urlData } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(thumbPath);

  await supabase
    .from("designs")
    .update({
      current_canvas_json: canvasJson,
      thumbnail_url: urlData.publicUrl,
    })
    .eq("id", designId);
}

export async function loadDesign(
  canvas: Canvas,
  designId: string,
): Promise<Design | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("designs")
    .select("*")
    .eq("id", designId)
    .single();

  const row = data as Design | null;
  if (row?.current_canvas_json) {
    await canvas.loadFromJSON(row.current_canvas_json);
    canvas.renderAll();
  }

  return row;
}
