
"use server";

import { motivationalAffirmations, type MotivationalAffirmationsInput } from "@/ai/flows/motivational-affirmations";

export async function getAffirmation(input: MotivationalAffirmationsInput) {
    try {
      const { affirmation } = await motivationalAffirmations(input);
      return affirmation;
    } catch (error) {
      console.error("Error fetching affirmation:", error);
      return "There is a strength within you that is greater than any obstacle.";
    }
}
