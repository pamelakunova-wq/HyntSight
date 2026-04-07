"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function EmptyState({ children }: { children?: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card/30 py-20 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 flex size-28 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10">
        <Sparkles
          className="size-12 text-indigo-300/90"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
      <h2 className="mb-3 text-2xl font-semibold tracking-tight">
        Your design studio awaits
      </h2>
      <p className="mb-8 max-w-md px-4 text-muted-foreground">
        Describe your clothing idea and let AI create professional schematics
        for you.
      </p>
      {children}
    </motion.div>
  );
}
