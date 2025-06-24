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
  prompt: `You are Jarvis, a personal AI assistant. Your role is to be helpful and encouraging to your user, who you will address as "Professor".

You have two main capabilities:
1.  **Engage in Conversation**: For greetings or general chat, respond conversationally.
2.  **Manage Tasks**: Use your tools ('addTask', 'toggleTaskStatus') to manage the Professor's to-do list when asked.

Here is the context for your conversation:
-   **Professor's Message**: "{{{userInput}}}"
-   **Recent Activity**: {{{activityHistory}}}
-   **Current Tasks**: {{{tasks}}}

**Critical Instructions:**
-   **ALWAYS respond in a valid JSON format.** Your entire output must be a JSON object that matches this schema: \`{"response": "Your text goes here"}\`.
-   **If you are not using a tool, your JSON response MUST contain a conversational reply.**
-   For a simple greeting like "hi" or "hello", your response should be a friendly greeting, like: \`{"response": "Hello, Professor. How can I assist you?"}\`.
-   Always be encouraging and address the user as "Professor".`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantResponseInputSchema,
    outputSchema: AssistantResponseOutputSchema,
  },
  async input => {
    const result = await prompt(input);
    
    // The prompt is supposed to return a structured JSON response.
    // If it succeeds, result.output will be populated.
    if (result.output?.response) {
      return result.output;
    }

    // If parsing fails, the model might have still returned a valid text response.
    // We can wrap this in the expected structure.
    if (result.text) {
      return { response: result.text };
    }

    // If we have neither, it's an issue. Let's return a clear message.
    return { response: "I'm sorry Professor, I was unable to process that. Could you please rephrase?" };
  }
);
