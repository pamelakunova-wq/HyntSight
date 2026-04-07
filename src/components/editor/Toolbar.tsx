"use client";

import {
  MousePointer2,
  Pen,
  Minus,
  Square,
  Circle,
  Type,
  Hand,
  BoxSelect,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorStore, type EditorTool } from "@/stores/editorStore";
import { getHistoryManager } from "@/components/editor/Canvas";
import { fitToScreen, zoomIn, zoomOut, getZoomPercent } from "@/lib/editor/viewport";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const tools: { tool: EditorTool; icon: React.ElementType; label: string }[] = [
  { tool: "select", icon: MousePointer2, label: "Select (V)" },
  { tool: "pen", icon: Pen, label: "Pen (P)" },
  { tool: "line", icon: Minus, label: "Line (L)" },
  { tool: "rectangle", icon: Square, label: "Rectangle (R)" },
  { tool: "ellipse", icon: Circle, label: "Ellipse (E)" },
  { tool: "text", icon: Type, label: "Text (T)" },
  { tool: "pan", icon: Hand, label: "Pan (Space)" },
  { tool: "area-select", icon: BoxSelect, label: "Area Select" },
];

const strokeWidths = [1, 2, 4];

export default function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    strokeWidth,
    setStrokeWidth,
    canUndo,
    canRedo,
    canvas,
    zoom,
    setZoom,
    setCanUndo,
    setCanRedo,
  } = useEditorStore();

  const handleUndo = async () => {
    const history = getHistoryManager();
    if (!history) return;
    await history.undo();
    setCanUndo(history.canUndo);
    setCanRedo(history.canRedo);
  };

  const handleRedo = async () => {
    const history = getHistoryManager();
    if (!history) return;
    await history.redo();
    setCanUndo(history.canUndo);
    setCanRedo(history.canRedo);
  };

  const handleZoomIn = () => {
    if (!canvas) return;
    const z = zoomIn(canvas);
    setZoom(z);
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const z = zoomOut(canvas);
    setZoom(z);
  };

  const handleFit = () => {
    if (!canvas) return;
    const z = fitToScreen(canvas);
    setZoom(z);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-1 border-r bg-background px-1.5 py-2">
        {tools.map(({ tool, icon: Icon, label }) => (
          <Tooltip key={tool}>
            <TooltipTrigger
              render={
                <Button
                  variant={activeTool === tool ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    activeTool === tool && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setActiveTool(tool)}
                />
              }
            >
              <Icon className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}

        <Separator className="my-1 w-6" />

        <Tooltip>
          <TooltipTrigger
            render={
              <label className="flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted" />
            }
          >
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="size-5 cursor-pointer rounded border-0 p-0"
            />
          </TooltipTrigger>
          <TooltipContent side="right">Stroke Color</TooltipContent>
        </Tooltip>

        <div className="flex flex-col gap-0.5">
          {strokeWidths.map((w) => (
            <Tooltip key={w}>
              <TooltipTrigger
                render={
                  <Button
                    variant={strokeWidth === w ? "secondary" : "ghost"}
                    size="icon-xs"
                    className={cn(
                      strokeWidth === w && "bg-accent",
                    )}
                    onClick={() => setStrokeWidth(w)}
                  />
                }
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: w * 3 + 4, height: w * 3 + 4 }}
                />
              </TooltipTrigger>
              <TooltipContent side="right">{w}px</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator className="my-1 w-6" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                disabled={!canUndo}
                onClick={handleUndo}
              />
            }
          >
            <Undo2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                disabled={!canRedo}
                onClick={handleRedo}
              />
            }
          >
            <Redo2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>

        <Separator className="my-1 w-6" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" onClick={handleZoomIn} />
            }
          >
            <ZoomIn className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Zoom In</TooltipContent>
        </Tooltip>

        <span className="text-[10px] text-muted-foreground tabular-nums">
          {Math.round(zoom * 100)}%
        </span>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" onClick={handleZoomOut} />
            }
          >
            <ZoomOut className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" onClick={handleFit} />
            }
          >
            <Maximize className="size-4" />
          </TooltipTrigger>
          <TooltipContent side="right">Fit to Screen</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
