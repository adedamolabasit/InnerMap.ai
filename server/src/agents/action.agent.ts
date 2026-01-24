// src/agents/action.agent.ts
import { openai } from "../services/openai.service";
import { ActionAgentResult } from "./types";
import { GLOBAL_SYSTEM_PROMPT } from "./prompts/prompts";

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
- Decide the type of next action: "reflect", "todo", or "goal" based on agency and previous action completion.
- If type is "reflect", suggest agenticHooks like ["doc:write", "notion:add"] or ["reminder:set"], depending on what best supports journaling, reflection, or insight generation.
- If type is "todo", suggest ["todo:add"] or ["calendar:add"].
- If type is "goal", suggest ["calendar:add", "todo:add"].
- Include a short explanation in "agentMessage" describing **why this action was chosen** (shows agent reasoning).
- Return **JSON only**, no extra text.

Output format (valid JSON):
{
  "type": "todo" | "goal" | "reflect",
  "content": "string describing the next step",
  "duration": "optional, e.g., '15 minutes', '1 day'",
  "agenticHooks": ["calendar:add", "reminder:set", "todo:add", "doc:write", "notion:add"],
  "agentMessage": "string explaining why this action was chosen"
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
