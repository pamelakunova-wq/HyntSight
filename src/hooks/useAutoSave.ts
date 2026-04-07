"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { saveDesign } from "@/lib/editor/serialization";

export function useAutoSave(designId: string, userId: string): void {
  const { canvas, setIsSaving, setLastSaved } = useEditorStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const handleChange = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await saveDesign(canvas, designId, userId);
          setLastSaved(new Date());
        } catch (e) {
          console.error("Auto-save failed:", e);
        } finally {
          setIsSaving(false);
        }
      }, 3000);
    };

    canvas.on("object:modified", handleChange);
    canvas.on("object:added", handleChange);
    canvas.on("object:removed", handleChange);

    return () => {
      canvas.off("object:modified", handleChange);
      canvas.off("object:added", handleChange);
      canvas.off("object:removed", handleChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [canvas, designId, userId, setIsSaving, setLastSaved]);
}
