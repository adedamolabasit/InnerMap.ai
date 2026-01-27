"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LandingPage } from "@/components/landing-page";
import { DreamCapture } from "@/components/dream-capture";
import { DreamJournal } from "@/components/dream-journal";
import { InsightsDashboard } from "@/components/insights-dashboard";
import { DreamDetails } from "@/components/dream-details";
import { useUserDreams } from "@/api/hooks/useQuery";
import { useDream } from "@/api/hooks/useQuery";
import { DreamListResponse } from "@/api/types";
import { useCreateDream } from "@/api/hooks/useMutate";
import { useDeleteDream } from "@/api/hooks/useMutate";
import { DreamResponse } from "@/api/types";
import { useToast } from "@/hooks/use-toast";

interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
}

type View = "landing" | "capture" | "journal" | "insights" | "details";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [selectedDream, setSelectedDream] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { toast } = useToast();

  const params = new URLSearchParams(searchParams.toString());
  const {
    data: dreams = [],
    isLoading: loadingAllDreams,
    isError: dreamsError,
    error: dreamsErrorDetails,
    refetch,
  } = useUserDreams("iiei");

  const {
    data: dream = {},
    isLoading: loadingDream,
    isError: dreamError,
    error: dreamErrorDetails,
  } = useDream(selectedDream as string);

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

  const { mutate: createDream, isPending: isCreatingDream } = useCreateDream();

  const { mutate: deleteDream, isPending: isDeleting } = useDeleteDream();

  const handleSaveDream = (content: string) => {
    createDream(
      {
        dreamText: content,
        userId: "iiei",
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

        console.error("Dream delete failed ❌", error);
      },
    });
  };

  const handleSelectDream = (dreamId: string) => {
    setSelectedDream(dreamId);
    setCurrentView("details");
  };

  console.log(currentView, "cur");

  useEffect(() => {
    if (currentView) {
      params.set("view", currentView);
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onGetStarted={() => setCurrentView("journal")} />;
      case "capture":
        return (
          <DreamCapture
            onSave={handleSaveDream}
            onBack={() => setCurrentView("journal")}
            isSaving={isCreatingDream}
          />
        );
      case "journal":
        return (
          <DreamJournal
            dreams={dreams as DreamListResponse[]}
            onNewDream={() => setCurrentView("capture")}
            onBack={() => setCurrentView("landing")}
            onSelectDream={handleSelectDream}
            isLoading={loadingAllDreams}
          />
        );
      case "insights":
        return (
          <InsightsDashboard
            onBack={() => setCurrentView("journal")}
            dreamCount={Array.isArray(dreams) ? dreams.length : 0}
          />
        );
      case "details":
        return selectedDream ? (
          <DreamDetails
            dream={dream as DreamResponse}
            onBack={() => setCurrentView("journal")}
            isLoading={loadingDream}
            onDelete={handleDeleteDream}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (isInitialLoading && currentView !== "landing") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>

          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading your dreams...
          </h2>
          <p className="text-muted-foreground">Preparing your dream journal</p>
        </div>
      </main>
    );
  }

  if (dreamsError || dreamError) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">
            {dreamsErrorDetails?.message ||
              dreamErrorDetails?.message ||
              "Failed to load dreams"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {(loadingAllDreams || loadingDream) && currentView !== "landing" && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
          <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-1/2"></div>
        </div>
      )}

      {renderView()}

      {currentView !== "landing" && (
        <div className="fixed bottom-6 right-6 flex gap-2 z-40">
          {currentView === "journal" && (
            <button
              onClick={() => setCurrentView("insights")}
              className="px-4 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Insights
            </button>
          )}
        </div>
      )}
    </main>
  );
}
