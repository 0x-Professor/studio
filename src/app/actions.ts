
"use server";

import { motivationalAffirmations, type MotivationalAffirmationsInput } from "@/ai/flows/motivational-affirmations";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { isAiEnabled } from "@/ai/genkit";

export async function getAffirmationWithAudio(input: MotivationalAffirmationsInput) {
    if (!isAiEnabled()) {
      const fallbackAffirmation = "Please set your GOOGLE_API_KEY in the .env file to enable AI features.";
      // To keep the return type consistent, we won't generate audio for the fallback.
      return { affirmation: fallbackAffirmation, audioDataUri: "" };
    }

    try {
      const { affirmation } = await motivationalAffirmations(input);
      
      if (!affirmation) {
        throw new Error("Empty affirmation received.");
      }
      
      const { audioDataUri } = await textToSpeech(affirmation);
      
      return { affirmation, audioDataUri };
    } catch (error) {
      console.error("Error in getAffirmationWithAudio:", error);
      const fallbackAffirmation = "There is a strength within you that is greater than any obstacle.";
      // Don't attempt to generate audio for the fallback to avoid another potential error.
      return { affirmation: fallbackAffirmation, audioDataUri: "" };
    }
}
