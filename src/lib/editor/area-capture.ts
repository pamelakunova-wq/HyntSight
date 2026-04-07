import type { Canvas } from "fabric";

export function captureSelectedArea(
  canvas: Canvas,
  area: { x: number; y: number; width: number; height: number },
): string {
  return canvas.toDataURL({
    format: "png",
    left: area.x,
    top: area.y,
    width: area.width,
    height: area.height,
    multiplier: 1,
  });
}
