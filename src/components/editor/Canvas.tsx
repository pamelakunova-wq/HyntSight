"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { HistoryManager } from "@/lib/editor/history";
import {
  deactivateAll,
  activateSelectTool,
  activatePenTool,
  activateLineTool,
  activateRectTool,
  activateEllipseTool,
  activateTextTool,
  activatePanTool,
  activateAreaSelectTool,
} from "@/lib/editor/drawing-tools";
import type { EditorTool } from "@/stores/editorStore";

let historyManagerInstance: HistoryManager | null = null;

export function getHistoryManager(): HistoryManager | null {
  return historyManagerInstance;
}

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const {
    setCanvas,
    setZoom,
    activeTool,
    activeColor,
    strokeWidth,
    setCanUndo,
    setCanRedo,
    setSelectedFeedbackArea,
    setActiveTool,
  } = useEditorStore();

  const canvasInstanceRef = useRef<import("fabric").Canvas | null>(null);
  const historyRef = useRef<HistoryManager | null>(null);

  const applyTool = useCallback(
    async (
      canvas: import("fabric").Canvas,
      tool: EditorTool,
      color: string,
      width: number,
    ) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      switch (tool) {
        case "select":
          cleanupRef.current = activateSelectTool(canvas);
          break;
        case "pen":
          cleanupRef.current = await activatePenTool(canvas, color, width);
          break;
        case "line":
          cleanupRef.current = await activateLineTool(canvas, color, width);
          break;
        case "rectangle":
          cleanupRef.current = await activateRectTool(canvas, color, width);
          break;
        case "ellipse":
          cleanupRef.current = await activateEllipseTool(canvas, color, width);
          break;
        case "text":
          cleanupRef.current = await activateTextTool(canvas, color);
          break;
        case "pan":
          cleanupRef.current = activatePanTool(canvas);
          break;
        case "area-select":
          cleanupRef.current = await activateAreaSelectTool(
            canvas,
            (area) => {
              setSelectedFeedbackArea(area);
              setActiveTool("select");
            },
          );
          break;
      }
    },
    [setSelectedFeedbackArea, setActiveTool],
  );

  useEffect(() => {
    if (canvasInstanceRef.current) {
      applyTool(canvasInstanceRef.current, activeTool, activeColor, strokeWidth);
    }
  }, [activeTool, activeColor, strokeWidth, applyTool]);

  useEffect(() => {
    let fabricCanvas: import("fabric").Canvas | null = null;
    let observer: ResizeObserver | null = null;

    async function init() {
      const fabric = await import("fabric");
      if (!canvasRef.current || !containerRef.current) return;

      fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        selection: true,
        preserveObjectStacking: true,
      });

      canvasInstanceRef.current = fabricCanvas;

      const resize = () => {
        if (!containerRef.current || !fabricCanvas) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        fabricCanvas.setDimensions({ width, height });
        fabricCanvas.renderAll();
      };

      resize();
      observer = new ResizeObserver(resize);
      observer.observe(containerRef.current);

      fabricCanvas.on("mouse:wheel", (opt) => {
        const delta = opt.e.deltaY;
        let zoom = fabricCanvas!.getZoom();
        zoom *= 0.999 ** delta;
        zoom = Math.min(Math.max(0.1, zoom), 5);
        fabricCanvas!.zoomToPoint(
          new fabric.Point(opt.e.offsetX, opt.e.offsetY),
          zoom,
        );
        setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      const history = new HistoryManager(fabricCanvas);
      historyRef.current = history;
      historyManagerInstance = history;
      history.saveState();

      fabricCanvas.on("object:added", () => {
        history.saveState();
        setCanUndo(history.canUndo);
        setCanRedo(history.canRedo);
      });
      fabricCanvas.on("object:modified", () => {
        history.saveState();
        setCanUndo(history.canUndo);
        setCanRedo(history.canRedo);
      });
      fabricCanvas.on("object:removed", () => {
        history.saveState();
        setCanUndo(history.canUndo);
        setCanRedo(history.canRedo);
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" && !e.repeat) {
          e.preventDefault();
          useEditorStore.getState().setActiveTool("pan");
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          history.undo().then(() => {
            setCanUndo(history.canUndo);
            setCanRedo(history.canRedo);
          });
        }
        if (
          (e.ctrlKey || e.metaKey) &&
          e.key === "z" &&
          e.shiftKey
        ) {
          e.preventDefault();
          history.redo().then(() => {
            setCanUndo(history.canUndo);
            setCanRedo(history.canRedo);
          });
        }
        if (e.key === "Delete" || e.key === "Backspace") {
          const active = fabricCanvas?.getActiveObjects();
          if (active && active.length > 0) {
            const target = (e.target as HTMLElement)?.tagName;
            if (target === "INPUT" || target === "TEXTAREA") return;
            active.forEach((obj) => fabricCanvas?.remove(obj));
            fabricCanvas?.discardActiveObject();
            fabricCanvas?.renderAll();
          }
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === "Space") {
          useEditorStore.getState().setActiveTool("select");
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      setCanvas(fabricCanvas);

      (fabricCanvas as any).__keydownHandler = handleKeyDown;
      (fabricCanvas as any).__keyupHandler = handleKeyUp;
    }

    init();

    return () => {
      if (fabricCanvas) {
        const kd = (fabricCanvas as any).__keydownHandler;
        const ku = (fabricCanvas as any).__keyupHandler;
        if (kd) document.removeEventListener("keydown", kd);
        if (ku) document.removeEventListener("keyup", ku);
        fabricCanvas.dispose();
        canvasInstanceRef.current = null;
        historyManagerInstance = null;
        setCanvas(null);
      }
      if (observer) observer.disconnect();
    };
  }, [setCanvas, setZoom, setCanUndo, setCanRedo]);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-neutral-100"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
