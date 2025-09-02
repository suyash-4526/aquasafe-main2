'use server';

/**
 * @fileOverview A water quality recommendation AI agent.
 *
 * - getWaterQualityRecommendation - A function that provides water quality recommendations based on lead, arsenic levels, and hazard index.
 * - WaterQualityRecommendationInput - The input type for the getWaterQualityRecommendation function.
 * - WaterQualityRecommendationOutput - The return type for the getWaterQualityRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const WaterQualityRecommendationInputSchema = z.object({
  leadLevel: z.number().describe('Lead level in water (mg/L)'),
  arsenicLevel: z.number().describe('Arsenic level in water (mg/L)'),
  hazardIndex: z.number().describe('Hazard Index calculated from water quality data'),
});
export type WaterQualityRecommendationInput = z.infer<typeof WaterQualityRecommendationInputSchema>;

const WaterQualityRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('AI-generated recommendation for the resident in HTML format'),
});
export type WaterQualityRecommendationOutput = z.infer<typeof WaterQualityRecommendationOutputSchema>;

export async function getWaterQualityRecommendation(input: WaterQualityRecommendationInput): Promise<WaterQualityRecommendationOutput> {
  return waterQualityRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'waterQualityRecommendationPrompt',
  input: {schema: WaterQualityRecommendationInputSchema},
  output: {schema: WaterQualityRecommendationOutputSchema},
  model: googleAI.model('gemini-2.0-flash'),
  prompt: `You are a water quality expert. A water sample from a home in Pimpri-Chinchwad, India shows a lead level of {{leadLevel}} mg/L and an arsenic level of {{arsenicLevel}} mg/L. This results in a Hazard Index of {{hazardIndex}}. Based on these specific values, provide a concise, actionable recommendation for the resident. Start with a clear one-sentence summary of the risk level. Then, suggest the most appropriate type of water filter (e.g., RO, Activated Carbon) and explain why in one sentence. Finally, list 2-3 simple, immediate safety tips. Format the output as simple HTML paragraphs.`,
});

const waterQualityRecommendationFlow = ai.defineFlow(
  {
    name: 'waterQualityRecommendationFlow',
    inputSchema: WaterQualityRecommendationInputSchema,
    outputSchema: WaterQualityRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
