import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export const MODELS = {
  flash: "gemini-2.5-flash",
  flashImage: "gemini-2.0-flash-exp",
  proImage: "gemini-2.0-flash-exp",
} as const;

export async function generateText(
  prompt: string,
  imageBuffers?: Buffer[]
): Promise<string> {
  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (imageBuffers) {
    for (const buf of imageBuffers) {
      parts.push({
        inlineData: { mimeType: "image/png", data: buf.toString("base64") },
      });
    }
  }

  const response = await ai.models.generateContent({
    model: MODELS.flash,
    contents: [{ role: "user", parts }],
  });

  return response.text ?? "";
}

export async function generateImage(
  prompt: string,
  referenceImages?: Buffer[]
): Promise<{ imageBase64: string; text: string }> {
  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (referenceImages) {
    for (const buf of referenceImages) {
      parts.push({
        inlineData: { mimeType: "image/png", data: buf.toString("base64") },
      });
    }
  }

  const response = await ai.models.generateContent({
    model: MODELS.flashImage,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  let imageBase64 = "";
  let text = "";

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        text += part.text;
      }
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
      }
    }
  }

  return { imageBase64, text };
}
