import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;
const isApiKeyValid = apiKey && apiKey !== 'REPLACE_WITH_YOUR_API_KEY';

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
