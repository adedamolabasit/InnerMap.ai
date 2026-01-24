import { CreateDreamDTO, DreamAnalysis, ApiResponse, DreamListResponse } from './types';

const API_BASE_URL = 'http://localhost:4000/api';

const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const createDreamAnalysis = async (
  dreamData: CreateDreamDTO
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>('/dream', {
    method: 'POST',
    body: JSON.stringify(dreamData),
  });
};

export const getUserDreams = async (
  userId: string,
): Promise<DreamListResponse> => {
  return apiClient<DreamListResponse>(
    `/dreams/${userId}`
  );
};

export const getDreamById = async (
  dreamId: string
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>(`/dream/${dreamId}`);
};



export const dreamService = {
  createDreamAnalysis,
  getUserDreams,
  getDreamById,
};