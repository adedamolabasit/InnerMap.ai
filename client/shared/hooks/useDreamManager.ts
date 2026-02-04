"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/shared/hooks/useToast";
import { useUserDreams, useDream, useProfile } from "@/api/hooks/useQuery";
import { useCreateDream, useDeleteDream } from "@/api/hooks/useMutate";
import { useCompleteAction } from "@/api/hooks/useMutate";
import { getOrCreateVisitorId } from "@/api/config";
import {
  DreamListResponse,
  DreamResponse,
  UserProfileResponse,
} from "@/shared/types/types";

type View = "landing" | "capture" | "journal" | "insights" | "details";

export const useDreamManager = () => {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [selectedDream, setSelectedDream] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const dreamIdFromUrl = searchParams.get("dreamId");

  const {
    data: dreams = [],
    isLoading: loadingAllDreams,
    isError: dreamsError,
    error: dreamsErrorDetails,
    refetch,
  } = useUserDreams(getOrCreateVisitorId() as string);

  const {
    data: dream = {},
    isLoading: loadingDream,
    isError: dreamError,
    error: dreamErrorDetails,
    refetch: refetchDream,
  } = useDream(dreamIdFromUrl as string);

  const { data: profile } = useProfile();
  const { mutate: createDream, isPending: isCreatingDream } = useCreateDream();
  const { mutate: completeAction } = useCompleteAction();
  const { mutate: deleteDream, isPending: isDeleting } = useDeleteDream();

  useEffect(() => {
    if (currentView === "landing") {
      setIsInitialLoading(false);
      return;
    }

    if (loadingAllDreams) {
      setIsInitialLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loadingAllDreams, currentView]);

  useEffect(() => {
    const view = searchParams.get("view") as View | null;
    const dreamId = searchParams.get("dreamId");

    if (view === "details" && dreamId) {
      setCurrentView("details");
      setSelectedDream(dreamId);
    } else if (view === "journal") {
      setCurrentView("journal");
      setSelectedDream("");
    } else {
      setCurrentView("landing");
      setSelectedDream("");
    }
  }, [searchParams]);

  const handleSaveDream = (content: string) => {
    createDream(
      {
        dreamText: content,
        userId: getOrCreateVisitorId() as string,
      },
      {
        onSuccess: () => {
          setCurrentView("journal");
          toast({
            title: "Dream saved",
            description: "Your dream was analyzed successfully.",
          });
          refetch();
        },
        onError: (error) => {
          toast({
            title: "Something went wrong",
            description:
              error instanceof Error
                ? error.message
                : "Failed to analyze dream. Please try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleDeleteDream = (dreamId: string) => {
    deleteDream(dreamId, {
      onSuccess: () => {
        toast({
          title: "Dream deleted",
          description: "The dream has been removed from your journal.",
        });

        setSelectedDream("");
        setCurrentView("journal");

        router.push("/?view=journal", { scroll: false });

        refetch();
      },
      onError: (error) => {
        toast({
          title: "Delete failed",
          description:
            error instanceof Error
              ? error.message
              : "Could not delete the dream. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleCompleteAction = (content: string) => {
    completeAction(
      {
        dreamId: content,
      },
      {
        onSuccess: () => {
          refetchDream;
        },
        onError: (error) => {
          toast({
            title: "Something went wrong",
            description:
              error instanceof Error
                ? error.message
                : "Failed to analyze dream. Please try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleSelectDream = (dreamId: string) => {
    router.push(`${pathname}?view=details&dreamId=${dreamId}`);
  };

  const navigateToInsights = () => {
    setCurrentView("insights");
  };

  const navigateToJournal = () => {
    router.push(`${pathname}?view=journal`);
  };

  const navigateToCapture = () => {
    setCurrentView("capture");
  };

  const navigateToLanding = () => {
    router.push(`${pathname}?view=landing`);
  };

  return {
    currentView,
    selectedDream,
    isInitialLoading,
    loadingAllDreams,
    loadingDream,
    dreamsError,
    dreamError,
    dreamsErrorDetails,
    dreamErrorDetails,
    isCreatingDream,
    isDeleting,

    dreams: dreams as DreamListResponse[],
    dream: dream as DreamResponse,
    profile: profile as UserProfileResponse,

    handleSaveDream,
    handleDeleteDream,
    handleSelectDream,
    handleCompleteAction,
    navigateToInsights,
    navigateToJournal,
    navigateToCapture,
    navigateToLanding,
    setCurrentView,
    refetch,
    refetchDream,
  };
};
