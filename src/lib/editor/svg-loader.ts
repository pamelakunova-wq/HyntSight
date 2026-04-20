import type { Canvas, FabricObject } from "fabric";

/**
 * Load an SVG string into a Fabric.js canvas as individual editable objects.
 * Each <g>, <path>, <rect>, etc. becomes a separate selectable object.
 */
export async function loadSVGToCanvas(
  canvas: Canvas,
  svgString: string
): Promise<FabricObject[]> {
  const fabric = await import("fabric");

  canvas.clear();
  canvas.backgroundColor = "#ffffff";

  const { objects } = await fabric.loadSVGFromString(svgString);
  const validObjects = objects.filter(Boolean) as FabricObject[];

  if (validObjects.length === 0) {
    canvas.renderAll();
    return [];
  }

  for (const obj of validObjects) {
    canvas.add(obj);
  }

  canvas.renderAll();
  fitCanvasToContent(canvas, validObjects, fabric);

  return validObjects;
}

/**
 * Center and scale canvas viewport so all objects are visible with padding.
 */
function fitCanvasToContent(
  canvas: Canvas,
  objects: FabricObject[],
  fabric: typeof import("fabric")
) {
  if (objects.length === 0) return;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const obj of objects) {
    const bound = obj.getBoundingRect();
    minX = Math.min(minX, bound.left);
    minY = Math.min(minY, bound.top);
    maxX = Math.max(maxX, bound.left + bound.width);
    maxY = Math.max(maxY, bound.top + bound.height);
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const canvasWidth = canvas.width ?? 800;
  const canvasHeight = canvas.height ?? 600;

  const padding = 40;
  const scaleX = (canvasWidth - padding * 2) / contentWidth;
  const scaleY = (canvasHeight - padding * 2) / contentHeight;
  const zoom = Math.min(scaleX, scaleY, 2);

  const centerX = minX + contentWidth / 2;
  const centerY = minY + contentHeight / 2;

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.zoomToPoint(
    new fabric.Point(canvasWidth / 2, canvasHeight / 2),
    zoom
  );

  const vpt = canvas.viewportTransform!;
  vpt[4] = canvasWidth / 2 - centerX * zoom;
  vpt[5] = canvasHeight / 2 - centerY * zoom;
  canvas.setViewportTransform(vpt);
  canvas.renderAll();
}

/**
 * Generate a data URL thumbnail from the current canvas state.
 */
export function generateThumbnail(
  canvas: Canvas,
  maxSize = 400
): string {
  const width = canvas.width ?? 800;
  const height = canvas.height ?? 600;
  const scale = Math.min(maxSize / width, maxSize / height, 1);

  return canvas.toDataURL({
    format: "png",
    multiplier: scale,
  });
}
