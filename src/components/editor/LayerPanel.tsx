"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Square,
  Circle,
  Type,
  Minus,
  Pen,
  Image,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

interface LayerItem {
  id: number;
  type: string;
  visible: boolean;
}

const typeIcons: Record<string, React.ElementType> = {
  rect: Square,
  circle: Circle,
  ellipse: Circle,
  "i-text": Type,
  itext: Type,
  text: Type,
  textbox: Type,
  line: Minus,
  path: Pen,
  image: Image,
};

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    rect: "Rectangle",
    circle: "Circle",
    ellipse: "Ellipse",
    "i-text": "Text",
    itext: "Text",
    text: "Text",
    textbox: "Textbox",
    line: "Line",
    path: "Path",
    image: "Image",
    group: "Group",
    polygon: "Polygon",
    polyline: "Polyline",
  };
  return labels[type] || type;
}

export default function LayerPanel() {
  const { canvas } = useEditorStore();
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const refreshLayers = useCallback(() => {
    if (!canvas) {
      setLayers([]);
      return;
    }
    const objects = canvas.getObjects();
    const items: LayerItem[] = objects.map((obj, idx) => ({
      id: idx,
      type: obj.type || "unknown",
      visible: obj.visible !== false,
    }));
    setLayers(items.reverse());
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    refreshLayers();

    const events = [
      "object:added",
      "object:removed",
      "selection:created",
      "selection:updated",
      "selection:cleared",
    ] as const;

    const handler = () => refreshLayers();
    events.forEach((evt) => canvas.on(evt as any, handler));

    const selHandler = () => {
      const active = canvas.getActiveObject();
      if (active) {
        const idx = canvas.getObjects().indexOf(active);
        setSelectedId(idx);
      } else {
        setSelectedId(null);
      }
    };
    canvas.on("selection:created", selHandler);
    canvas.on("selection:updated", selHandler);
    canvas.on("selection:cleared", selHandler);

    return () => {
      events.forEach((evt) => canvas.off(evt as any, handler));
      canvas.off("selection:created", selHandler);
      canvas.off("selection:updated", selHandler);
      canvas.off("selection:cleared", selHandler);
    };
  }, [canvas, refreshLayers]);

  const handleSelectLayer = (idx: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const realIdx = objects.length - 1 - idx;
    if (realIdx >= 0 && realIdx < objects.length) {
      canvas.setActiveObject(objects[realIdx]);
      canvas.renderAll();
      setSelectedId(realIdx);
    }
  };

  const toggleVisibility = (idx: number) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const realIdx = objects.length - 1 - idx;
    if (realIdx >= 0 && realIdx < objects.length) {
      const obj = objects[realIdx];
      obj.visible = !obj.visible;
      canvas.renderAll();
      refreshLayers();
    }
  };

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
        <Layers className="size-8 opacity-40" />
        <p className="text-sm">No layers yet</p>
        <p className="text-xs">Draw something on the canvas</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-0.5 p-2">
        {layers.map((layer, idx) => {
          const Icon = typeIcons[layer.type] || Square;
          const objects = canvas?.getObjects() ?? [];
          const realIdx = objects.length - 1 - idx;
          const isSelected = selectedId === realIdx;

          return (
            <div
              key={`${layer.id}-${idx}`}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-muted",
                isSelected && "bg-accent text-accent-foreground",
              )}
              onClick={() => handleSelectLayer(idx)}
            >
              <Icon className="size-3.5 shrink-0 opacity-60" />
              <span className="flex-1 truncate">
                {getTypeLabel(layer.type)}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(idx);
                }}
              >
                {layer.visible ? (
                  <Eye className="size-3" />
                ) : (
                  <EyeOff className="size-3" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
