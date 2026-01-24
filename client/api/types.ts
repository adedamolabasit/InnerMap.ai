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
