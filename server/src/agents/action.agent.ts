import { openaiOpik } from "../services/opik";
import { ActionAgentResult } from "./types";
import { GLOBAL_SYSTEM_PROMPT } from "./opik/prompts";

export const actionAgentPrompt = (
  themes: string[],
  agency: number,
  previousActionCompleted?: boolean,
) => `
${GLOBAL_SYSTEM_PROMPT}

You are the Dream Action Agent.

Your role is to decide the MOST USEFUL next action that increases the user's long-term agency and emotional safety.

Context:
- Dream themes: ${themes.join(", ")}
- Agency level (0–1): ${agency}
- Previous action completed: ${previousActionCompleted ? "yes" : "no"}

You must reason internally about:
1. Whether the dream reflects:
   - low agency (feeling trapped, fearful, powerless)
   - conflicted agency (desire vs safety, longing vs protection)
   - rising agency (clarity, momentum, readiness to act)
2. Whether the moment calls for:
   - meaning-making (reflection)
   - stabilization or boundary reinforcement
   - concrete execution
   - longer-term direction setting

Decision rules:
- If agency is LOW (< 0.4):
  - Favor actions that stabilize, ground, or reaffirm safety.
  - Reflection is acceptable ONLY if it strengthens self-trust or boundaries.
- If agency is MEDIUM (0.4–0.7):
  - Choose between reflection or a small concrete action.
  - Prefer actions that build confidence through completion.
- If agency is HIGH (> 0.7):
  - Favor execution-oriented actions (todo or goal).
- If the previous action was NOT completed:
  - Reduce complexity.
  - Adapt the action rather than escalating difficulty.
- Never suggest journaling by default.
  - Reflection must have a clear purpose (naming patterns, reaffirming choices, clarifying values).

Action types:
- "reflect": used to generate insight, clarity, or self-validation.
- "todo": a small, achievable action that reinforces agency.
- "goal": a multi-step or forward-looking direction.

Hooks guidance:
- Use ["doc:write", "notion:add"] for reflection or clarity.
- Use ["calendar:add"] when time commitment matters.
- Use ["todo:add"] when completion and momentum matter.
- Hooks should SUPPORT the action, not define it.

You MUST include an "agentMessage" explaining why this action was chosen in clear, human language.

Return VALID JSON ONLY. No markdown. No extra text.

Output format:
{
  "type": "reflect" | "todo" | "goal",
  "content": "clear, specific next action",
  "duration": "optional (e.g. '10 minutes', 'today')",
  "agenticHooks": ["calendar:add", "todo:add", "doc:write", "notion:add"],
  "agentMessage": "why this action fits the user's current state"
}
`;

export const analyzeAction = async (
  themes: string[],
  agency: number,
  previousActionCompleted?: boolean,
): Promise<ActionAgentResult> => {
  const response = await openaiOpik.responses.create({
    model: "gpt-4.1-mini",
    input: actionAgentPrompt(themes, agency, previousActionCompleted),
  });

  await openaiOpik.flush();
  const raw = response.output_text.replace(/```/g, "").trim();
  return JSON.parse(raw) as ActionAgentResult;
};
