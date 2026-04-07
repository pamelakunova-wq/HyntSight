import type { Canvas, FabricObject } from "fabric";
import { FabricText } from "fabric";

type FabricObjectWithData = FabricObject & {
  data?: { isWatermark?: boolean };
};

export function exportAsPNG(
  canvas: Canvas,
  options: { scale?: number; watermark?: boolean } = {},
): string {
  const { scale = 2, watermark = false } = options;

  if (watermark) {
    addWatermark(canvas);
  }

  const dataUrl = canvas.toDataURL({
    format: "png",
    multiplier: scale,
  });

  if (watermark) {
    removeWatermark(canvas);
  }

  return dataUrl;
}

function addWatermark(canvas: Canvas): void {
  const width = canvas.width ?? 0;
  const height = canvas.height ?? 0;
  const positions = [
    { left: width * 0.25, top: height * 0.25 },
    { left: width * 0.75, top: height * 0.25 },
    { left: width * 0.5, top: height * 0.5 },
    { left: width * 0.25, top: height * 0.75 },
    { left: width * 0.75, top: height * 0.75 },
  ];

  for (const pos of positions) {
    const text = new FabricText("HyntSight", {
      left: pos.left,
      top: pos.top,
      fontSize: 48,
      fill: "rgba(0, 0, 0, 0.15)",
      angle: -30,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
      data: { isWatermark: true },
    });
    canvas.add(text);
  }
  canvas.renderAll();
}

function removeWatermark(canvas: Canvas): void {
  const watermarks = canvas
    .getObjects()
    .filter(
      (obj): obj is FabricObjectWithData =>
        Boolean((obj as FabricObjectWithData).data?.isWatermark),
    );
  for (const wm of watermarks) {
    canvas.remove(wm);
  }
  canvas.renderAll();
}

export function downloadPNG(
  canvas: Canvas,
  filename: string = "design.png",
  options: { scale?: number; watermark?: boolean } = {},
): void {
  const dataUrl = exportAsPNG(canvas, options);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
