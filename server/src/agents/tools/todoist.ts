import { resolveDueString } from "../../utils";
import { todoistAI } from "../todoist.agent";

export async function addTodoistTask(
  token: string,
  action: any,
  reflection: any,
) {
  if (!token) {
    console.error("User not connected to Todoist");
    return null;
  }

  try {
    const { mainTask, subtasks } = await todoistAI(action.content, reflection);

    const mainRes = await fetch("https://api.todoist.com/api/v1/tasks", {
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

    const mainText = await mainRes.text();

    if (!mainRes.ok) {
      return null;
    }

    const createdMain = JSON.parse(mainText);

    for (const sub of subtasks) {
      try {
        const subRes = await fetch("https://api.todoist.com/api/v1/tasks", {
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
          continue;
        }
      } catch (subErr) {}
    }

    return {
      url: `https://app.todoist.com/app/task/${createdMain.id}`,
    };
  } catch (err) {
    console.error("Failed to add Todoist task:", err);
    return null;
  }
}
