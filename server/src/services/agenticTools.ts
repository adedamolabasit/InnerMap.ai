import { HookResult } from "../models/types";

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
        results.push({
          hook,
          status: "todo_created",
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
