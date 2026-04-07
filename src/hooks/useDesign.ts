"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Design, DesignVersion } from "@/types";

export function useDesign(designId: string) {
  const [design, setDesign] = useState<Design | null>(null);
  const [versions, setVersions] = useState<DesignVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesign = useCallback(async () => {
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("designs")
      .select("*")
      .eq("id", designId)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    setDesign(data as Design);

    const { data: versionData } = await supabase
      .from("design_versions")
      .select("*")
      .eq("design_id", designId)
      .order("version_number", { ascending: false });

    setVersions((versionData ?? []) as DesignVersion[]);
    setIsLoading(false);
  }, [designId]);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  const currentVersion = versions[0] ?? null;

  return {
    design,
    currentVersion,
    versions,
    isLoading,
    error,
    refetch: fetchDesign,
  };
}
