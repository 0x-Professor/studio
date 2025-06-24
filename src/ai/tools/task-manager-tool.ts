'use server';

/**
 * @fileOverview A Genkit tool for managing tasks.
 *
 * - addTaskTool - A tool that allows the AI to add a task to the user's to-do list.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { addTask } from '@/ai/genkit';

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
