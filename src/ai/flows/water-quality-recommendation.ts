'use server';

/**
 * @fileOverview A comprehensive water quality recommendation AI agent.
 *
 * - getRecommendation - A function that provides water quality recommendations based on multiple contaminants.
 * - RecommendationInput - The input type for the getRecommendation function.
 * - RecommendationOutput - The return type for the getRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { generate } from 'genkit/ai';


// --- UPDATED: Expanded schema to include all new parameters ---
const RecommendationInputSchema = z.object({
  leadLevel: z.number().describe('Lead level in water (mg/L)'),
  arsenicLevel: z.number().describe('Arsenic level in water (mg/L)'),
  cadmiumLevel: z.number().describe('Cadmium level in water (mg/L)'),
  mercuryLevel: z.number().describe('Mercury level in water (mg/L)'),
  nitrateLevel: z.number().describe('Nitrate level in water (mg/L)'),
  sulfateLevel: z.number().describe('Sulfate level in water (mg/L)'),
  phLevel: z.number().describe('pH level of the water'),
  hazardIndex: z.number().describe('Total Hazard Index calculated from heavy metals'),
});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

// Output schema remains the same, as we still want a single HTML string
const RecommendationOutputSchema = z.object({
  recommendation: z.string().describe('AI-generated recommendation for the resident in HTML format'),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

/**
 * A server action to get a water quality recommendation from the AI.
 * Note: The function name is simplified for clarity.
 */
export async function getRecommendation(input: RecommendationInput): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const result = await recommendationFlow(input);
    // The AI now directly returns the HTML string in the `recommendation` field.
    return { success: true, data: result.recommendation };
  } catch (error) {
    console.error("Error fetching AI recommendation:", error);
    return { success: false, error: "Failed to generate AI recommendation." };
  }
}


// --- ENHANCED PROMPT ---
const recommendationPrompt = ai.definePrompt(
  {
    name: 'comprehensiveWaterQualityPrompt',
    input: { schema: RecommendationInputSchema },
    output: { schema: RecommendationOutputSchema },
    // --- UPGRADED MODEL ---
    model: googleAI.model('gemini-1.5-flash'),
    prompt: `
      Welcome! You are a water quality and public health expert providing advice for a resident of Pimpri-Chinchwad, India.

      Their water sample has the following results:
      - **Hazard Index (HI) for Heavy Metals:** {{hazardIndex}} (from Lead, Arsenic, Cadmium, and Mercury)
      - **Nitrate:** {{nitrateLevel}} mg/L
      - **Sulfate:** {{sulfateLevel}} mg/L
      - **pH:** {{phLevel}}

      Based on this complete data, provide a comprehensive and actionable recommendation. Structure your response as follows:

      1.  **Overall Risk Summary:** Start with a clear, one-sentence summary of the overall water safety and risk level, considering all parameters.
      2.  **Detailed Analysis:**
          * Briefly interpret the **Hazard Index**. If it's over 1.0, state the concern for non-cancer health effects from heavy metals.
          * Analyze the **Nitrate** level. If it's high (above 10 mg/L), highlight the specific risk (e.g., Methemoglobinemia).
          * Analyze the **Sulfate** level. If it's high (above 250 mg/L), mention the aesthetic issues (taste/odor) and potential laxative effects.
          * Comment on the **pH** level if it's outside the ideal range of 6.5-8.5 (e.g., acidic water can cause pipe corrosion).
      3.  **Potential Health Risks:** Consolidate and list the potential health diseases or issues caused by the elevated contaminants in the sample.
      4.  **Filtration Recommendation:** Suggest the most appropriate water treatment system (e.g., Reverse Osmosis (RO), Activated Carbon). Explain *why* it's the best choice based on the specific combination of contaminants present (e.g., "An RO system is recommended because it effectively removes heavy metals, nitrates, and dissolved solids like sulfates.").
      5.  **Immediate Safety Tips:** List 2-3 simple, immediate actions the resident can take while they arrange for a permanent solution.

      Format the entire output as clean, simple HTML using only "<p>", "<ul>", "<li>", and "<strong>" tags for structure and emphasis. Do not include \`\`\`html or any markdown formatting.
    `,
  },
);

const recommendationFlow = ai.defineFlow(
  {
    name: 'recommendationFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    return output!;
  }
);
