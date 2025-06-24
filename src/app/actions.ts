
"use server";

import { motivationalAffirmations, type MotivationalAffirmationsInput } from "@/ai/flows/motivational-affirmations";
import { isAiEnabled } from "@/ai/genkit";

export async function getAffirmation(input: MotivationalAffirmationsInput) {
    if (!isAiEnabled()) {
      return "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";
    }
    try {
      const { affirmation } = await motivationalAffirmations(input);
      return affirmation;
    } catch (error) {
      console.error("Error fetching affirmation:", error);
      return "There is a strength within you that is greater than any obstacle.";
    }
}
