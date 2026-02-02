import { useMutation } from "@tanstack/react-query";
import {
  createDreamAnalysis,
  deleteDream,
  startReflection,
  audioTranscribe,
} from "..";
import {
  CreateDreamDTO,
  DreamAnalysis,
  ApiResponse,
  AudioTranscribeInput,
  AudioTranscribeResponse,
} from "../types";

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

export const useStartReflection = () => {
  return useMutation<ApiResponse<{ url: string }>, Error, any>({
    mutationFn: (actionId: string) => startReflection(actionId),
  });
};

export const useAudioTranscribe = () => {
  return useMutation<
    ApiResponse<AudioTranscribeResponse>,
    Error,
    AudioTranscribeInput
  >({
    mutationFn: audioTranscribe,
  });
};
