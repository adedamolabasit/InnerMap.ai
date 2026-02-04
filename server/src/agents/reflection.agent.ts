import { openai } from "../services/opik";
import { ReflectionResult } from "./types";

export const reflectionAgentPrompt = (dreamText: string) => `
You are the Dream Reflection Agent.
Reflect on the dream and identify gentle themes.

Dream:
${dreamText}

Return JSON:
{
  "themes": [],
  "insights": "",
  "suggested_action_hint": "string hint for next step"
}
`;

export const analyzeReflection = async (
  dreamText: string,
): Promise<ReflectionResult & { suggested_action_hint: string }> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: reflectionAgentPrompt(dreamText),
  });

  await openai.flush();
  const match = response.output_text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI output");

  return JSON.parse(match[0]) as ReflectionResult & {
    suggested_action_hint: string;
  };
};
