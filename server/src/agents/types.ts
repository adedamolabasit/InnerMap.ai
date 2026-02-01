export interface DreamIntakeResult {
  symbols: string[];
  characters: string[];
  emotions: string[];
  actions: string[];
  repeated_elements: string[];
  agency: number;
  todoisUrl: string;
}

export interface ReflectionResult {
  themes: string[];
  insights: string;
}

export type ActionType = "todo" | "goal" | "reflect";

export interface ActionAgentResult {
  type: "todo" | "goal" | "reflect";
  content: string;
  duration?: string;
  agenticHooks: (
    | "calendar:add"
    | "reminder:set"
    | "todo:add"
    | "doc:write"
    | "notion:add"
  )[];
  agentMessage?: string;
  completed?: boolean;
  completedAt?: Date;
}
