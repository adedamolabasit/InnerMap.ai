import { openai } from "../services/openai.service";

export async function todoistAI(actionContent: string) {
  const mainTaskRes = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
You are a calm, reflective assistant.
Return valid JSON only, no markdown or explanation.
`,
      },
      {
        role: "user",
        content: `
Take the following task and return EXACTLY this JSON shape:
{
  "content": string,
  "description": string
}

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
You are a calm, reflective assistant.
Return valid JSON only, no markdown or explanation.
`,
      },
      {
        role: "user",
        content: `
Take the following task and generate an array of 3-5 actionable subtasks as JSON array:
[
  "subtask1",
  "subtask2",
  "subtask3"
]

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
