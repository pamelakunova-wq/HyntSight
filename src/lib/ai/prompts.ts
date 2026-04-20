const SVG_SYSTEM_PROMPT = `You are an expert fashion technical designer who outputs SVG code for production-ready flat sketches.

CRITICAL RULES:
1. Respond with a single valid SVG document inside <svg>...</svg> tags.
2. Use viewBox="0 0 800 1000" (portrait, unitless coordinates).
3. Use ONLY black strokes on a white/transparent background. Default stroke-width="1.5".
4. Group related garment parts using <g id="part-name"> with descriptive IDs:
   - body-front, body-back, left-sleeve, right-sleeve, collar, hem, waistband,
   - pocket-left, pocket-right, placket, cuff-left, cuff-right, hood, zipper, etc.
5. Use <path>, <line>, <polyline>, <rect>, <circle>, <ellipse> elements.
   Keep paths simple (cubic bezier preferred, avoid excessive control points).
6. Add <text> annotation elements for key measurements or construction notes
   (font-size="12", fill="#666", font-family="sans-serif").
7. Maintain bilateral symmetry for symmetric garments.
8. Show standard fashion flat sketch conventions: seam lines (dashed),
   topstitching (parallel lines), buttons/snaps (small circles), zipper teeth
   (zigzag or ladder pattern).
9. Center the garment in the viewBox with reasonable padding (~50px).
10. Do NOT include <style> blocks, CSS classes, or inline JavaScript.
    Use only inline SVG attributes (stroke, fill, stroke-dasharray, etc.).
11. Do NOT include raster images (<image> tags) inside the SVG.

After the SVG block, you may optionally add brief design notes about construction details, fabric recommendations, or technical considerations.`;

export function buildSVGGenerationPrompt(
  userPrompt: string,
  garmentType?: string
): string {
  const typeHint = garmentType
    ? `\nGarment type: ${garmentType}. Include standard construction details for this type (seams, closures, typical panels).`
    : "";

  return `${SVG_SYSTEM_PROMPT}
${typeHint}

Create a professional technical flat sketch as SVG for:

${userPrompt}

Show the FRONT VIEW with all construction details clearly visible. Output the complete SVG code.`;
}

export function buildSVGIterationPrompt(
  currentSVG: string,
  originalPrompt: string,
  feedback: string,
  selectedArea?: { x: number; y: number; width: number; height: number }
): string {
  const areaContext = selectedArea
    ? `\nThe user selected a specific region to modify (viewBox coordinates): x=${selectedArea.x}, y=${selectedArea.y}, width=${selectedArea.width}, height=${selectedArea.height}. Focus changes within or near this region while keeping the rest intact.`
    : "";

  return `${SVG_SYSTEM_PROMPT}

Here is the CURRENT SVG of the garment flat sketch that the user wants to modify:

\`\`\`svg
${currentSVG}
\`\`\`

Original design description: ${originalPrompt}
${areaContext}

The user requests these changes:

${feedback}

Output the COMPLETE updated SVG incorporating these changes. Preserve parts that the user did not ask to change. Keep the same viewBox and coordinate system.`;
}

export function buildVisualizationPrompt(userPrompt: string): string {
  return `Create a photorealistic 3D visualization of the following garment design:

${userPrompt}

Show the garment on a clean, neutral background with professional fashion photography lighting. The visualization should show fabric texture, draping, and realistic proportions.`;
}

export { SVG_SYSTEM_PROMPT };
