"use client";

import { Suspense } from "react";
import { LandingPage } from "@/components/LandingPage";
import { DreamCapture } from "@/components/DreamCapture";
import { MetricsBoard } from "@/components/MetricsBoard";
import { DreamOverview } from "@/components/DreamOverview";
import { DreamJournal } from "@/components/DreamJournal";
import { useDreamManager } from "@/shared/hooks/useDreamManager";
import {
  FullPageLoading,
  FullPageError,
  PageLoadingSpinner,
  DreamNotFound,
} from "@/shared/components/AppStates";

function HomeContent() {
  const {
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
    dreams,
    dream,
    profile,
    handleSaveDream,
    handleDeleteDream,
    handleSelectDream,
    navigateToInsights,
    navigateToJournal,
    navigateToCapture,
    navigateToLanding,
    refetchDream
  } = useDreamManager();

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onGetStarted={() => navigateToJournal()} />;
      case "capture":
        return (
          <DreamCapture
            onSave={handleSaveDream}
            onBack={() => navigateToJournal()}
            isSaving={isCreatingDream}
          />
        );
      case "journal":
        return (
          <DreamJournal
            dreams={dreams}
            onNewDream={() => navigateToCapture()}
            onBack={() => navigateToLanding()}
            onSelectDream={handleSelectDream}
            isLoading={loadingAllDreams}
          />
        );
      case "insights":
        return (
          <MetricsBoard
            onBack={() => navigateToJournal()}
            dreamCount={Array.isArray(dreams) ? dreams.length : 0}
          />
        );
      case "details":
        if (!selectedDream) return null;

        if (dreamError && dreamErrorDetails?.message?.includes("not found")) {
          return <DreamNotFound onBack={navigateToJournal} />;
        }

        return (
          <DreamOverview
            dream={dream}
            profile={profile}
            onBack={() => navigateToJournal()}
            isLoading={loadingDream}
            onDelete={handleDeleteDream}
            refetchDream={refetchDream}
          />
        );
      default:
        return null;
    }
  };

  if (isInitialLoading && currentView !== "landing") {
    return <FullPageLoading message="Loading your dreams..." />;
  }

  if (dreamsError || dreamError) {
    return (
      <FullPageError
        message={
          dreamsErrorDetails?.message ||
          dreamErrorDetails?.message ||
          "Failed to load dreams"
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <PageLoadingSpinner
        show={(loadingAllDreams || loadingDream) && currentView !== "landing"}
      />

      {renderView()}

      {currentView !== "landing" && currentView === "journal" && (
        <div className="fixed bottom-6 right-6 flex gap-2 z-40">
          <button
            onClick={() => navigateToInsights()}
            className="px-4 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            Insights
          </button>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<FullPageLoading message="Loading page..." />}>
      <HomeContent />
    </Suspense>
  );
}
