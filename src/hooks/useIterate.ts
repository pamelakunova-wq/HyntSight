"use client";

import { useState } from "react";
import type { FeedbackArea } from "@/types";

export function useIterate() {
  const [isIterating, setIsIterating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function iterate(
    designId: string,
    feedback: string,
    selectedArea: FeedbackArea | undefined,
    currentVersionId: string
  ) {
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? "Iteration failed");
      }

      return data as {
        imageUrl: string;
        versionId: string;
        versionNumber: number;
      };
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
