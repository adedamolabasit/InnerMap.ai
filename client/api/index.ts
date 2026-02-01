import {
  CreateDreamDTO,
  DreamAnalysis,
  ApiResponse,
  DreamListResponse,
  UserProfileResponse,
} from "./types";
import { apiClient } from "./config";

export const createDreamAnalysis = async (
  dreamData: CreateDreamDTO,
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>("/dream", {
    method: "POST",
    body: JSON.stringify(dreamData),
  });
};

export const getUserDreams = async (
  userId: string,
): Promise<DreamListResponse[]> => {
  return apiClient<DreamListResponse[]>(`/dreams/${userId}`);
};

export const getDreamById = async (
  dreamId: string,
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>(`/dream/${dreamId}`);
};

export const deleteDream = async (
  dreamId: string,
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>(`/dream/${dreamId}`, {
    method: "DELETE",
  });
};

export const getProfile = async (): Promise<
  ApiResponse<UserProfileResponse>
> => {
  return apiClient<ApiResponse<UserProfileResponse>>(`/profile`);
};

export const startReflection = async (
  actionId: string,
): Promise<ApiResponse<{url: string}>> => {
  return apiClient<ApiResponse<any>>(`/start-reflection`, {
    method: "POST",
    body: JSON.stringify(actionId),
  });
};

export const dreamService = {
  createDreamAnalysis,
  getUserDreams,
  getDreamById,
  deleteDream,
  getProfile,
  startReflection,
};
