"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/stores/editorStore";
import { Settings2 } from "lucide-react";

interface ObjectProps {
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

const defaultProps: ObjectProps = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  angle: 0,
  fill: "",
  stroke: "",
  strokeWidth: 0,
  opacity: 1,
};

export default function PropertiesPanel() {
  const { canvas } = useEditorStore();
  const [props, setProps] = useState<ObjectProps | null>(null);

  const readProps = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) {
      setProps(null);
      return;
    }
    const br = active.getBoundingRect();
    setProps({
      left: Math.round(active.left ?? 0),
      top: Math.round(active.top ?? 0),
      width: Math.round(br.width),
      height: Math.round(br.height),
      angle: Math.round(active.angle ?? 0),
      fill: typeof active.fill === "string" ? active.fill : "",
      stroke: typeof active.stroke === "string" ? active.stroke : "",
      strokeWidth: active.strokeWidth ?? 0,
      opacity: active.opacity ?? 1,
    });
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    readProps();

    const events = [
      "selection:created",
      "selection:updated",
      "selection:cleared",
      "object:modified",
      "object:scaling",
      "object:moving",
      "object:rotating",
    ] as const;

    events.forEach((evt) => canvas.on(evt as any, readProps));

    return () => {
      events.forEach((evt) => canvas.off(evt as any, readProps));
    };
  }, [canvas, readProps]);

  const updateProp = (key: keyof ObjectProps, value: number | string) => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    if (key === "width") {
      const scaleX = (value as number) / (active.width ?? 1);
      active.set("scaleX", scaleX);
    } else if (key === "height") {
      const scaleY = (value as number) / (active.height ?? 1);
      active.set("scaleY", scaleY);
    } else {
      active.set(key as any, value);
    }
    active.setCoords();
    canvas.renderAll();
    readProps();
  };

  if (!props) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
        <Settings2 className="size-8 opacity-40" />
        <p className="text-sm">No object selected</p>
        <p className="text-xs">Select an object to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3">
      <section>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Position & Size
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={props.left}
              onChange={(e) => updateProp("left", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={props.top}
              onChange={(e) => updateProp("top", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">W</Label>
            <Input
              type="number"
              value={props.width}
              onChange={(e) => updateProp("width", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">H</Label>
            <Input
              type="number"
              value={props.height}
              onChange={(e) => updateProp("height", Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Rotation</Label>
            <Input
              type="number"
              value={props.angle}
              onChange={(e) => updateProp("angle", Number(e.target.value))}
              className="h-7 text-xs"
              min={0}
              max={360}
            />
          </div>
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Appearance
        </h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label className="w-14 text-xs">Fill</Label>
            <input
              type="color"
              value={props.fill || "#000000"}
              onChange={(e) => updateProp("fill", e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border p-0.5"
            />
            <Input
              value={props.fill}
              onChange={(e) => updateProp("fill", e.target.value)}
              className="h-7 flex-1 text-xs"
              placeholder="transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="w-14 text-xs">Stroke</Label>
            <input
              type="color"
              value={props.stroke || "#000000"}
              onChange={(e) => updateProp("stroke", e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border p-0.5"
            />
            <Input
              value={props.stroke}
              onChange={(e) => updateProp("stroke", e.target.value)}
              className="h-7 flex-1 text-xs"
              placeholder="none"
            />
          </div>
          <div>
            <Label className="text-xs">Stroke Width</Label>
            <Input
              type="number"
              value={props.strokeWidth}
              onChange={(e) =>
                updateProp("strokeWidth", Number(e.target.value))
              }
              className="h-7 text-xs"
              min={0}
            />
          </div>
          <div>
            <Label className="text-xs">Opacity</Label>
            <Input
              type="number"
              value={Math.round(props.opacity * 100)}
              onChange={(e) =>
                updateProp("opacity", Number(e.target.value) / 100)
              }
              className="h-7 text-xs"
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
