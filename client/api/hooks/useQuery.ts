import { useQuery } from "@tanstack/react-query";
import { getUserDreams, getDreamById, getProfile } from "..";

import {
  DreamAnalysis,
  DreamListResponse,
  ApiResponse,
  UserProfileResponse,
} from "../../shared/types/types";

export const useUserDreams = (userId: string) => {
  return useQuery<DreamListResponse[]>({
    queryKey: ["all-users-dream"],
    queryFn: () => getUserDreams(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });
};

export const useDream = (dreamId: string) => {
  return useQuery<ApiResponse<DreamAnalysis>>({
    queryKey: ["single-journal", dreamId],
    queryFn: () => getDreamById(dreamId),
    enabled: !!dreamId,
    staleTime: 0,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });
};

export const useProfile = () => {
  return useQuery<ApiResponse<UserProfileResponse>>({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 0,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });
};
