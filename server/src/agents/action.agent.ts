// src/agents/action.agent.ts
import { openai } from "../services/openai.service";
import { ActionAgentResult } from "./types";
import { GLOBAL_SYSTEM_PROMPT } from "./utils/prompts";

export const actionAgentPrompt = (
  themes: string[],
  agency: number,
  previousActionCompleted?: boolean,
) => `
${GLOBAL_SYSTEM_PROMPT}

You are the Dream Action Agent.

Dream themes: ${themes.join(", ")}
Agency level: ${agency}
Previous action completed: ${previousActionCompleted ? "yes" : "no"}

Rules:
- If agency < 0.5 OR previous action not completed → reflective action
- If agency >= 0.5 AND previous action completed → proactive goal
- If this is a proactive goal → include "calendar:add" or "todo:add"
- If this is reflective → include "reminder:set"
- Return **JSON only**, no extra explanation or text.

Output format:
{
  "type": "todo" | "goal" | "reflect",
  "content": "string describing the next step",
  "duration": "optional, e.g., '15 minutes', '1 day'",
  "agenticHooks": ["calendar:add", "reminder:set", "todo:add"] 
}
`;

export const analyzeAction = async (
  themes: string[],
  agency: number,
  previousActionCompleted?: boolean,
): Promise<ActionAgentResult> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: actionAgentPrompt(themes, agency, previousActionCompleted),
  });

  const raw = response.output_text.replace(/```/g, "").trim();
  return JSON.parse(raw) as ActionAgentResult;
};
