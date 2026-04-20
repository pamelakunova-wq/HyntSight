import { GoogleGenAI } from "@google/genai";
import { extractSVG, validateSVG } from "./svg-utils";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export const MODELS = {
  flash: "gemini-3-flash-preview",
  flashImage: "gemini-2.5-flash-image",
  proImage: "gemini-2.5-flash-image",
} as const;

/**
 * Ordered fallback chain for SVG text generation.
 * Each model has independent capacity — if one is overloaded, the next likely isn't.
 */
const SVG_MODEL_CHAIN = [
  "gemini-3-flash-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
] as const;

type ContentPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export async function generateText(
  prompt: string,
  imageBuffers?: Buffer[]
): Promise<string> {
  const parts: ContentPart[] = [{ text: prompt }];

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
  const parts: ContentPart[] = [{ text: prompt }];

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

function isTransientError(err: unknown): number {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: number }).status;
    if (status === 503 || status === 429) return status;
  }
  return 0;
}

const MAX_SVG_RETRIES = 1;

export async function generateSVG(
  prompt: string,
  referenceImages?: Buffer[]
): Promise<{ svg: string; notes: string; model: string }> {
  const parts: ContentPart[] = [{ text: prompt }];

  if (referenceImages) {
    for (const buf of referenceImages) {
      parts.push({
        inlineData: { mimeType: "image/png", data: buf.toString("base64") },
      });
    }
  }

  for (const model of SVG_MODEL_CHAIN) {
    let lastError = "";

    for (let attempt = 0; attempt <= MAX_SVG_RETRIES; attempt++) {
      const retryParts: ContentPart[] =
        attempt === 0
          ? parts
          : [
              ...parts,
              {
                text: `Your previous response did not contain valid SVG. ${lastError} Please respond with ONLY valid SVG code wrapped in <svg>...</svg> tags.`,
              },
            ];

      let response;
      try {
        response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: retryParts }],
        });
      } catch (err: unknown) {
        const status = isTransientError(err);
        if (status && attempt < MAX_SVG_RETRIES) {
          await new Promise((r) => setTimeout(r, 2000));
          lastError = `Transient ${status} error, retrying...`;
          continue;
        }
        if (status) {
          console.warn(
            `[generateSVG] ${model} returned ${status}, falling back to next model`
          );
          break;
        }
        throw err;
      }

      const rawText = response.text ?? "";
      const svgBlock = extractSVG(rawText);

      if (!svgBlock) {
        lastError = "No <svg> block found in the response.";
        continue;
      }

      if (!validateSVG(svgBlock)) {
        lastError = "The SVG was malformed XML.";
        continue;
      }

      const notes = rawText
        .replace(/<svg[\s\S]*<\/svg>/i, "")
        .replace(/```[\s\S]*?```/g, "")
        .trim();

      return { svg: svgBlock, notes, model };
    }
  }

  throw new Error(
    "AI failed to generate valid SVG. All models are currently unavailable or returned invalid output. Please try again in a moment."
  );
}
