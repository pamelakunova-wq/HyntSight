"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, Loader2 } from "lucide-react";
import type { ExportFormat, Plan } from "@/types";
import { PLAN_LIMITS } from "@/types";
import { cn } from "@/lib/utils";

interface ExportDialogProps {
  userPlan: Plan;
  onExport: (format: ExportFormat, quality?: number) => Promise<void>;
  children: React.ReactNode;
}

const formats: { value: ExportFormat; label: string; description: string }[] = [
  { value: "svg", label: "SVG", description: "Scalable vector, ideal for production" },
  { value: "png", label: "PNG", description: "Raster image with transparency" },
  { value: "dxf", label: "DXF", description: "CAD format for pattern cutting" },
  { value: "pdf", label: "PDF", description: "Print-ready document" },
];

const pngQualities = [
  { value: 1, label: "1x (Standard)" },
  { value: 2, label: "2x (High)" },
  { value: 4, label: "4x (Ultra)" },
];

export default function ExportDialog({
  userPlan,
  onExport,
  children,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("png");
  const [pngQuality, setPngQuality] = useState(2);
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const allowedFormats = PLAN_LIMITS[userPlan].exports;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(
        selectedFormat,
        selectedFormat === "png" ? pngQuality : undefined,
      );
      setOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<>{children}</>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose a format to export your design.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Label className="text-sm font-medium">Format</Label>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((fmt) => {
              const isAllowed = allowedFormats.includes(fmt.value);
              const isSelected = selectedFormat === fmt.value;

              return (
                <button
                  key={fmt.value}
                  type="button"
                  disabled={!isAllowed}
                  onClick={() => setSelectedFormat(fmt.value)}
                  className={cn(
                    "relative flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                    isSelected && isAllowed
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50",
                    !isAllowed && "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">{fmt.label}</span>
                    {!isAllowed && <Lock className="size-3 text-muted-foreground" />}
                  </div>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">
                    {fmt.description}
                  </span>
                  {!isAllowed && (
                    <Badge variant="outline" className="mt-1.5 text-[10px]">
                      Pro plan
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {selectedFormat === "png" && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm">Quality</Label>
              <div className="flex gap-2">
                {pngQualities.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => setPngQuality(q.value)}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors",
                      pngQuality === q.value
                        ? "border-primary bg-primary/5 font-medium"
                        : "hover:bg-muted/50",
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={isExporting || !allowedFormats.includes(selectedFormat)}
          >
            {isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="size-4" />
                Export as {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
