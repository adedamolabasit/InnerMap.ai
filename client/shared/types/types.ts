import { ReactNode } from "react";

export interface DreamAnalysis {
  id: string;
  userId: string;
  dreamText: string;
  analysis: {
    summary: string;
    symbols: string[];
    themes: string[];
    interpretation: string;
    suggestions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDreamDTO {
  dreamText: string;
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface DreamListResponse {
  id: string;
  content: string;
  date: string;
  mood?: string;
}

export interface DreamResponse {
  _id: string;
  userId: string;
  dreamText: string;
  intake: {
    symbols: string[];
    characters: string[];
    emotions: string[];
    actions: string[];
    repeated_elements: string[];
    agency: number;
  };
  reflection: {
    themes: string[];
    insights: string;
    suggested_action_hint: string;
  };
  action: {
    type: string;
    content: string;
    duration?: string;
    agenticHooks: string[];
    _id: string;
  };
  createdAt: string;
}

export interface UserProfileResponse {
  _id?: string;
  visitorId?: string;
  todoistAccessToken?: string;
  todoistTokenExpiry?: string;
  todoistConnectedAt?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface SafeDreamParams {
  dreamText: string;

  intake: {
    symbols: string[];
    characters: string[];
    emotions: string[];
    actions: string[];
    repeated_elements: string[];
    agency: number;
  };

  reflection: {
    themes: string[];
    insights: string;
    suggested_action_hint: string;
  };

  action: {
    type: string;
    content: string;
    duration?: string;
    agenticHooks: string[];
    id?: string;
  };
}

export interface DreamInsightCard {
  id:
    | "symbols"
    | "characters"
    | "emotions"
    | "actions"
    | "patterns"
    | "themes"
    | "repetitions";
  title: string;
  count: number;
  icon: string;
  summary: string;
  details: ReactNode;
}

export type AgenticHook =
  | "calendar:add"
  | "reminder:set"
  | "todo:add"
  | "doc:write"
  | "notion:add";

export interface DreamDetailsProps {
  dream: DreamResponse;
  profile: UserProfileResponse;
  onBack: () => void;
  isLoading?: boolean;
  onDelete: (id: string) => void;
  refetchDream: () => void;
}

export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
}

export interface DreamJournalProps {
  dreams: DreamListResponse[];
  onNewDream: () => void;
  onBack: () => void;
  onSelectDream: (dream: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export interface AudioTranscribeInput {
  audio: Blob;
}

export interface AudioTranscribeResponse {
  text: string;
}
