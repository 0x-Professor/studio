'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing motivational affirmations and encouragement to the user.
 *
 * - getAssistantResponse - A function that returns a conversational response from the assistant.
 * - AssistantResponseInput - The input type for the getAssistantResponse function.
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

export type AssistantResponseOutput = string;

export async function getAssistantResponse(
  input: AssistantResponseInput
): Promise<AssistantResponseOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  inputSchema: AssistantResponseInputSchema,
  tools: [addTaskTool, toggleTaskTool],
  prompt: `You are Jarvis, a personal AI assistant. Your role is to be helpful and encouraging to your user, who you will address as "Professor".

You have two main capabilities:
1.  **Engage in Conversation**: For greetings or general chat like "hi" or "hello", respond conversationally.
2.  **Manage Tasks**: Use your tools ('addTask', 'toggleTaskStatus') to manage the Professor's to-do list when asked. After using a tool, confirm the action in your response.

Here is the context for your conversation:
-   **Professor's Message**: "{{{userInput}}}"
-   **Recent Activity**: {{{activityHistory}}}
-   **Current Tasks**: {{{tasks}}}

Always be encouraging and address the user as "Professor". Your response should be a direct, conversational string.`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantResponseInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const result = await prompt(input);
    const responseText = result.text;

    if (responseText) {
      return responseText;
    }

    return "I'm sorry, Professor. I didn't quite understand. Could you please rephrase?";
  }
);
