import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;
// A simple check to see if the key is not a placeholder and seems like a real key.
const isApiKeyValid =
  apiKey && !apiKey.includes('REPLACE_WITH_YOUR_API_KEY') && apiKey.length > 30;

const plugins = [];
if (isApiKeyValid) {
  plugins.push(googleAI({apiKey}));
}

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});

export function isAiEnabled() {
  return isApiKeyValid;
}
