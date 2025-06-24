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
import { addTaskTool, toggleTaskTool } from '@/ai/tools/task-manager-tool';

const MotivationalAffirmationsInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's current feeling or message."),
  activityHistory: z.string().describe("A summary of the user's recent activities."),
  tasks: z.string().describe("A summary of the user's current to-do list, including completed and pending tasks."),
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
  tools: [addTaskTool, toggleTaskTool],
  prompt: `You are a personal AI assistant named Jarvis, embedded in a mobile app.
  Your responsibility is to provide motivational affirmations and encouragement to the user, who you will address as "Professor", to support their mental well-being and help them stay positive.

  The Professor has expressed the following: {{{userInput}}}

  Here is the context of the Professor's recent activities and current tasks:
  - Recent Activity: {{{activityHistory}}}
  - Current Tasks: {{{tasks}}}

  Based on all this context, provide a short, clear, and actionable motivational affirmation. Always respond like a proactive, helpful, and intelligent assistant, just like Tony Stark’s Jarvis.

  If the Professor asks you to remember something, add a to-do, or create a task, you MUST use the addTask tool. After using the tool, confirm that you've done so in your response. For example: "Of course, Professor. I've added 'Buy groceries' to your task list."

  If the Professor's input is a simple greeting like "hey" or a question about tasks like "what are the remaining tasks", do not provide a motivational affirmation. Instead, respond with the standard greeting "Hello, Professor. How may I assist you today? You can ask me to add tasks to your to-do list." if it's a greeting, or provide the list of tasks from the 'Current Tasks' context if they ask about tasks.

  For example, if the Professor says "hey", respond with: "Hello, Professor. How may I assist you today? You can ask me to add tasks to your to-do list."
  If the Professor asks "what are the remaining tasks", respond by listing the tasks from the 'Current Tasks' section.
  
  If the Professor asks you to complete, finish, or check off a task, you MUST use the toggleTaskStatus tool. You must use the exact text of the task from the 'Current Tasks' list. After using the tool, confirm the action. For example: "Consider it done, Professor. I've marked 'Finish project proposal' as complete."
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
