import { CreateDreamDTO, DreamAnalysis, ApiResponse, DreamListResponse } from './types';
import { apiClient } from './config';


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
): Promise<DreamListResponse[]> => {
  return apiClient<DreamListResponse[]>(
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