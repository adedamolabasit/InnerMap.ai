import { useMutation } from "@tanstack/react-query";
import { createDreamAnalysis, deleteDream } from "..";
import { CreateDreamDTO, DreamAnalysis, ApiResponse } from "../types";

export const useCreateDream = () => {
  return useMutation<ApiResponse<DreamAnalysis>, Error, CreateDreamDTO>({
    mutationFn: createDreamAnalysis,
  });
};

export const useDeleteDream = () => {
  return useMutation<ApiResponse<unknown>, Error, string>({
    mutationFn: (dreamId: string) => deleteDream(dreamId),
  });
};