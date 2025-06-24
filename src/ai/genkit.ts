import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;
// Add a way to store and access user activity data globally. This could be a simple in-memory store for demonstration, or integrated with a database.
// A simple check to see if the key is not a placeholder and seems like a real key.
const isApiKeyValid =
  apiKey && !apiKey.includes('REPLACE_WITH_YOUR_API_KEY') && apiKey.length > 30;

const plugins = [];
if (isApiKeyValid) {
  plugins.push(googleAI({apiKey}));
}

// Initialize a structure to hold activity data.
const userActivities: { activity: string, timestamp: Date }[] = [];
export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});

export function isAiEnabled() {
  return isApiKeyValid;
}

// Function to record user activity
export function recordActivity(activity: string) {
  userActivities.push({ activity, timestamp: new Date() });
}

// Function to get user activities (for the AI to access)
export function getUserActivities() {
  return userActivities;
}
