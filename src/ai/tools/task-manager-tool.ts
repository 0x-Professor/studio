'use server';

/**
 * @fileOverview A Genkit tool for managing tasks.
 *
 * - addTaskTool - A tool that allows the AI to add a task to the user's to-do list.
 * - toggleTaskTool - A tool that allows the AI to mark a task as complete or incomplete.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { addTask, toggleTaskByText } from '@/ai/genkit';

export const addTaskTool = ai.defineTool(
  {
    name: 'addTask',
    description: "Adds a task to the user's to-do list.",
    inputSchema: z.object({
      text: z.string().describe('The content of the task to add.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    return addTask(input.text);
  }
);

export const toggleTaskTool = ai.defineTool(
  {
    name: 'toggleTaskStatus',
    description: "Marks a task as complete or incomplete from the user's to-do list based on its text. Use this if the user asks to 'complete', 'finish', 'check off', or 'uncheck' a task.",
    inputSchema: z.object({
      text: z.string().describe("The exact text of the task to mark as complete or incomplete."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const updatedTask = toggleTaskByText(input.text);
    if (!updatedTask) {
        return `Could not find a task named "${input.text}". Please check the task list.`
    }
    return `Task "${updatedTask.text}" has been marked as ${updatedTask.completed ? 'complete' : 'incomplete'}.`
  }
);
