// Proactive Productivity Suggestions [GenAI]: Suggest personalized productivity tips and break schedules based on logged app usage and task history.

'use server';

/**
 * @fileOverview A flow to provide proactive productivity tips to the user based on their app usage and task history.
 *
 * - proactiveProductivityTips - A function that returns productivity tips based on user behavior.
 * - ProactiveProductivityTipsInput - The input type for the proactiveProductivityTips function.
 * - ProactiveProductivityTipsOutput - The return type for the proactiveProductivityTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProactiveProductivityTipsInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  appUsageSummary: z.string().describe('A summary of the user\u2019s app usage.'),
  taskHistory: z.string().describe('A summary of the user\u2019s task history.'),
});
export type ProactiveProductivityTipsInput = z.infer<
  typeof ProactiveProductivityTipsInputSchema
>;

const ProactiveProductivityTipsOutputSchema = z.object({
  productivityTips: z
    .array(z.string())
    .describe('A list of personalized productivity tips for the user.'),
  breakScheduleSuggestion: z
    .string()
    .describe('A suggested break schedule for the user.'),
});
export type ProactiveProductivityTipsOutput = z.infer<
  typeof ProactiveProductivityTipsOutputSchema
>;

export async function proactiveProductivityTips(
  input: ProactiveProductivityTipsInput
): Promise<ProactiveProductivityTipsOutput> {
  return proactiveProductivityTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proactiveProductivityTipsPrompt',
  input: {schema: ProactiveProductivityTipsInputSchema},
  output: {schema: ProactiveProductivityTipsOutputSchema},
  prompt: `You are Jarvis, a personal AI assistant, and you are proactively providing productivity tips to the user, {{{userName}}}.

  Based on their app usage and task history, provide personalized productivity tips and a break schedule suggestion.

  App Usage Summary: {{{appUsageSummary}}}
  Task History: {{{taskHistory}}}

  Respond with a list of productivity tips and a break schedule suggestion.
  `,
});

const proactiveProductivityTipsFlow = ai.defineFlow(
  {
    name: 'proactiveProductivityTipsFlow',
    inputSchema: ProactiveProductivityTipsInputSchema,
    outputSchema: ProactiveProductivityTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
