import type {
  Canvas,
  PencilBrush,
  TPointerEventInfo,
  TPointerEvent,
} from "fabric";

type Cleanup = () => void;

export function deactivateAll(canvas: Canvas): void {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  canvas.forEachObject((obj) => {
    obj.selectable = true;
    obj.evented = true;
  });
  canvas.renderAll();
}

export function activateSelectTool(canvas: Canvas): Cleanup {
  deactivateAll(canvas);
  canvas.selection = true;
  return () => deactivateAll(canvas);
}

export async function activatePenTool(
  canvas: Canvas,
  color: string,
  width: number,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.isDrawingMode = true;
  const brush = new fabric.PencilBrush(canvas) as PencilBrush;
  brush.color = color;
  brush.width = width;
  canvas.freeDrawingBrush = brush;
  return () => {
    canvas.isDrawingMode = false;
  };
}

export async function activateLineTool(
  canvas: Canvas,
  color: string,
  width: number,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let line: InstanceType<typeof fabric.Line> | null = null;
  let isDown = false;

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    isDown = true;
    const pointer = canvas.getScenePoint(opt.e);
    line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: color,
      strokeWidth: width,
      selectable: false,
      evented: false,
    });
    canvas.add(line);
  };

  const onMove = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (!isDown || !line) return;
    const pointer = canvas.getScenePoint(opt.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
  };

  const onUp = () => {
    isDown = false;
    if (line) {
      line.selectable = true;
      line.evented = true;
      line.setCoords();
    }
    line = null;
  };

  canvas.on("mouse:down", onDown);
  canvas.on("mouse:move", onMove);
  canvas.on("mouse:up", onUp);

  return () => {
    canvas.off("mouse:down", onDown);
    canvas.off("mouse:move", onMove);
    canvas.off("mouse:up", onUp);
  };
}

export async function activateRectTool(
  canvas: Canvas,
  color: string,
  width: number,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let rect: InstanceType<typeof fabric.Rect> | null = null;
  let isDown = false;
  let originX = 0;
  let originY = 0;

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    isDown = true;
    const pointer = canvas.getScenePoint(opt.e);
    originX = pointer.x;
    originY = pointer.y;
    rect = new fabric.Rect({
      left: originX,
      top: originY,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: color,
      strokeWidth: width,
      selectable: false,
      evented: false,
    });
    canvas.add(rect);
  };

  const onMove = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (!isDown || !rect) return;
    const pointer = canvas.getScenePoint(opt.e);
    const left = Math.min(originX, pointer.x);
    const top = Math.min(originY, pointer.y);
    rect.set({
      left,
      top,
      width: Math.abs(pointer.x - originX),
      height: Math.abs(pointer.y - originY),
    });
    canvas.renderAll();
  };

  const onUp = () => {
    isDown = false;
    if (rect) {
      rect.selectable = true;
      rect.evented = true;
      rect.setCoords();
    }
    rect = null;
  };

  canvas.on("mouse:down", onDown);
  canvas.on("mouse:move", onMove);
  canvas.on("mouse:up", onUp);

  return () => {
    canvas.off("mouse:down", onDown);
    canvas.off("mouse:move", onMove);
    canvas.off("mouse:up", onUp);
  };
}

export async function activateEllipseTool(
  canvas: Canvas,
  color: string,
  width: number,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let ellipse: InstanceType<typeof fabric.Ellipse> | null = null;
  let isDown = false;
  let originX = 0;
  let originY = 0;

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    isDown = true;
    const pointer = canvas.getScenePoint(opt.e);
    originX = pointer.x;
    originY = pointer.y;
    ellipse = new fabric.Ellipse({
      left: originX,
      top: originY,
      rx: 0,
      ry: 0,
      fill: "transparent",
      stroke: color,
      strokeWidth: width,
      selectable: false,
      evented: false,
    });
    canvas.add(ellipse);
  };

  const onMove = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (!isDown || !ellipse) return;
    const pointer = canvas.getScenePoint(opt.e);
    const rx = Math.abs(pointer.x - originX) / 2;
    const ry = Math.abs(pointer.y - originY) / 2;
    ellipse.set({
      left: Math.min(originX, pointer.x),
      top: Math.min(originY, pointer.y),
      rx,
      ry,
    });
    canvas.renderAll();
  };

  const onUp = () => {
    isDown = false;
    if (ellipse) {
      ellipse.selectable = true;
      ellipse.evented = true;
      ellipse.setCoords();
    }
    ellipse = null;
  };

  canvas.on("mouse:down", onDown);
  canvas.on("mouse:move", onMove);
  canvas.on("mouse:up", onUp);

  return () => {
    canvas.off("mouse:down", onDown);
    canvas.off("mouse:move", onMove);
    canvas.off("mouse:up", onUp);
  };
}

export async function activateTextTool(
  canvas: Canvas,
  color: string,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "text";

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    const pointer = canvas.getScenePoint(opt.e);
    const text = new fabric.IText("Type here", {
      left: pointer.x,
      top: pointer.y,
      fontSize: 20,
      fill: color,
      fontFamily: "sans-serif",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  };

  canvas.on("mouse:down", onDown);

  return () => {
    canvas.off("mouse:down", onDown);
  };
}

export function activatePanTool(canvas: Canvas): Cleanup {
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "grab";

  let isPanning = false;
  let lastX = 0;
  let lastY = 0;

  canvas.forEachObject((obj) => {
    obj.selectable = false;
    obj.evented = false;
  });

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    isPanning = true;
    canvas.defaultCursor = "grabbing";
    lastX = opt.e instanceof MouseEvent ? opt.e.clientX : 0;
    lastY = opt.e instanceof MouseEvent ? opt.e.clientY : 0;
  };

  const onMove = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (!isPanning) return;
    const clientX = opt.e instanceof MouseEvent ? opt.e.clientX : 0;
    const clientY = opt.e instanceof MouseEvent ? opt.e.clientY : 0;
    const deltaX = clientX - lastX;
    const deltaY = clientY - lastY;
    lastX = clientX;
    lastY = clientY;

    const vpt = canvas.viewportTransform;
    if (vpt) {
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      canvas.setViewportTransform(vpt);
    }
  };

  const onUp = () => {
    isPanning = false;
    canvas.defaultCursor = "grab";
  };

  canvas.on("mouse:down", onDown);
  canvas.on("mouse:move", onMove);
  canvas.on("mouse:up", onUp);

  return () => {
    canvas.off("mouse:down", onDown);
    canvas.off("mouse:move", onMove);
    canvas.off("mouse:up", onUp);
    canvas.defaultCursor = "default";
  };
}

export async function activateAreaSelectTool(
  canvas: Canvas,
  onAreaSelected: (area: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void,
): Promise<Cleanup> {
  const fabric = await import("fabric");
  deactivateAll(canvas);
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";

  let rect: InstanceType<typeof fabric.Rect> | null = null;
  let isDown = false;
  let originX = 0;
  let originY = 0;

  const onDown = (opt: TPointerEventInfo<TPointerEvent>) => {
    isDown = true;
    const pointer = canvas.getScenePoint(opt.e);
    originX = pointer.x;
    originY = pointer.y;
    rect = new fabric.Rect({
      left: originX,
      top: originY,
      width: 0,
      height: 0,
      fill: "rgba(59, 130, 246, 0.1)",
      stroke: "rgba(59, 130, 246, 0.8)",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });
    canvas.add(rect);
  };

  const onMove = (opt: TPointerEventInfo<TPointerEvent>) => {
    if (!isDown || !rect) return;
    const pointer = canvas.getScenePoint(opt.e);
    const left = Math.min(originX, pointer.x);
    const top = Math.min(originY, pointer.y);
    rect.set({
      left,
      top,
      width: Math.abs(pointer.x - originX),
      height: Math.abs(pointer.y - originY),
    });
    canvas.renderAll();
  };

  const onUp = () => {
    isDown = false;
    if (rect) {
      const area = {
        x: rect.left ?? 0,
        y: rect.top ?? 0,
        width: rect.width ?? 0,
        height: rect.height ?? 0,
      };
      canvas.remove(rect);
      canvas.renderAll();
      if (area.width > 5 && area.height > 5) {
        onAreaSelected(area);
      }
    }
    rect = null;
  };

  canvas.on("mouse:down", onDown);
  canvas.on("mouse:move", onMove);
  canvas.on("mouse:up", onUp);

  return () => {
    canvas.off("mouse:down", onDown);
    canvas.off("mouse:move", onMove);
    canvas.off("mouse:up", onUp);
  };
}
