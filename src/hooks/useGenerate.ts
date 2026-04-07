"use client";

import { useState } from "react";

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(
    prompt: string,
    referenceImageUrls: string[],
    garmentType: string,
    designId: string
  ) {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          referenceImageUrls,
          garmentType,
          designId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? "Generation failed");
      }

      return data as {
        imageUrl: string;
        versionId: string;
        versionNumber: number;
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Generation failed";
      setError(message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }

  return { generate, isGenerating, error };
}
