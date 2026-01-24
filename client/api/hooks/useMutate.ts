import { useMutation } from "@tanstack/react-query";
import { createDreamAnalysis } from "..";
import { CreateDreamDTO, DreamAnalysis, ApiResponse } from "../types";

export const useCreateDream = () => {
  return useMutation<ApiResponse<DreamAnalysis>, Error, CreateDreamDTO>({
    mutationFn: createDreamAnalysis,
  });
};
