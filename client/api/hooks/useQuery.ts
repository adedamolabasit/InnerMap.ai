import { useQuery } from "@tanstack/react-query";
import { getUserDreams, getDreamById, getProfile } from "..";

import {
  DreamListResponse,
  ApiResponse,
  UserProfileResponse,
  DreamResponse,
} from "../../shared/types/types";

export const useUserDreams = (userId: string) => {
  return useQuery<DreamListResponse[]>({
    queryKey: ["all-users-dream", userId],
    queryFn: () => getUserDreams(),
    enabled: !!userId,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useDream = (dreamId: string) => {
  return useQuery<ApiResponse<DreamResponse>>({
    queryKey: ["single-journal", dreamId],
    queryFn: () => getDreamById(dreamId),
    enabled: !!dreamId,

    refetchInterval: (query) => {
      const dream = query.state.data?.data;

      if (!dream) return 12000;

      const complete = dream.intake && dream.reflection && dream.action;

      return complete ? false : 12000;
    },

    refetchOnWindowFocus: false,
  });
};

export const useProfile = () => {
  return useQuery<ApiResponse<UserProfileResponse>>({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};
