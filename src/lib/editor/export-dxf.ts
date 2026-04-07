import type { Canvas, Circle, Ellipse, IText, Line, Rect } from "fabric";
import { DxfWriter, point3d } from "@tarikjabiri/dxf";

type FabricObjectWithData = {
  type?: string;
  data?: { isWatermark?: boolean };
  left?: number;
  top?: number;
};

function objectType(obj: FabricObjectWithData): string {
  return (obj.type ?? "").toLowerCase();
}

export function exportAsDXF(canvas: Canvas): string {
  const dxf = new DxfWriter();
  const canvasHeight = canvas.height ?? 1000;
  const objects = canvas.getObjects() as FabricObjectWithData[];

  for (const obj of objects) {
    if (obj.data?.isWatermark) continue;
    if (objectType(obj) === "image") continue;

    const left = obj.left ?? 0;
    const top = obj.top ?? 0;
    const flipY = (y: number) => canvasHeight - y;

    const t = objectType(obj);

    if (t === "line") {
      const line = obj as unknown as Line;
      const x1 = left + (line.x1 ?? 0);
      const y1 = top + (line.y1 ?? 0);
      const x2 = left + (line.x2 ?? 0);
      const y2 = top + (line.y2 ?? 0);
      dxf.addLine(point3d(x1, flipY(y1)), point3d(x2, flipY(y2)));
    } else if (t === "rect") {
      const rect = obj as unknown as Rect;
      const w = (rect.width ?? 0) * (rect.scaleX ?? 1);
      const h = (rect.height ?? 0) * (rect.scaleY ?? 1);
      const x = left;
      const y = flipY(top);
      dxf.addLine(point3d(x, y), point3d(x + w, y));
      dxf.addLine(point3d(x + w, y), point3d(x + w, y - h));
      dxf.addLine(point3d(x + w, y - h), point3d(x, y - h));
      dxf.addLine(point3d(x, y - h), point3d(x, y));
    } else if (t === "circle") {
      const circle = obj as unknown as Circle;
      const radius = (circle.radius ?? 0) * (circle.scaleX ?? 1);
      const cx = left + radius;
      const cy = flipY(top + radius);
      dxf.addCircle(point3d(cx, cy, 0), radius);
    } else if (t === "ellipse") {
      const ellipse = obj as unknown as Ellipse;
      const rx = (ellipse.rx ?? 0) * (ellipse.scaleX ?? 1);
      const ry = (ellipse.ry ?? 0) * (ellipse.scaleY ?? 1);
      const cx = left + rx;
      const cy = flipY(top + ry);
      const ratio = rx !== 0 ? ry / rx : 0;
      dxf.addEllipse(
        point3d(cx, cy, 0),
        point3d(rx, 0, 0),
        ratio,
        0,
        2 * Math.PI,
      );
    } else if (t === "i-text" || t === "text" || t === "textbox") {
      const text = obj as unknown as IText;
      const fontSize = (text.fontSize ?? 12) * (text.scaleY ?? 1);
      dxf.addText(point3d(left, flipY(top), 0), fontSize, text.text ?? "");
    }
  }

  return dxf.stringify();
}

export function downloadDXF(
  canvas: Canvas,
  filename: string = "design.dxf",
): void {
  const dxfString = exportAsDXF(canvas);
  const blob = new Blob([dxfString], { type: "application/dxf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
