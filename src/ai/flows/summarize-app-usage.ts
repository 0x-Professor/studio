'use server';

/**
 * @fileOverview Summarizes the user's app usage for the day.
 *
 * - summarizeAppUsage - A function that summarizes the user's app usage.
 * - SummarizeAppUsageInput - The input type for the summarizeAppUsage function.
 * - SummarizeAppUsageOutput - The return type for the summarizeAppUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAppUsageInputSchema = z.object({
  appUsageData: z
    .string()
    .describe('A JSON string containing the user app usage data for the day.'),
});
export type SummarizeAppUsageInput = z.infer<typeof SummarizeAppUsageInputSchema>;

const SummarizeAppUsageOutputSchema = z.object({
  summary: z.string().describe('A summary of the user app usage for the day.'),
});
export type SummarizeAppUsageOutput = z.infer<typeof SummarizeAppUsageOutputSchema>;

export async function summarizeAppUsage(input: SummarizeAppUsageInput): Promise<SummarizeAppUsageOutput> {
  return summarizeAppUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAppUsagePrompt',
  input: {schema: SummarizeAppUsageInputSchema},
  output: {schema: SummarizeAppUsageOutputSchema},
  prompt: `You are Jarvis, a personal AI assistant. Summarize the user's app usage for the day based on the following data:\n\n{{appUsageData}}\n\nProvide a concise and informative summary of how the user spent their time using apps today.`,
});

const summarizeAppUsageFlow = ai.defineFlow(
  {
    name: 'summarizeAppUsageFlow',
    inputSchema: SummarizeAppUsageInputSchema,
    outputSchema: SummarizeAppUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
