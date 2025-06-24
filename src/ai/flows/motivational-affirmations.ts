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

const assistantPrompt = ai.definePrompt({
    name: 'assistantPrompt',
    inputSchema: AssistantResponseInputSchema,
    tools: [addTaskTool, toggleTaskTool],
    prompt: `You are Jarvis, a helpful and encouraging personal AI assistant. The user is named "Professor".

    Context:
    - Professor's message: "{{userInput}}"
    - Recent activity: {{activityHistory}}
    - Current tasks: {{tasks}}

    Your instructions:
    1.  Always address the user as "Professor".
    2.  If the user says hi, hello, or something similar, respond with a friendly greeting.
    3.  If the user asks you to add or complete a task, use the provided tools ('addTask', 'toggleTaskStatus'). After using a tool, confirm the action. For example: "Of course, Professor. I've added 'Buy milk' to your list."
    4.  For any other message, respond conversationally and helpfully.
    5.  Your response must be a single, direct string of text.
    `,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantResponseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const llmResponse = await assistantPrompt(input);
      const textResponse = llmResponse.text;

      // If the model returned text, use it.
      if (textResponse) {
        return textResponse;
      }

      // If the model used a tool and didn't return text, provide a confirmation.
      const toolChoice = llmResponse.choices[0].message.toolRequest;
      if (toolChoice) {
        // We can make this more specific later if needed
        return "Consider it done, Professor.";
      }

      console.warn("Assistant flow received an unexpected response from the model.");
      return "I'm sorry, Professor, I'm having trouble processing that request.";

    } catch (error) {
      console.error("Error in assistantFlow:", error);
      return "I apologize, Professor. I am currently facing a technical difficulty and cannot respond.";
    }
  }
);
