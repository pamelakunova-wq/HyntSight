import type { Canvas } from "fabric";
import jsPDF from "jspdf";

export function exportAsPDF(
  canvas: Canvas,
  options: { title?: string } = {},
): jsPDF {
  const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
  const canvasWidth = canvas.width ?? 800;
  const canvasHeight = canvas.height ?? 600;
  const isLandscape = canvasWidth > canvasHeight;

  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "px",
    format: [canvasWidth, canvasHeight + (options.title ? 40 : 0)],
  });

  if (options.title) {
    pdf.setFontSize(16);
    pdf.text(options.title, 20, 25);
    pdf.addImage(dataUrl, "PNG", 0, 40, canvasWidth, canvasHeight);
  } else {
    pdf.addImage(dataUrl, "PNG", 0, 0, canvasWidth, canvasHeight);
  }

  return pdf;
}

export function downloadPDF(
  canvas: Canvas,
  filename: string = "design.pdf",
  options: { title?: string } = {},
): void {
  const pdf = exportAsPDF(canvas, options);
  pdf.save(filename);
}
