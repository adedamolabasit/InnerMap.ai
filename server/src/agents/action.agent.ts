// src/agents/action.agent.ts
import { openai } from "../services/openai.service";
import { ActionAgentResult } from "./types";
import { GLOBAL_SYSTEM_PROMPT } from "./utils/prompts";

export const actionAgentPrompt = (themes: string[], agency: number) => `
${GLOBAL_SYSTEM_PROMPT}

You are the Dream Action Agent.

Based on these dream themes: ${themes.join(", ")} and the dreamer's agency level: ${agency}

Suggest **ONE gentle next step** the user can take.  

Rules:
- If agency >= 0.5, suggest a goal-oriented or proactive action.
- If agency < 0.5, suggest a reflective or mindfulness action.
- Include potential "agentic hooks" to perform tasks in the environment (e.g., calendar:add, reminder:set, todo:add)
- Return **JSON only**, no extra text.

Example output:

{
  "type": "todo",
  "content": "Schedule 15-min journaling session in Google Calendar",
  "duration": "15 minutes",
  "agenticHooks": ["calendar:add", "reminder:set"]
}

Do not give multiple options, do not explain, only JSON.
`;

export const analyzeAction = async (
  themes: string[],
  agency: number
): Promise<ActionAgentResult> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: actionAgentPrompt(themes, agency),
  });

  const raw = response.output_text.replace(/```/g, "").trim();
  return JSON.parse(raw) as ActionAgentResult;
};
  