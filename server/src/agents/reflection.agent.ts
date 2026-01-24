// src/agents/reflection.agent.ts
import { openai } from "../services/openai.service";
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

export const analyzeReflection = async (dreamText: string): Promise<ReflectionResult & { suggested_action_hint: string }> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: reflectionAgentPrompt(dreamText),
  });

  const raw = response.output_text.replace(/```/g, "").trim();
  return JSON.parse(raw) as ReflectionResult & { suggested_action_hint: string };
};
