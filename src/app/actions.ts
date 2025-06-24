
"use server";

import { motivationalAffirmations, type MotivationalAffirmationsInput } from "@/ai/flows/motivational-affirmations";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { isAiEnabled, recordActivity, getUserActivities, getTasks, addTask, toggleTask } from "@/ai/genkit";

export async function getAffirmationWithAudio(input: Pick<MotivationalAffirmationsInput, 'userInput'>) {
    recordActivity(`"${input.userInput}"`);
    if (!isAiEnabled()) {
      const fallbackAffirmation = "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";
      return { affirmation: fallbackAffirmation, audioDataUri: "" };
    }

    try {
      const activities = getUserActivities();
      const activityHistory = activities.map(a => a.activity).slice(0, 5).join('; ');

      const { affirmation } = await motivationalAffirmations({ 
        userInput: input.userInput,
        activityHistory,
      });
      
      if (!affirmation) {
        throw new Error("Empty affirmation received.");
      }
      
      const { audioDataUri } = await textToSpeech(affirmation);
      
      return { affirmation, audioDataUri };
    } catch (error) {
      console.error("Error in getAffirmationWithAudio:", error);
      const fallbackAffirmation = "There is a strength within you that is greater than any obstacle, Professor.";
      return { affirmation: fallbackAffirmation, audioDataUri: "" };
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
