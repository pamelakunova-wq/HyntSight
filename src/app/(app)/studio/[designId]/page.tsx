"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Save, Download, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEditorStore } from "@/stores/editorStore";
import { createClient } from "@/lib/supabase/client";
import { useGenerate } from "@/hooks/useGenerate";
import { useIterate } from "@/hooks/useIterate";
import { loadSVGToCanvas, generateThumbnail } from "@/lib/editor/svg-loader";
import { downloadSVG } from "@/lib/editor/export-svg";
import { downloadPNG } from "@/lib/editor/export-png";
import { downloadDXF } from "@/lib/editor/export-dxf";
import { downloadPDF } from "@/lib/editor/export-pdf";
import type { Design, DesignVersion, Plan, ExportFormat } from "@/types";
import Toolbar from "@/components/editor/Toolbar";
import LayerPanel from "@/components/editor/LayerPanel";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import FeedbackPanel from "@/components/editor/FeedbackPanel";
import VersionHistory from "@/components/editor/VersionHistory";
import ExportDialog from "@/components/editor/ExportDialog";

const EditorCanvas = dynamic(() => import("@/components/editor/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-neutral-100">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface PageProps {
  params: Promise<{ designId: string }>;
}

export default function StudioPage({ params }: PageProps) {
  const [designId, setDesignId] = useState<string | null>(null);
  const [design, setDesign] = useState<Design | null>(null);
  const [versions, setVersions] = useState<DesignVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>();
  const [userPlan, setUserPlan] = useState<Plan>("spark");
  const [loading, setLoading] = useState(true);

  const { canvas, isSaving, setIsSaving, lastSaved, setLastSaved, setZoom } =
    useEditorStore();

  const { generate, isGenerating, error: genError } = useGenerate();
  const { iterate, isIterating, error: iterError } = useIterate();

  useEffect(() => {
    params.then((p) => setDesignId(p.designId));
  }, [params]);

  useEffect(() => {
    if (!designId) return;

    async function fetchData() {
      const supabase = createClient();

      const [designRes, versionsRes, userRes] = await Promise.all([
        supabase.from("designs").select("*").eq("id", designId).single(),
        supabase
          .from("design_versions")
          .select("*")
          .eq("design_id", designId)
          .order("version_number", { ascending: false }),
        supabase.auth.getUser(),
      ]);

      if (designRes.data) {
        setDesign(designRes.data as Design);
      }
      if (versionsRes.data) {
        const typedVersions = versionsRes.data as DesignVersion[];
        setVersions(typedVersions);
        if (typedVersions.length > 0) {
          setActiveVersionId(typedVersions[0].id);
        }
      }
      if (userRes.data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", userRes.data.user.id)
          .single();
        if (profile) {
          setUserPlan(profile.plan as Plan);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [designId]);

  useEffect(() => {
    if (!canvas || !versions.length) return;

    const latestVersion = versions[0];
    if (latestVersion?.generated_svg) {
      loadSVGToCanvas(canvas, latestVersion.generated_svg).then(() => {
        const vpt = canvas.viewportTransform;
        if (vpt) setZoom(vpt[0]);
      });
    } else if (design?.current_canvas_json) {
      canvas.loadFromJSON(design.current_canvas_json).then(() => {
        canvas.renderAll();
      });
    }
  }, [canvas, versions, design, setZoom]);

  const handleSave = useCallback(async () => {
    if (!canvas || !designId) return;
    setIsSaving(true);
    try {
      const supabase = createClient();
      const json = canvas.toJSON();
      await supabase
        .from("designs")
        .update({
          current_canvas_json: json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", designId);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [canvas, designId, setIsSaving, setLastSaved]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const refreshVersions = useCallback(async () => {
    if (!designId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("design_versions")
      .select("*")
      .eq("design_id", designId)
      .order("version_number", { ascending: false });
    if (data) setVersions(data as DesignVersion[]);
  }, [designId]);

  const uploadThumbnail = useCallback(async () => {
    if (!canvas || !designId) return;
    try {
      const thumbnailDataUrl = generateThumbnail(canvas);
      const res = await fetch(thumbnailDataUrl);
      const blob = await res.blob();
      const supabase = createClient();
      const thumbPath = `thumbnails/${designId}.png`;
      await supabase.storage
        .from("generated-designs")
        .upload(thumbPath, blob, {
          contentType: "image/png",
          upsert: true,
        });
      const { data: urlData } = supabase.storage
        .from("generated-designs")
        .getPublicUrl(thumbPath);
      await supabase
        .from("designs")
        .update({ thumbnail_url: urlData.publicUrl })
        .eq("id", designId);
    } catch {
      // Thumbnail upload is non-critical
    }
  }, [canvas, designId]);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      if (!canvas || !designId || !design) return;

      const result = await generate(
        prompt,
        [],
        design.garment_type || "",
        designId
      );

      await loadSVGToCanvas(canvas, result.svgContent);
      const vpt = canvas.viewportTransform;
      if (vpt) setZoom(vpt[0]);

      setActiveVersionId(result.versionId);
      await refreshVersions();
      await uploadThumbnail();
    },
    [canvas, designId, design, generate, refreshVersions, uploadThumbnail, setZoom]
  );

  const handleIterate = useCallback(
    async (feedback: string) => {
      if (!canvas || !designId || !activeVersionId) return;

      const currentSVG = canvas.toSVG();

      const result = await iterate(
        designId,
        feedback,
        useEditorStore.getState().selectedFeedbackArea ?? undefined,
        activeVersionId,
        currentSVG
      );

      await loadSVGToCanvas(canvas, result.svgContent);
      const vpt = canvas.viewportTransform;
      if (vpt) setZoom(vpt[0]);

      setActiveVersionId(result.versionId);
      await refreshVersions();
      await uploadThumbnail();
    },
    [canvas, designId, activeVersionId, iterate, refreshVersions, uploadThumbnail, setZoom]
  );

  const handleExport = useCallback(
    async (format: ExportFormat | string, quality?: number) => {
      if (!canvas) return;
      const filename = `${design?.name || "design"}-v${versions[0]?.version_number || 1}`;

      switch (format) {
        case "svg":
          downloadSVG(canvas, `${filename}.svg`);
          break;
        case "png":
          downloadPNG(canvas, `${filename}.png`, {
            scale: quality ?? 2,
            watermark: userPlan === "spark",
          });
          break;
        case "dxf":
          downloadDXF(canvas, `${filename}.dxf`);
          break;
        case "pdf":
          downloadPDF(canvas, `${filename}.pdf`, {
            title: design?.name,
          });
          break;
      }
    },
    [canvas, design, versions, userPlan]
  );

  const handleLoadVersion = useCallback(
    async (version: DesignVersion) => {
      if (!canvas) return;

      if (version.generated_svg) {
        await loadSVGToCanvas(canvas, version.generated_svg);
        const vpt = canvas.viewportTransform;
        if (vpt) setZoom(vpt[0]);
      } else if (version.canvas_json && Object.keys(version.canvas_json).length > 0) {
        await canvas.loadFromJSON(version.canvas_json);
        canvas.renderAll();
      }

      setActiveVersionId(version.id);
    },
    [canvas, setZoom]
  );

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b px-4 py-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-48" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex flex-1">
          <Skeleton className="h-full w-12" />
          <Skeleton className="flex-1" />
          <Skeleton className="h-full w-72" />
        </div>
      </div>
    );
  }

  const hasGeneratedDesign = versions.some(
    (v) => v.generated_svg || v.generated_image_url
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b bg-background px-3 py-1.5">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>

        <h1 className="text-sm font-medium truncate">
          {design?.name ?? "Untitled Design"}
        </h1>

        {(isGenerating || isIterating) && (
          <span className="flex items-center gap-1.5 text-xs text-indigo-400">
            <Loader2 className="size-3 animate-spin" />
            {isGenerating ? "Generating..." : "Iterating..."}
          </span>
        )}

        {(genError || iterError) && (
          <span className="text-xs text-red-400 truncate max-w-60">
            {genError || iterError}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {lastSaved && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Check className="size-3" />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Save
          </Button>

          <ExportDialog userPlan={userPlan} onExport={handleExport}>
            <Button variant="outline" size="sm">
              <Download className="size-3.5" />
              Export
            </Button>
          </ExportDialog>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Toolbar */}
        <Toolbar />

        {/* Center: Canvas */}
        <EditorCanvas />

        {/* Right: Panels */}
        <div className="flex w-72 flex-col border-l bg-background">
          <Tabs defaultValue="ai" className="flex h-full flex-col">
            <TabsList className="shrink-0 w-full rounded-none border-b">
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="versions">History</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="flex-1 overflow-auto">
              {designId && (
                <FeedbackPanel
                  designId={designId}
                  currentVersionId={activeVersionId}
                  hasGeneratedImage={hasGeneratedDesign}
                  onGenerate={handleGenerate}
                  onIterate={handleIterate}
                />
              )}
            </TabsContent>
            <TabsContent value="layers" className="flex-1 overflow-auto">
              <LayerPanel />
            </TabsContent>
            <TabsContent value="properties" className="flex-1 overflow-auto">
              <PropertiesPanel />
            </TabsContent>
            <TabsContent value="versions" className="flex-1 overflow-auto">
              <VersionHistory
                versions={versions}
                activeVersionId={activeVersionId}
                onLoadVersion={handleLoadVersion}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
