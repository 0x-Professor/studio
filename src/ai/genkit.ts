import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import type { Task } from '@/types';

const apiKey = process.env.GOOGLE_API_KEY;
const isApiKeyValid =
  apiKey && !apiKey.includes('REPLACE_WITH_YOUR_API_KEY') && apiKey.length > 30;

const plugins = [];
if (isApiKeyValid) {
  plugins.push(googleAI({apiKey}));
}

// In-memory stores for demo purposes
const userActivities: { activity: string, timestamp: Date }[] = [];
const tasks: Task[] = [
    { id: 1, text: "Finish project proposal", completed: true },
    { id: 2, text: "Buy groceries", completed: false },
    { id: 3, text: "Schedule dentist appointment", completed: false },
];
let nextTaskId = 4;

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});

export function isAiEnabled() {
  return isApiKeyValid;
}

// Functions to manage user activities
export function recordActivity(activity: string) {
  userActivities.unshift({ activity, timestamp: new Date() });
  if (userActivities.length > 20) {
    userActivities.pop();
  }
}

export function getUserActivities() {
  return userActivities;
}

// Functions to manage tasks
export function getTasks() {
    return tasks.sort((a,b) => (a.completed ? 1 : -1) - (b.completed ? 1: -1) || b.id - a.id);
}

export function addTask(text: string) {
    const newTask: Task = {
        id: nextTaskId++,
        text,
        completed: false
    };
    tasks.unshift(newTask);
    recordActivity(`Added task: "${text}"`);
    return newTask;
}

export function toggleTask(id: number) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        recordActivity(`Toggled task "${task.text}" to ${task.completed ? 'completed' : 'incomplete'}`);
    }
}
