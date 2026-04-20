/**
 * Dry-run test: calls Gemini 2.5 Flash with an SVG generation prompt,
 * validates the output, and writes the result to a file for inspection.
 *
 * Usage: npx tsx scripts/test-svg-generation.ts
 */

import { GoogleGenAI } from "@google/genai";
import { writeFileSync } from "fs";
import { resolve } from "path";

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("❌ GOOGLE_AI_API_KEY not set. Export it or add to .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SVG_PROMPT = `You are an expert fashion technical designer who outputs SVG code for production-ready flat sketches.

CRITICAL RULES:
1. Respond with a single valid SVG document inside <svg>...</svg> tags.
2. Use viewBox="0 0 800 1000" (portrait, unitless coordinates).
3. Use ONLY black strokes on a white/transparent background. Default stroke-width="1.5".
4. Group related garment parts using <g id="part-name"> with descriptive IDs:
   - body-front, left-sleeve, right-sleeve, collar, hem, etc.
5. Use <path>, <line>, <polyline>, <rect>, <circle>, <ellipse> elements.
6. Add <text> annotation elements for key measurements (font-size="12", fill="#666").
7. Maintain bilateral symmetry.
8. Show seam lines (dashed), topstitching, buttons (small circles).
9. Center the garment in the viewBox with ~50px padding.
10. Do NOT include <style> blocks, CSS classes, or inline JavaScript.
11. Do NOT include raster images (<image> tags) inside the SVG.

Create a professional technical flat sketch as SVG for:

A classic crew-neck t-shirt with short sleeves. Clean, minimal design. Show front view with seam lines, hem details, and sleeve construction.

Output the complete SVG code.`;

async function main() {
  console.log("🧪 Testing SVG generation with Gemini 2.5 Flash...\n");

  const start = Date.now();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: SVG_PROMPT }] }],
  });

  const elapsed = Date.now() - start;
  const rawText = response.text ?? "";

  console.log(`⏱️  Response received in ${elapsed}ms`);
  console.log(`📏 Raw response length: ${rawText.length} chars\n`);

  // Extract SVG
  const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
  if (!svgMatch) {
    console.error("❌ FAIL: No <svg>...</svg> block found in response.");
    console.log("\n--- Raw response (first 2000 chars) ---");
    console.log(rawText.substring(0, 2000));
    writeFileSync(resolve(__dirname, "test-output-raw.txt"), rawText);
    process.exit(1);
  }

  const svg = svgMatch[0];
  console.log(`✅ SVG block extracted (${svg.length} chars)`);

  // Validate structure
  const checks = [
    { name: "starts with <svg", pass: svg.startsWith("<svg") },
    { name: "ends with </svg>", pass: svg.endsWith("</svg>") },
    { name: "has viewBox", pass: /viewBox=/.test(svg) },
    { name: "has <g> groups", pass: /<g[\s>]/.test(svg) },
    { name: "has id attributes", pass: /id="/.test(svg) },
    { name: "has <path> elements", pass: /<path[\s>]/.test(svg) },
    { name: "no <style> block", pass: !/<style[\s>]/.test(svg) },
    { name: "no <image> tag", pass: !/<image[\s>]/.test(svg) },
    { name: "has stroke attributes", pass: /stroke=/.test(svg) },
  ];

  let allPass = true;
  for (const check of checks) {
    const icon = check.pass ? "✅" : "⚠️ ";
    console.log(`  ${icon} ${check.name}`);
    if (!check.pass) allPass = false;
  }

  // Count elements
  const pathCount = (svg.match(/<path[\s>]/g) ?? []).length;
  const groupCount = (svg.match(/<g[\s>]/g) ?? []).length;
  const lineCount = (svg.match(/<line[\s>]/g) ?? []).length;
  const textCount = (svg.match(/<text[\s>]/g) ?? []).length;

  console.log(`\n📊 Element counts:`);
  console.log(`   <path>: ${pathCount}`);
  console.log(`   <g>:    ${groupCount}`);
  console.log(`   <line>: ${lineCount}`);
  console.log(`   <text>: ${textCount}`);

  // Extract group IDs
  const groupIds = [...svg.matchAll(/id="([^"]*)"/g)].map((m) => m[1]);
  if (groupIds.length > 0) {
    console.log(`\n🏷️  IDs found: ${groupIds.join(", ")}`);
  }

  // Write output files
  const outSvg = resolve(__dirname, "test-output.svg");
  writeFileSync(outSvg, svg);
  console.log(`\n📁 SVG written to: ${outSvg}`);

  // Also extract notes (text outside the SVG block)
  const notes = rawText
    .replace(/<svg[\s\S]*<\/svg>/i, "")
    .replace(/```[\s\S]*?```/g, "")
    .trim();

  if (notes) {
    const outNotes = resolve(__dirname, "test-output-notes.txt");
    writeFileSync(outNotes, notes);
    console.log(`📝 AI notes written to: ${outNotes}`);
  }

  console.log(
    `\n${allPass ? "🎉 ALL CHECKS PASSED" : "⚠️  Some checks failed (see above)"}`
  );
  console.log(
    "Open test-output.svg in a browser to visually inspect the schematic."
  );
}

main().catch((err) => {
  console.error("❌ Test failed with error:", err);
  process.exit(1);
});
