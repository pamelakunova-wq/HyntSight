"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";
import DesignPreview from "./DesignPreview";

const LOADING_STAGES = [
  { message: "Analyzing your vision...", delay: 0 },
  { message: "Engineering the design...", delay: 2000 },
  { message: "Generating schematic...", delay: 4000 },
];

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected) return;
    const newFiles = Array.from(selected).slice(0, 3 - files.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles].slice(0, 3));
  }, [files.length]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStage(0);
    setShowPreview(false);

    const t1 = setTimeout(() => setGenerationStage(1), LOADING_STAGES[1].delay);
    const t2 = setTimeout(() => setGenerationStage(2), LOADING_STAGES[2].delay);
    const t3 = setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 5500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [prompt]);

  return (
    <section className="relative px-6 pt-20 pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Design clothing with words,
          </span>
          <br />
          <span className="text-foreground">not software</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Describe your clothing idea in plain English. HyntSight turns your words into
          production-ready technical flats — no design skills needed.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <div className="rounded-xl border border-white/10 bg-card p-4 shadow-lg shadow-indigo-500/10">
          <Textarea
            placeholder="Describe a clothing design… e.g. &quot;A relaxed-fit linen camp collar shirt with a chest pocket, coconut buttons, and a straight hem&quot;"
            className="min-h-28 resize-none border-0 bg-transparent focus-visible:ring-0"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />

          <div className="mt-3 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating || files.length >= 3}
            >
              <ImagePlus className="size-4" />
              Attach References
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {files.map((f, i) => (
              <div key={i} className="relative size-10 overflow-hidden rounded-md border border-white/10">
                <img src={f.preview} alt="" className="size-full object-cover" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-background text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <Button
            className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {LOADING_STAGES[generationStage].message}
              </span>
            ) : (
              "Generate Design"
            )}
          </Button>
        </div>

        {showPreview && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DesignPreview />
          </div>
        )}
      </div>
    </section>
  );
}
