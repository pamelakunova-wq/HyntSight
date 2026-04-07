import { create } from "zustand";
import type { Canvas } from "fabric";

export type EditorTool =
  | "select"
  | "pen"
  | "line"
  | "rectangle"
  | "ellipse"
  | "text"
  | "pan"
  | "area-select";

interface EditorState {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  activeTool: EditorTool;
  setActiveTool: (tool: EditorTool) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (v: boolean) => void;
  setCanRedo: (v: boolean) => void;
  selectedFeedbackArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  setSelectedFeedbackArea: (
    area: { x: number; y: number; width: number; height: number } | null,
  ) => void;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  lastSaved: Date | null;
  setLastSaved: (d: Date | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
  activeColor: "#000000",
  setActiveColor: (color) => set({ activeColor: color }),
  strokeWidth: 2,
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  canUndo: false,
  canRedo: false,
  setCanUndo: (v) => set({ canUndo: v }),
  setCanRedo: (v) => set({ canRedo: v }),
  selectedFeedbackArea: null,
  setSelectedFeedbackArea: (area) => set({ selectedFeedbackArea: area }),
  isSaving: false,
  setIsSaving: (v) => set({ isSaving: v }),
  lastSaved: null,
  setLastSaved: (d) => set({ lastSaved: d }),
}));
