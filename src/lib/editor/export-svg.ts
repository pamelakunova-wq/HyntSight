import type { Canvas } from "fabric";

export function exportAsSVG(canvas: Canvas): string {
  return canvas.toSVG();
}

export function downloadSVG(
  canvas: Canvas,
  filename: string = "design.svg",
): void {
  const svg = exportAsSVG(canvas);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
