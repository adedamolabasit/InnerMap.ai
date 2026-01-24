import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getUserDreams, getDreamById } from "..";

import { DreamAnalysis, DreamListResponse, ApiResponse } from "../types";

export const useUserDreams = (
  userId: string,
  options?: Omit<UseQueryOptions<DreamListResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<DreamListResponse>({
    queryKey: ["all-users-dream"],
    queryFn: () => getUserDreams(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useDream = (
  dreamId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<DreamAnalysis>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ApiResponse<DreamAnalysis>>({
    queryKey: ["single-journal"],
    queryFn: () => getDreamById(dreamId),
    enabled: !!dreamId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};
