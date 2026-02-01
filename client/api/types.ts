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

export type SafeDreamParams = {
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
};

export type DreamInsightCard = {
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
};
