"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X, Sparkles } from "lucide-react";
import DesignPreview from "./DesignPreview";

const LOADING_STAGES = [
  { message: "Analyzing your vision...", delay: 0 },
  { message: "Engineering the design...", delay: 2000 },
  { message: "Generating schematic...", delay: 4000 },
] as const;

const GENERATION_TOTAL_MS = 5500;

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearGenerationTimeouts = useCallback(() => {
    generationTimeoutsRef.current.forEach(clearTimeout);
    generationTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearGenerationTimeouts();
    };
  }, [clearGenerationTimeouts]);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected?.length) return;
    setFiles((prev) => {
      const remaining = Math.max(0, 3 - prev.length);
      if (remaining === 0) return prev;
      const picked = Array.from(selected).slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...picked];
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;

    clearGenerationTimeouts();
    setIsGenerating(true);
    setGenerationStage(0);
    setShowPreview(false);

    const push = (id: ReturnType<typeof setTimeout>) => {
      generationTimeoutsRef.current.push(id);
    };

    push(
      setTimeout(() => setGenerationStage(1), LOADING_STAGES[1].delay)
    );
    push(
      setTimeout(() => setGenerationStage(2), LOADING_STAGES[2].delay)
    );
    push(
      setTimeout(() => {
        setIsGenerating(false);
        setShowPreview(true);
        clearGenerationTimeouts();
      }, GENERATION_TOTAL_MS)
    );
  }, [prompt, clearGenerationTimeouts]);

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Deep base + undertone */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(139,92,246,0.08),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(124,58,237,0.06),transparent_40%)]"
        aria-hidden
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      {/* Floating orbs */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 size-[420px] rounded-full bg-indigo-500/25 blur-[100px]"
        animate={{ x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-20 top-1/3 size-[380px] rounded-full bg-violet-500/20 blur-[90px]"
        animate={{ x: [0, -20, 0], y: [0, 22, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 size-[320px] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[80px]"
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [0.95, 1.02, 0.95] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.h1
          className="text-5xl font-bold tracking-tight text-balance md:text-7xl md:leading-[1.05]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Design clothing with words,
          </span>
          <br />
          <span className="text-white">not software</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          You don’t need years in fashion school. Describe what you want in plain language and get{" "}
          <span className="text-amber-400/90">production-ready</span> technical flats and schematics
          you can hand straight to a factory.
        </motion.p>
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-12 max-w-2xl"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-indigo-950/40 backdrop-blur-xl md:p-5">
          <Textarea
            placeholder='Describe a garment… e.g. "Relaxed camp-collar shirt in slub linen, coconut buttons, single chest pocket, straight hem"'
            className="min-h-28 resize-none border-0 bg-transparent text-foreground/95 placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 border-white/15 bg-white/5 hover:bg-white/10"
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
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {files.map((f, i) => (
              <div
                key={`${f.preview}-${i}`}
                className="relative size-11 overflow-hidden rounded-lg border border-white/10 shadow-inner"
              >
                <img src={f.preview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove reference image ${i + 1}`}
                  className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border border-white/20 bg-zinc-950/90 text-muted-foreground shadow-md transition-colors hover:border-amber-500/40 hover:text-amber-400"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Loader2 className="size-4 shrink-0 animate-spin text-violet-400" aria-hidden />
                  <span>{LOADING_STAGES[generationStage].message}</span>
                </div>
                <ul className="space-y-2.5" aria-live="polite" aria-atomic="true">
                  {LOADING_STAGES.map((stage, i) => {
                    const done = i < generationStage;
                    const active = i === generationStage;
                    return (
                      <li
                        key={stage.message}
                        className="relative overflow-hidden rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5"
                      >
                        {active && (
                          <motion.div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                              duration: 1.35,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            aria-hidden
                          />
                        )}
                        <div className="relative flex items-center gap-2 text-left text-xs md:text-sm">
                          <Sparkles
                            className={`size-3.5 shrink-0 ${
                              active
                                ? "text-amber-400"
                                : done
                                  ? "text-violet-400/80"
                                  : "text-muted-foreground/50"
                            }`}
                            aria-hidden
                          />
                          <span
                            className={
                              active
                                ? "font-medium text-white"
                                : done
                                  ? "text-muted-foreground line-through decoration-white/20"
                                  : "text-muted-foreground/60"
                            }
                          >
                            {stage.message}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div
                  className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    ((generationStage + 1) / LOADING_STAGES.length) * 100
                  )}
                  aria-label="Generation progress"
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((generationStage + 1) / LOADING_STAGES.length) * 100}%`,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ) : (
              <Button
                key="cta"
                type="button"
                className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/50 hover:from-indigo-600 hover:to-violet-700"
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="size-4" />
                  Generate Design
                </span>
              </Button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <DesignPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
