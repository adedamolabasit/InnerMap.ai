import { HookResult } from "../models/types";
import { addTodoToNotion, getDatabaseId } from "../agents/tools/notion";

export const executeAgenticHooks = async (
  hooks: string[],
  payload: { userId: string; content: string; duration?: string },
) => {
  const results: HookResult[] = [];

  for (const hook of hooks) {
    switch (hook) {
      case "calendar:add":
        results.push({ hook, status: "scheduled", executedAt: new Date() });
        break;

      case "reminder:set":
        results.push({
          hook,
          status: "reminder_created",
          executedAt: new Date(),
        });
        break;

      case "todo:add":
        // getDatabaseId();

        await addTodoToNotion({
          name: "Finish AI project",
          description: "Complete the frontend and backend integration",
          dueDate: "2026-01-30",
          assignedTo: "adam@example.com",
          status: "Pending",
        });
        results.push({
          hook,
          status: "todo_created",
          executedAt: new Date(),
        });
        break;
      case "doc:write":
        results.push({ hook, status: "doc_created", executedAt: new Date() });
        break;

      case "notion:add":
        results.push({
          hook,
          status: "notion_page_created",
          executedAt: new Date(),
        });
        break;

      default:
        results.push({
          hook,
          status: "ignored",
          executedAt: new Date(),
        });
    }
  }

  return results;
};
