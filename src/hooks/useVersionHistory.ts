"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DesignVersion } from "@/types";

function pickVersionId(
  versionData: DesignVersion[],
  previousId: string | null,
): string | null {
  if (previousId && versionData.some((v) => v.id === previousId)) {
    return previousId;
  }
  return versionData[0]?.id ?? null;
}

export function useVersionHistory(designId: string) {
  const [versions, setVersions] = useState<DesignVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("design_versions")
        .select("*")
        .eq("design_id", designId)
        .order("version_number", { ascending: false });

      if (cancelled) return;

      const versionData = (data ?? []) as DesignVersion[];
      setVersions(versionData);
      setCurrentVersionId((prev) => pickVersionId(versionData, prev));
      setIsLoading(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [designId]);

  const refetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("design_versions")
      .select("*")
      .eq("design_id", designId)
      .order("version_number", { ascending: false });

    const versionData = (data ?? []) as DesignVersion[];
    setVersions(versionData);
    setCurrentVersionId((prev) => pickVersionId(versionData, prev));
    setIsLoading(false);
  }, [designId]);

  return {
    versions,
    currentVersionId,
    setCurrentVersionId,
    isLoading,
    refetch,
  };
}
