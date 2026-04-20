"use client";

import { useState } from "react";
import type { FeedbackArea } from "@/types";

export interface IterateResult {
  svgContent: string;
  aiNotes: string;
  versionId: string;
  versionNumber: number;
}

export function useIterate() {
  const [isIterating, setIsIterating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function iterate(
    designId: string,
    feedback: string,
    selectedArea: FeedbackArea | undefined,
    currentVersionId: string,
    currentSVG?: string
  ): Promise<IterateResult> {
    setIsIterating(true);
    setError(null);

    try {
      const res = await fetch("/api/iterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId,
          feedback,
          selectedArea,
          currentVersionId,
          currentSVG,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? "Iteration failed");
      }

      return data as IterateResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Iteration failed";
      setError(message);
      throw err;
    } finally {
      setIsIterating(false);
    }
  }

  return { iterate, isIterating, error };
}
