import { openai } from "../services/openai.service";
type Reflection = {
  themes: string[];
  insights: string;
  suggested_action_hint?: string;
};

export async function todoistAI(
  actionContent: string,
  reflection?: Reflection,
) {
  const reflectionContext = reflection
    ? `
Reflection context (emotional / symbolic):
Themes:
- ${reflection.themes.join("\n- ")}

Insights:
${reflection.insights}

Suggested gentle direction:
${reflection.suggested_action_hint ?? "None provided"}

Use this reflection to ground the task in real-life emotional awareness.
Do NOT pathologize. Keep actions gentle, practical, and self-directed.
`
    : "";

  /* =======================
     MAIN TASK
  ======================= */
  const mainTaskRes = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
You are a calm, emotionally reflective assistant.
You turn symbolic or emotional insights into gentle, real-world actions.
Return valid JSON only. No markdown. No explanation.
`,
      },
      {
        role: "user",
        content: `
${reflectionContext}

Take the following task and return EXACTLY this JSON shape:
{
  "content": string,
  "description": string
}

Rules:
- Interpret the task through the emotional reflection
- Keep wording non-judgmental and grounded
- Prefer curiosity, observation, or expression over "fixing"
- The task should feel safe and doable in everyday life

Task:
"${actionContent}"
`,
      },
    ],
  });

  const rawMain = mainTaskRes.output_text;
  let mainTask: { content: string; description: string };

  try {
    mainTask = JSON.parse(rawMain);
  } catch {
    throw new Error("Todoist AI returned invalid JSON for main task");
  }

  const subtasksRes = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
You are a calm, emotionally reflective assistant.
You create gentle, real-life steps for emotional processing.
Return valid JSON only. No markdown. No explanation.
`,
      },
      {
        role: "user",
        content: `
${reflectionContext}

Generate an array of 3–5 gentle, actionable subtasks as JSON array:
[
  "subtask 1",
  "subtask 2",
  "subtask 3"
]

Rules:
- Steps should involve journaling, noticing, naming feelings, or reflection
- Avoid advice, diagnosis, or emotional pressure
- Each step should feel small and safe
- Write as real-world actions someone can actually do

Task:
"${actionContent}"
`,
      },
    ],
  });

  const rawSubtasks = subtasksRes.output_text;
  let subtasks: string[];

  try {
    subtasks = JSON.parse(rawSubtasks);
  } catch {
    throw new Error("Todoist AI returned invalid JSON for subtasks");
  }

  return { mainTask, subtasks };
}
