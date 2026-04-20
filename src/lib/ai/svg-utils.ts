/**
 * Server-side SVG extraction, validation, and normalization utilities.
 * Uses regex-based parsing (no DOM) so it works in Node.js edge/serverless.
 */

const SVG_BLOCK_RE = /<svg[\s\S]*?<\/svg>/i;
const CODE_FENCE_RE = /```(?:svg|xml|html)?\s*([\s\S]*?)```/g;

/**
 * Extract the first <svg>...</svg> block from raw LLM text.
 * Handles responses wrapped in markdown code fences.
 */
export function extractSVG(rawText: string): string | null {
  const directMatch = rawText.match(SVG_BLOCK_RE);
  if (directMatch) return directMatch[0];

  let fenceMatch: RegExpExecArray | null;
  while ((fenceMatch = CODE_FENCE_RE.exec(rawText)) !== null) {
    const inner = fenceMatch[1];
    const innerMatch = inner.match(SVG_BLOCK_RE);
    if (innerMatch) return innerMatch[0];
  }

  return null;
}

/**
 * Validate that an SVG string is well-formed XML.
 * Uses a lightweight regex check since we're server-side (no DOMParser).
 */
export function validateSVG(svg: string): boolean {
  if (!svg.startsWith("<svg")) return false;
  if (!svg.endsWith("</svg>")) return false;

  const openTags = svg.match(/<[a-zA-Z][^/>]*(?<!\/)>/g) ?? [];
  const closeTags = svg.match(/<\/[a-zA-Z][^>]*>/g) ?? [];
  const selfClosing = svg.match(/<[a-zA-Z][^>]*\/>/g) ?? [];

  const totalOpens = openTags.length;
  const totalCloses = closeTags.length;

  if (totalOpens < 1 || totalCloses < 1) return false;
  if (Math.abs(totalOpens - totalCloses) > totalOpens * 0.1) return false;

  return true;
}

const VIEWBOX_RE = /viewBox="([^"]*)"/i;
const WIDTH_ATTR_RE = /(<svg[^>]*)\swidth="[^"]*"/i;
const HEIGHT_ATTR_RE = /(<svg[^>]*)\sheight="[^"]*"/i;

/**
 * Normalize SVG to a consistent viewBox and add default stroke attributes.
 */
export function normalizeSVG(
  svg: string,
  targetWidth = 800,
  targetHeight = 1000
): string {
  let result = svg;

  if (!VIEWBOX_RE.test(result)) {
    result = result.replace(
      "<svg",
      `<svg viewBox="0 0 ${targetWidth} ${targetHeight}"`
    );
  }

  result = result.replace(WIDTH_ATTR_RE, '$1 width="100%"');
  result = result.replace(HEIGHT_ATTR_RE, '$1 height="100%"');

  if (!WIDTH_ATTR_RE.test(result)) {
    result = result.replace("<svg", '<svg width="100%"');
  }
  if (!HEIGHT_ATTR_RE.test(result)) {
    result = result.replace("<svg", '<svg height="100%"');
  }

  if (!/xmlns=/.test(result)) {
    result = result.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return result;
}
