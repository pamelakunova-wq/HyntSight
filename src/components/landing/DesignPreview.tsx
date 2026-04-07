"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, RefreshCw, Download } from "lucide-react";

export default function DesignPreview() {
  return (
    <Card className="relative overflow-hidden border border-white/10">
      <CardContent className="p-0">
        {/* Placeholder design preview */}
        <div className="flex items-center justify-center bg-gradient-to-br from-indigo-950/50 to-violet-950/50 p-8">
          <svg
            viewBox="0 0 200 240"
            className="h-64 w-auto text-indigo-300/60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Collar */}
            <path d="M80 50 L100 70 L120 50" />
            {/* Shoulders & body */}
            <path d="M60 55 L80 50 L100 70 L120 50 L140 55" />
            {/* Left sleeve */}
            <path d="M60 55 L40 100 L55 105 L70 75" />
            {/* Right sleeve */}
            <path d="M140 55 L160 100 L145 105 L130 75" />
            {/* Body sides */}
            <path d="M70 75 L65 180" />
            <path d="M130 75 L135 180" />
            {/* Hem */}
            <path d="M65 180 L135 180" />
            {/* Center line */}
            <path d="M100 70 L100 180" strokeDasharray="4 4" />
            {/* Pocket */}
            <rect x="108" y="100" width="18" height="20" rx="2" />
          </svg>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-white/10 p-4">
          <Button variant="outline" className="flex-1 gap-2" disabled>
            <RefreshCw className="size-4" /> Iterate
          </Button>
          <Button variant="outline" className="flex-1 gap-2" disabled>
            <Pencil className="size-4" /> Edit
          </Button>
          <Button variant="outline" className="flex-1 gap-2" disabled>
            <Download className="size-4" /> Export
          </Button>
        </div>

        {/* Overlay CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
          <p className="max-w-xs text-center text-sm text-muted-foreground">
            Sign up free to iterate, edit, and export your designs
          </p>
          <Button
            render={<Link href="/sign-up" />}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
          >
            Create Free Account
          </Button>
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
