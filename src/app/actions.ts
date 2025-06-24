
"use server";

import { getAssistantResponse, type AssistantResponseInput } from "@/ai/flows/motivational-affirmations";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { isAiEnabled, recordActivity, getUserActivities, getTasks, addTask, toggleTask } from "@/ai/genkit";

export async function getAssistantResponseWithAudio(input: Pick<AssistantResponseInput, 'userInput'>) {
    recordActivity(`"${input.userInput}"`);
    if (!isAiEnabled()) {
      const fallbackResponse = "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";
      return { response: fallbackResponse, audioDataUri: "" };
    }

    try {
      const activities = getUserActivities();
      const activityHistory = activities.map(a => a.activity).slice(0, 5).join('; ') || "No recent activity.";

      const tasks = getTasks();
      const taskSummary = tasks.length > 0
        ? `Pending: ${tasks.filter(t => !t.completed).map(t => t.text).join(', ')}. Completed: ${tasks.filter(t => t.completed).map(t => t.text).join(', ')}.`
        : "No tasks in the list.";

      const { response } = await getAssistantResponse({ 
        userInput: input.userInput,
        activityHistory,
        tasks: taskSummary,
      });
      
      // If the response is empty, don't try to generate audio.
      if (!response) {
        return { response: response || "", audioDataUri: "" };
      }
      
      const { audioDataUri } = await textToSpeech(response);
      
      return { response, audioDataUri };
    } catch (error) {
      console.error("Error in getAssistantResponseWithAudio:", error);
      const fallbackResponse = "There is a strength within you that is greater than any obstacle, Professor.";
      return { response: fallbackResponse, audioDataUri: "" };
    }
}

export async function getTasksAction() {
    return getTasks();
}

export async function addTaskAction(text: string) {
    if (text.trim()) {
        addTask(text);
    }
}

export async function toggleTaskAction(id: number) {
    toggleTask(id);
}
