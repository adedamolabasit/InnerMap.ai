import { openai } from '../services/openai.service';
import { DreamIntakeResult } from './types';

export const dreamIntakeAgentPrompt = (dreamText: string) => `
You are the Dream Intake Agent.
Your task is to analyze a user's dream and output structured JSON only.
DO NOT provide explanations, markdown, or any text outside JSON.

Dream:
${dreamText}

Return JSON strictly in this format:
{
  "symbols": ["observable objects, places, roles"],
  "characters": ["self, known people, unknown people"],
  "emotions": ["emotions experienced by the dreamer"],
  "actions": ["notable actions by dreamer"],
  "repeated_elements": ["repeated or emphasized elements"],
  "agency": 0.0  // perceived control over events, float between 0 and 1
}
`;

export const analyzeDreamIntake = async (dreamText: string): Promise<DreamIntakeResult> => {
  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: dreamIntakeAgentPrompt(dreamText),
  });

  return JSON.parse(response.output_text) as DreamIntakeResult;
};
