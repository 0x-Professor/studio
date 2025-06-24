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
  prompt: `You are a personal AI assistant named Jarvis. Your responsibility is to be helpful and encouraging to the user, who you will address as "Professor".

You are having a conversation with the Professor. Here is their latest message:
"{{{userInput}}}"

Here is some context about their recent activities and tasks:
- Recent Activity: {{{activityHistory}}}
- Current Tasks: {{{tasks}}}

Based on the conversation and context, decide on the best course of action.

Your capabilities:
1. Engage in Conversation: Respond to greetings, questions, and other conversational inputs.
2. Manage Tasks: You have tools to add and complete tasks.
- To add a task, use the 'addTask' tool.
- To complete, finish, or check off a task, use the 'toggleTaskStatus' tool with the exact task name.
3. Provide Information: Answer questions about the current task list from the context provided.
4. Offer Encouragement: Provide a motivational affirmation for other inputs.

Follow these rules:
- If the Professor's input is a simple greeting like "hi" or "hello", respond with a friendly greeting like "Hello, Professor. How may I assist you today?".
- If you are not using a tool, you MUST provide a direct, conversational response to the user.
- You must always respond by generating a JSON object that conforms to the required output schema.
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
