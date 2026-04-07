import type { Canvas } from "fabric";

const MAX_STATES = 50;

export class HistoryManager {
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private canvas: Canvas;
  private locked = false;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  saveState(): void {
    if (this.locked) return;
    const json = JSON.stringify(this.canvas.toJSON());
    this.undoStack.push(json);
    if (this.undoStack.length > MAX_STATES) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  async undo(): Promise<void> {
    if (this.undoStack.length === 0) return;
    this.locked = true;
    const currentState = JSON.stringify(this.canvas.toJSON());
    this.redoStack.push(currentState);
    const prev = this.undoStack.pop()!;
    await this.canvas.loadFromJSON(prev);
    this.canvas.renderAll();
    this.locked = false;
  }

  async redo(): Promise<void> {
    if (this.redoStack.length === 0) return;
    this.locked = true;
    const currentState = JSON.stringify(this.canvas.toJSON());
    this.undoStack.push(currentState);
    const next = this.redoStack.pop()!;
    await this.canvas.loadFromJSON(next);
    this.canvas.renderAll();
    this.locked = false;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
