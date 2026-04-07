"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, RefreshCw, Download } from "lucide-react";

const schematicPaths = [
  "M160 48 L200 42 L240 48",
  "M120 52 Q160 38 200 38 Q240 38 280 52",
  "M120 52 L108 58 L100 72 L92 88",
  "M280 52 L292 58 L300 72 L308 88",
  "M92 88 L72 98 L58 118 L52 142",
  "M308 88 L328 98 L342 118 L348 142",
  "M52 142 L48 168 L52 198 L58 268 L62 312",
  "M348 142 L352 168 L348 198 L342 268 L338 312",
  "M62 312 L200 318 L338 312",
  "M200 72 L200 318",
  "M200 118 L200 268",
  "M128 108 L128 128 M118 118 L138 118",
  "M268 108 L268 128 M258 118 L278 118",
  "M145 195 L255 195 M145 205 L255 205 M145 200 L255 200",
  "M118 245 L118 275 M108 260 L128 260",
  "M72 118 L88 125",
  "M328 118 L312 125",
] as const;

export default function DesignPreview() {
  return (
    <Card className="relative overflow-hidden border border-white/10 bg-zinc-950/40 shadow-2xl shadow-indigo-950/30">
      <CardContent className="relative p-0">
        <div className="relative flex min-h-[320px] items-center justify-center bg-gradient-to-b from-indigo-950/30 via-zinc-950/50 to-violet-950/25 px-4 py-10 md:min-h-[380px] md:py-12">
          <motion.svg
            viewBox="0 0 400 460"
            className="h-[min(52vw,340px)] w-auto max-w-full text-indigo-300/40"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: [0.75, 0.95, 0.75] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            <defs>
              <linearGradient id="grainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(165 180 252)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(196 181 253)" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {/* Grain line */}
            <g stroke="url(#grainGrad)" strokeWidth={1.2}>
              <line x1="125" y1="355" x2="285" y2="340" strokeDasharray="4 3" />
              <polygon points="285,340 278,336 278,344" fill="rgb(165 180 252)" fillOpacity="0.35" stroke="none" />
            </g>

            {/* Main garment outline — animated draw */}
            <g>
              {schematicPaths.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 1.4, delay: i * 0.06, ease: "easeOut" },
                    opacity: { duration: 0.4, delay: i * 0.06 },
                  }}
                />
              ))}
            </g>

            {/* Collar detail */}
            <path
              d="M155 50 Q200 44 245 50 M165 54 Q200 50 235 54"
              strokeWidth={0.85}
              opacity={0.9}
            />
            {/* Placket / CF hint */}
            <path d="M200 72 L200 118 M194 88 L206 88 M194 102 L206 102" strokeWidth={0.75} opacity={0.7} />
            {/* Armhole curves */}
            <path
              d="M92 88 Q108 95 118 112 M308 88 Q292 95 282 112"
              strokeWidth={0.85}
              opacity={0.85}
            />
            {/* Sleeve hem */}
            <path d="M58 168 L62 175 L68 172 M342 168 L338 175 L332 172" strokeWidth={0.7} opacity={0.65} />
            {/* Side seam tick */}
            <path d="M62 220 L72 220 M338 220 L328 220" strokeWidth={0.6} opacity={0.55} />
            {/* Pocket */}
            <rect x="248" y="128" width="36" height="42" rx="3" strokeWidth={0.9} opacity={0.85} />
            <line x1="248" y1="149" x2="284" y2="149" strokeWidth={0.5} opacity={0.5} />

            {/* CB line */}
            <line
              x1="200"
              y1="72"
              x2="200"
              y2="312"
              strokeDasharray="5 4"
              strokeWidth={0.7}
              opacity={0.55}
            />

            {/* Labels */}
            <text x="206" y="66" fill="currentColor" fontSize="9" fontFamily="system-ui, sans-serif" opacity={0.85}>
              CF
            </text>
            <text x="188" y="210" fill="currentColor" fontSize="9" fontFamily="system-ui, sans-serif" opacity={0.75} textAnchor="end">
              CB
            </text>
            <text x="290" y="352" fill="currentColor" fontSize="8" fontFamily="system-ui, sans-serif" opacity={0.7}>
              grain line
            </text>

            {/* Dimension: shoulder */}
            <g opacity={0.8}>
              <line x1="118" y1="34" x2="282" y2="34" strokeWidth={0.6} />
              <line x1="118" y1="30" x2="118" y2="38" strokeWidth={0.6} />
              <line x1="282" y1="30" x2="282" y2="38" strokeWidth={0.6} />
              <text x="200" y="28" fill="currentColor" fontSize="8" textAnchor="middle" fontFamily="system-ui, sans-serif">
                44″
              </text>
            </g>

            {/* Dimension: body length */}
            <g opacity={0.75}>
              <line x1="44" y1="88" x2="44" y2="312" strokeWidth={0.6} />
              <line x1="40" y1="88" x2="48" y2="88" strokeWidth={0.6} />
              <line x1="40" y1="312" x2="48" y2="312" strokeWidth={0.6} />
              <text
                x="36"
                y="202"
                fill="currentColor"
                fontSize="8"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                transform="rotate(-90 36 202)"
              >
                28½″
              </text>
            </g>

            {/* Construction note */}
            <text x="72" y="138" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity={0.65}>
              ⅝″ S/A
            </text>
            <text x="285" y="255" fill="currentColor" fontSize="7" fontFamily="ui-monospace, monospace" opacity={0.55}>
              HPS
            </text>
          </motion.svg>
        </div>

        {/* Bottom gradient + dialog */}
        <div
          role="dialog"
          aria-label="Sign up to unlock iterate, edit, and export"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/90 to-transparent px-4 pb-6 pt-28 md:px-6 md:pb-8 md:pt-36"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-lg space-y-5">
            <div className="flex gap-2 rounded-xl border border-white/10 bg-zinc-950/40 p-2 shadow-lg backdrop-blur-md md:gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 flex-1 gap-1.5 border-white/15 bg-white/[0.06] text-xs font-medium shadow-sm md:h-10 md:text-sm"
                disabled
              >
                <RefreshCw className="size-3.5 md:size-4" />
                Iterate
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 flex-1 gap-1.5 border-white/15 bg-white/[0.06] text-xs font-medium shadow-sm md:h-10 md:text-sm"
                disabled
              >
                <Pencil className="size-3.5 md:size-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 flex-1 gap-1.5 border-white/15 bg-white/[0.06] text-xs font-medium shadow-sm md:h-10 md:text-sm"
                disabled
              >
                <Download className="size-3.5 md:size-4" />
                Export
              </Button>
            </div>

            <div className="text-center">
              <p className="mb-4 max-w-sm mx-auto text-sm text-muted-foreground">
                Create a free account to iterate, refine, and export your schematics.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/40 hover:from-indigo-600 hover:to-violet-700 sm:w-auto"
              >
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-amber-400/90 underline-offset-4 hover:text-amber-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
