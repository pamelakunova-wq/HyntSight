import type { Canvas } from "fabric";

export function fitToScreen(canvas: Canvas): number {
  const objects = canvas.getObjects();
  if (objects.length === 0) {
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    return 1;
  }

  const bound = canvas.calcViewportBoundaries();
  const group = canvas.getObjects();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const obj of group) {
    const br = obj.getBoundingRect();
    minX = Math.min(minX, br.left);
    minY = Math.min(minY, br.top);
    maxX = Math.max(maxX, br.left + br.width);
    maxY = Math.max(maxY, br.top + br.height);
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  if (contentWidth === 0 || contentHeight === 0) return 1;

  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const padding = 40;

  const scaleX = (canvasWidth - padding * 2) / contentWidth;
  const scaleY = (canvasHeight - padding * 2) / contentHeight;
  const zoom = Math.min(scaleX, scaleY, 5);

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  canvas.zoomToPoint({ x: canvasWidth / 2, y: canvasHeight / 2 } as any, zoom);

  const vpt = canvas.viewportTransform;
  if (vpt) {
    vpt[4] += canvasWidth / 2 - centerX * zoom;
    vpt[5] += canvasHeight / 2 - centerY * zoom;
    canvas.setViewportTransform(vpt);
  }

  canvas.renderAll();
  return zoom;
}

export function zoomIn(canvas: Canvas): number {
  const current = canvas.getZoom();
  const next = Math.min(current + 0.25, 5);
  const center = {
    x: canvas.getWidth() / 2,
    y: canvas.getHeight() / 2,
  };
  canvas.zoomToPoint(center as any, next);
  canvas.renderAll();
  return next;
}

export function zoomOut(canvas: Canvas): number {
  const current = canvas.getZoom();
  const next = Math.max(current - 0.25, 0.1);
  const center = {
    x: canvas.getWidth() / 2,
    y: canvas.getHeight() / 2,
  };
  canvas.zoomToPoint(center as any, next);
  canvas.renderAll();
  return next;
}

export function getZoomPercent(canvas: Canvas): string {
  return `${Math.round(canvas.getZoom() * 100)}%`;
}
