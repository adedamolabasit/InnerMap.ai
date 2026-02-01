import { HookResult } from "../models/types";
import { addTodoistTask } from "../agents/tools/todoist";

export const executeAgenticHooks = async (
  hooks: string[],
  payload: { userId: any; content: string; duration?: string },
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
        results.push({ hook, status: "odo:add", executedAt: new Date() });
        break;
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
