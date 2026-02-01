import { ActionAgentResult } from "../agents/types";

export interface HookResult {
  hook: string;
  status: string;
  executedAt: Date;
}

export interface StoredAction extends ActionAgentResult {
  hookResults: HookResult[];
  completed: boolean;
  completedAt?: Date;
  todoisUrl?: string
}
