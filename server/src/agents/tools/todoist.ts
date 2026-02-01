import { todoistAI } from "../Todoist.agent";
import { resolveDueString } from "../../utils";

export async function addTodoistTask(token: string, action: any) {
  if (!token) throw new Error("User not connected to Todoist");

  const { mainTask, subtasks } = await todoistAI(action.content);

  const mainRes = await fetch("https://api.todoist.com/rest/v2/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: mainTask.content,
      description: mainTask.description,
      due_string: resolveDueString(action.duration || "today"),
      due_lang: "en",
    }),
  });

  if (!mainRes.ok) {
    const text = await mainRes.text();
    throw new Error(
      `Todoist API error (main task): ${mainRes.status} - ${text}`,
    );
  }

  const createdMain = await mainRes.json();

  for (const sub of subtasks) {
    const subRes = await fetch("https://api.todoist.com/rest/v2/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: sub,
        parent_id: createdMain.id,
        due_string: resolveDueString(action.duration || "today"),
        due_lang: "en",
      }),
    });

    if (!subRes.ok) {
      const text = await subRes.text();
      console.error(`Failed to create subtask: ${text}`);
      continue;
    }
  }

  return {
    url: createdMain.url,
  };
}
