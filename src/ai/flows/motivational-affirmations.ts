'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing motivational affirmations and encouragement to the user.
 *
 * - motivationalAffirmations - A function that returns a motivational affirmation.
 * - MotivationalAffirmationsInput - The input type for the motivationalAffirmations function.
 * - MotivationalAffirmationsOutput - The return type for the motivationalAffirmations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalAffirmationsInputSchema = z.object({
  mood: z
    .string()
    .describe("The user's current mood, e.g., 'stressed', 'happy', 'sad'."),
});
export type MotivationalAffirmationsInput = z.infer<
  typeof MotivationalAffirmationsInputSchema
>;

const MotivationalAffirmationsOutputSchema = z.object({
  affirmation: z.string().describe('A motivational affirmation for the user.'),
});
export type MotivationalAffirmationsOutput = z.infer<
  typeof MotivationalAffirmationsOutputSchema
>;

export async function motivationalAffirmations(
  input: MotivationalAffirmationsInput
): Promise<MotivationalAffirmationsOutput> {
  return motivationalAffirmationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalAffirmationsPrompt',
  input: {schema: MotivationalAffirmationsInputSchema},
  output: {schema: MotivationalAffirmationsOutputSchema},
  prompt: `You are a personal AI assistant named Jarvis, embedded in a mobile app.
  Your responsibility is to provide motivational affirmations and encouragement to the user in Companion Mode to support their mental well-being and help them stay positive.

  The user is currently feeling: {{{mood}}}

  Provide a short, clear, and actionable motivational affirmation. Always respond like a proactive, helpful, and intelligent assistant, just like Tony Stark’s Jarvis.
  `,
});

const motivationalAffirmationsFlow = ai.defineFlow(
  {
    name: 'motivationalAffirmationsFlow',
    inputSchema: MotivationalAffirmationsInputSchema,
    outputSchema: MotivationalAffirmationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
