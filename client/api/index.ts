import {
  CreateDreamDTO,
  DreamAnalysis,
  ApiResponse,
  DreamListResponse,
  UserProfileResponse,
  AudioTranscribeInput,
  AudioTranscribeResponse,
} from "../shared/types/types";
import { apiClient } from "./config";

export const createDreamAnalysis = async (
  dreamData: CreateDreamDTO,
): Promise<ApiResponse<DreamAnalysis>> => {
  return apiClient<ApiResponse<DreamAnalysis>>("/dream", {
    method: "POST",
    body: JSON.stringify(dreamData),
  });
};

export const getUserDreams = async (): Promise<DreamListResponse[]> => {
  return apiClient<DreamListResponse[]>(`/dreams`);
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
): Promise<ApiResponse<{ url: string }>> => {
  return apiClient<ApiResponse<any>>(`/start-reflection`, {
    method: "POST",
    body: JSON.stringify(actionId),
  });
};

export const audioTranscribe = async (
  input: AudioTranscribeInput,
): Promise<ApiResponse<AudioTranscribeResponse>> => {
  const formData = new FormData();
  formData.append("file", input.audio);

  return apiClient<ApiResponse<AudioTranscribeResponse>>("/audio-transcribe", {
    method: "POST",
    body: formData,
  });
};

export const authUser = async (): Promise<ApiResponse<{ url: string }>> => {
  return apiClient<ApiResponse<any>>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ action: "login" }),
  });
};

export const apiService = {
  createDreamAnalysis,
  getUserDreams,
  getDreamById,
  deleteDream,
  getProfile,
  startReflection,
  audioTranscribe,
  authUser,
};
