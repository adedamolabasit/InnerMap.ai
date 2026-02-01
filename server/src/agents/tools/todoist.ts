import { todoistAI } from "../Todoist.agent";

/**
 * Add a Todoist task with subtasks for a user action
 * @param token User's Todoist access token
 * @param action UserAction object
 */

export async function addTodoistTask(token: string, action: any) {
  if (!token) throw new Error("User not connected to Todoist");

  // 1️⃣ Generate AI-enriched main task and subtasks
  const { mainTask, subtasks } = await todoistAI(action.content);

  // 2️⃣ Create main task in Todoist
  const mainRes = await fetch("https://api.todoist.com/rest/v2/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: mainTask.content,
      description: mainTask.description,
      due_string: action.duration || "today",
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
  console.log(createdMain, "main");
  console.log("Main task created:", createdMain.id, createdMain.content);

  // 3️⃣ Create subtasks under the main task
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
        due_string: action.duration || "today",
        due_lang: "en",
      }),
    });

    if (!subRes.ok) {
      const text = await subRes.text();
      console.error(`Failed to create subtask: ${text}`);
      continue;
    }

    const subTask = await subRes.json();
    console.log("Subtask created:", subTask.id, subTask.content);
  }

  return {
    url: createdMain.url,
  };
}
