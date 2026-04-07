"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock, ArrowRight } from "lucide-react";
import type { DesignVersion } from "@/types";
import { cn } from "@/lib/utils";

interface VersionHistoryProps {
  versions: DesignVersion[];
  activeVersionId?: string;
  onLoadVersion: (version: DesignVersion) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function VersionHistory({
  versions,
  activeVersionId,
  onLoadVersion,
}: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
        <History className="size-8 opacity-40" />
        <p className="text-sm">No versions yet</p>
        <p className="text-xs">Versions are created when you generate or iterate</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-2">
        {versions.map((version) => {
          const isActive = version.id === activeVersionId;

          return (
            <div
              key={version.id}
              className={cn(
                "group relative rounded-lg border p-3 transition-colors",
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : "hover:border-muted-foreground/20 hover:bg-muted/50",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    v{version.version_number}
                  </Badge>
                  {isActive && (
                    <span className="text-[10px] font-medium text-primary">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="size-3" />
                  {formatDate(version.created_at)}
                </div>
              </div>

              {version.generated_image_url && (
                <div className="mt-2 overflow-hidden rounded border bg-white">
                  <img
                    src={version.generated_image_url}
                    alt={`Version ${version.version_number}`}
                    className="h-20 w-full object-contain"
                  />
                </div>
              )}

              {version.feedback_prompt && (
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {version.feedback_prompt}
                </p>
              )}

              {!isActive && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="mt-2 w-full opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => onLoadVersion(version)}
                >
                  <ArrowRight className="size-3" />
                  Load Version
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
