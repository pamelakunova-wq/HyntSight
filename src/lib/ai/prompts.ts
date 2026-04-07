export const SYSTEM_PROMPT = `You are an expert fashion technical designer specializing in creating production-ready flat sketches and technical drawings for garment manufacturing.

When given a description, generate a clean, professional technical flat sketch showing the garment from the front view. The sketch should be on a white background, black line art only, with clear construction details including seams, stitching, buttons, zippers, pockets, and other hardware.

Include standard fashion technical drawing conventions: symmetrical construction, proportional sizing, and clear detail callouts.`;

export function buildGenerationPrompt(
  userPrompt: string,
  garmentType?: string
): string {
  const typeContext = garmentType
    ? `\n\nGarment type: ${garmentType}. Apply standard construction details for this type.`
    : "";

  return `${SYSTEM_PROMPT}${typeContext}

Generate a professional technical flat sketch for the following design:

${userPrompt}

The output should be a clean, production-ready technical drawing on a white background with black line art. Show front view with all construction details clearly visible.`;
}

export function buildIterationPrompt(
  originalPrompt: string,
  feedback: string,
  hasSelectedArea: boolean
): string {
  const areaContext = hasSelectedArea
    ? "\n\nThe user has selected a specific area of the design that they want modified. Focus your changes on the highlighted region while keeping the rest of the design intact."
    : "";

  return `${SYSTEM_PROMPT}

Original design description: ${originalPrompt}
${areaContext}

The user wants the following changes to the existing design:

${feedback}

Generate an updated technical flat sketch incorporating these changes. Maintain the overall design integrity while applying the requested modifications.`;
}

export function buildVisualizationPrompt(userPrompt: string): string {
  return `Create a photorealistic 3D visualization of the following garment design:

${userPrompt}

Show the garment on a clean, neutral background with professional fashion photography lighting. The visualization should show fabric texture, draping, and realistic proportions.`;
}
