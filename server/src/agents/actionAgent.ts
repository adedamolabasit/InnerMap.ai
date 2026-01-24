import { openai } from '../services/openai.service';

export type ActionAgentResult = {
  type: 'todo' | 'goal' | 'reflect';
  content: string;
  duration?: string;
};

export const actionAgent = async (
  themes: string[]
): Promise<ActionAgentResult> => {
  const response = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `
You are a calm, reflective assistant that suggests gentle next steps
based on dream themes. Return strictly JSON, no markdown, no explanation.
`
      },
      {
        role: 'user',
        content: `
Based on these themes: ${themes.join(', ')}

Suggest ONE gentle next step.
Return JSON exactly in this format:
{
  "type": "todo" | "goal" | "reflect",
  "content": "string",
  "duration": "optional"
}
`
      }
    ]
  });

  const rawText = response.output_text;

  try {
    const cleanText = rawText
      .replace(/```json|```/g, '') // strip markdown if present
      .trim();

    return JSON.parse(cleanText) as ActionAgentResult;
  } catch (err) {
    console.error('Failed to parse ActionAgent JSON:', rawText);
    throw new Error('Action agent returned invalid JSON');
  }
};
