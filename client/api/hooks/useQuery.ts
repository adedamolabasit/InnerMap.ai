import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getUserDreams, getDreamById, getProfile} from "..";

import {
  DreamAnalysis,
  DreamListResponse,
  ApiResponse,
  UserProfileResponse,
} from "../types";

export const useUserDreams = (userId: string) => {
  return useQuery<DreamListResponse[]>({
    queryKey: ["all-users-dream"],
    queryFn: () => getUserDreams(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useDream = (dreamId: string) => {
  return useQuery<ApiResponse<DreamAnalysis>>({
    queryKey: ["single-journal", dreamId],
    queryFn: () => getDreamById(dreamId),
    enabled: !!dreamId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useProfile = () => {
  return useQuery<ApiResponse<UserProfileResponse>>({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 10 * 60 * 1000,
  });
};

