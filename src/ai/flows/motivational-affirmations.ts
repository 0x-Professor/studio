'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing motivational affirmations and encouragement to the user.
 *
 * - getAssistantResponse - A function that returns a conversational response from the assistant.
 * - AssistantResponseInput - The input type for the getAssistantResponse function.
 * - AssistantResponseOutput - The return type for the getAssistantResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { addTaskTool, toggleTaskTool } from '@/ai/tools/task-manager-tool';

const AssistantResponseInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's current feeling or message."),
  activityHistory: z.string().describe("A summary of the user's recent activities."),
  tasks: z.string().describe("A summary of the user's current to-do list, including completed and pending tasks."),
});
export type AssistantResponseInput = z.infer<
  typeof AssistantResponseInputSchema
>;

const AssistantResponseOutputSchema = z.object({
  response: z.string().describe('The conversational response from the AI assistant.'),
});
export type AssistantResponseOutput = z.infer<
  typeof AssistantResponseOutputSchema
>;

export async function getAssistantResponse(
  input: AssistantResponseInput
): Promise<AssistantResponseOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantResponseInputSchema},
  output: {schema: AssistantResponseOutputSchema},
  tools: [addTaskTool, toggleTaskTool],
  prompt: `You are a personal AI assistant named Jarvis, embedded in a mobile app. Your responsibility is to be helpful and encouraging to the user, who you will address as "Professor".

You are having a conversation with the Professor. Here is the latest message from them:
"{{{userInput}}}"

Here is some context about the Professor's recent activities and tasks:
- Recent Activity: {{{activityHistory}}}
- Current Tasks: {{{tasks}}}

Based on the conversation and context, provide a helpful and conversational response.

- If the Professor asks you to add a task, use the 'addTask' tool.
- If the Professor asks you to complete, finish, or check off a task, use the 'toggleTaskStatus' tool with the exact task name.
- If the Professor's input is a simple greeting like "hey", respond with a friendly greeting like "Hello, Professor. How may I assist you today?".
- If they ask about their tasks, provide the list of tasks from the 'Current Tasks' context.
- For other inputs, you can provide encouragement or a motivational affirmation.

Always provide a direct, text-based response. For example: "Of course, Professor. I've added 'Buy groceries' to your task list." or "Consider it done. I've marked 'Finish project proposal' as complete."
`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantResponseInputSchema,
    outputSchema: AssistantResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { response: "I'm sorry, Professor. I seem to be having trouble connecting. Please try again in a moment." };
    }
    return output;
  }
);
