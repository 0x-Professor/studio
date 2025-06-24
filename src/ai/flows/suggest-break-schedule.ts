'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting a personalized break schedule based on app usage patterns.
 *
 * - suggestBreakSchedule - A function that generates a break schedule suggestion.
 * - SuggestBreakScheduleInput - The input type for the suggestBreakSchedule function.
 * - SuggestBreakScheduleOutput - The return type for the suggestBreakSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBreakScheduleInputSchema = z.object({
  appUsageSummary: z
    .string()
    .describe('A summary of the user\'s app usage patterns.'),
  userGoals: z.string().describe('The user\'s productivity goals.'),
});
export type SuggestBreakScheduleInput = z.infer<typeof SuggestBreakScheduleInputSchema>;

const SuggestBreakScheduleOutputSchema = z.object({
  breakSchedule: z
    .string()
    .describe('A personalized break schedule suggestion based on app usage.'),
});
export type SuggestBreakScheduleOutput = z.infer<typeof SuggestBreakScheduleOutputSchema>;

export async function suggestBreakSchedule(
  input: SuggestBreakScheduleInput
): Promise<SuggestBreakScheduleOutput> {
  return suggestBreakScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreakSchedulePrompt',
  input: {schema: SuggestBreakScheduleInputSchema},
  output: {schema: SuggestBreakScheduleOutputSchema},
  prompt: `You are Jarvis, an AI assistant that suggests personalized break schedules to users based on their app usage patterns and productivity goals.

  Given the following app usage summary and user goals, suggest a break schedule that helps the user avoid burnout and stay productive.

  App Usage Summary: {{{appUsageSummary}}}
  User Goals: {{{userGoals}}}

  Respond with a concise and actionable break schedule. For example:

  "Take a 15-minute break every 2 hours. During your breaks, try to get away from the screen, stretch, or do something you enjoy."

  Break Schedule`,
});

const suggestBreakScheduleFlow = ai.defineFlow(
  {
    name: 'suggestBreakScheduleFlow',
    inputSchema: SuggestBreakScheduleInputSchema,
    outputSchema: SuggestBreakScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
