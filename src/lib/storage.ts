import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function uploadReferenceImage(
  fileBuffer: Buffer,
  mimeType: string,
  userId: string,
  designId: string
): Promise<string> {
  const supabase = await createClient();
  const ext = mimeType.split("/")[1] || "png";
  const path = `${userId}/${designId}/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from("reference-images")
    .upload(path, fileBuffer, { contentType: mimeType });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("reference-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadGeneratedImage(
  imageBuffer: Buffer,
  userId: string,
  designId: string,
  version: number
): Promise<string> {
  const supabase = await createClient();
  const path = `${userId}/${designId}/v${version}.png`;

  const { error } = await supabase.storage
    .from("generated-designs")
    .upload(path, imageBuffer, { contentType: "image/png", upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from("generated-designs")
    .getPublicUrl(path);
  return data.publicUrl;
}
