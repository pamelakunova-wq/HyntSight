import Link from "next/link";
import type { Design } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  draft: "secondary",
  generating: "outline",
  ready: "default",
  exported: "default",
};

export function DesignCard({ design }: { design: Design }) {
  return (
    <Link href={`/studio/${design.id}`}>
      <Card className="group cursor-pointer transition-all hover:ring-2 hover:ring-primary/50">
        {design.thumbnail_url ? (
          <img
            src={design.thumbnail_url}
            alt={design.name}
            className="h-40 w-full object-cover rounded-t-xl"
          />
        ) : (
          <div className="h-40 w-full rounded-t-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        )}
        <CardContent className="flex flex-col gap-2 pt-3">
          <p className="font-medium truncate">{design.name}</p>
          <div className="flex items-center gap-2">
            {design.garment_type && (
              <Badge variant="secondary">{design.garment_type}</Badge>
            )}
            <Badge variant={statusColors[design.status] ?? "secondary"}>
              {design.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {relativeTime(design.updated_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
