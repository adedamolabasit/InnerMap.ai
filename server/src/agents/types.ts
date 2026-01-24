// src/agents/types.ts

export interface DreamIntakeResult {
  symbols: string[];
  characters: string[];
  emotions: string[];
  actions: string[];
  repeated_elements: string[];
  agency: number; // 0 (low control) -> 1 (high control)
}

export interface ReflectionResult {
  themes: string[];
  insights: string;
}

export type ActionType = "todo" | "goal" | "reflect";

export interface ActionAgentResult {
  type: ActionType;
  content: string;
  duration?: string;
  agenticHooks?: string[]; // e.g., ["calendar:add", "reminder:set"]
}
