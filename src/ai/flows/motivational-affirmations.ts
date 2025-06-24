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
import { addTaskTool } from '@/ai/tools/task-manager-tool';

const MotivationalAffirmationsInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's current feeling or message."),
  activityHistory: z.string().describe("A summary of the user's recent activities."),
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
  tools: [addTaskTool],
  prompt: `You are a personal AI assistant named Jarvis, embedded in a mobile app.
  Your responsibility is to provide motivational affirmations and encouragement to the user, who you will address as "Professor", to support their mental well-being and help them stay positive.

  The Professor has expressed the following: {{{userInput}}}

  Here is a summary of the Professor's recent activities for context: {{{activityHistory}}}

  Based on this, provide a short, clear, and actionable motivational affirmation. Always respond like a proactive, helpful, and intelligent assistant, just like Tony Stark’s Jarvis.

  If the Professor asks you to remember something, add a to-do, create a task, or similar, use the addTask tool to add it to their to-do list and confirm that you've done so in your response. For example: "Of course, Professor. I've added 'Buy groceries' to your task list."
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
