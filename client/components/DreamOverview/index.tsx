"use client";

import { useState, useMemo } from "react";
import { Button } from "@/shared/components/Ui/button";
import { Card } from "@/shared/components/Ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/Ui/tabs";
import { ConfirmModal } from "../../shared/components/Ui/confirm-modal";
import { TodoistIcon } from "../../shared/components/Ui/TodoistIcon";
import { DreamAnalysis } from "./DreamAnalysis";
import { DreamInsight } from "./DreamInsight";
import { DreamNarration } from "./DreamNarration";

import { API_BASE_URL, getOrCreateVisitorId } from "@/api/config";
import { useProfileConnection } from "@/shared/hooks/useProfileConnection";
import { useStartReflection } from "@/api/hooks/useMutate";
import { DreamDetailsProps, AgenticHook, SafeDreamParams } from "@/shared/types/types";

import { infoCards } from "@/shared/config";
import { Profile } from "../Profile";
import { ContentLoading } from "@/shared/components/AppStates";

export function DreamOverview({
  dream,
  profile,
  onBack,
  isLoading = false,
  onDelete,
}: DreamDetailsProps) {
  const [activeTab, setActiveTab] = useState("insights");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [dreamToDelete, setDreamToDelete] = useState<string | null>(null);

  const { mutate: start } = useStartReflection();
  const { isTodoistConnected } = useProfileConnection(profile);

  const connectTodoist = () => {
    window.location.href = `${API_BASE_URL}/auth/todoist/${dream._id}/${getOrCreateVisitorId()}`;
  };

  const handleStartReflection = (actionId: string) => {
    const newTab = window.open("about:blank", "_blank");
    start(
      {
        actionId,
      },
      {
        onSuccess: (data: any) => {
          if (data.url && newTab) {
            newTab.location.href = data.url;
          }
        },
        onError: (error: any) => {
          console.log(error, error);
          if (newTab) newTab.close();
        },
      },
    );
  };

  const handleOpenDeleteModal = (dreamId: string) => {
    setDreamToDelete(dreamId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!dreamToDelete) return;
    onDelete(dreamToDelete);
    setConfirmDeleteOpen(false);
    setDreamToDelete(null);
  };

  const hookUIMap: Record<
    AgenticHook,
    { label: string; icon: React.ReactNode; onClick: () => void }
  > = {
    "todo:add": {
      label: isTodoistConnected ? "Connected to Todoist" : "Connect to Todoist",
      icon: <TodoistIcon />,
      onClick: connectTodoist,
    },
    "calendar:add": {
      label: "Connect Calendar",
      icon: <TodoistIcon />,
      onClick: connectTodoist,
    },
    "reminder:set": {
      label: "Enable Reminders",
      icon: <TodoistIcon />,
      onClick: connectTodoist,
    },
    "doc:write": {
      label: "Create Document",
      icon: <TodoistIcon />,
      onClick: connectTodoist,
    },
    "notion:add": {
      label: "Connect Notion",
      icon: <TodoistIcon />,
      onClick: connectTodoist,
    },
  };

  const safeDream: SafeDreamParams = useMemo(() => {
    return {
      dreamText: dream?.dreamText ?? "",
      intake: {
        symbols: dream?.intake?.symbols ?? [],
        characters: dream?.intake?.characters ?? [],
        emotions: dream?.intake?.emotions ?? [],
        actions: dream?.intake?.actions ?? [],
        repeated_elements: dream?.intake?.repeated_elements ?? [],
        agency: dream?.intake?.agency ?? 0,
      },
      reflection: {
        themes: dream?.reflection?.themes ?? [],
        insights: dream?.reflection?.insights ?? "",
        suggested_action_hint: dream?.reflection?.suggested_action_hint ?? "",
      },
      action: {
        type: dream?.action?.type,
        content: dream?.action?.content ?? "",
        duration: dream?.action?.duration,
        agenticHooks: dream?.action?.agenticHooks ?? [],
        id: dream?.action?._id,
      },
    };
  }, [dream]);

  const analysisCards = useMemo(() => {
    return infoCards(safeDream);
  }, [safeDream]);

  if (isLoading || !dream) {
    return <ContentLoading message="Loading dream details..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dreams
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOpenDeleteModal(dream._id)}
            className="text-destructive hover:text-destructive cursor-pointer hover:bg-destructive/10 border-destructive/20"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <Profile safeDream={safeDream} dream={dream} />
            <DreamAnalysis analysisCards={analysisCards} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b border-border">
                  <TabsList className="w-4/5 mx-4 justify-start rounded-none bg-transparent p-0 h-auto overflow-x-auto">
                    <TabsTrigger
                      value="insights"
                      className="rounded-lg border-b-2 border-transparent cursor-pointer data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6 whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Insights
                    </TabsTrigger>
                    <TabsTrigger
                      value="dream"
                      className="rounded-lg border-b-2 border-transparent cursor-pointer data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6 whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                      Dream Narrative
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="dream" className="p-0 m-0">
                  <DreamNarration safeDream={safeDream} />
                </TabsContent>

                <TabsContent value="insights" className="p-0 m-0">
                  <DreamInsight
                    safeDream={safeDream}
                    hookUIMap={hookUIMap}
                    isTodoistConnected={isTodoistConnected}
                    handleStartReflection={handleStartReflection}
                    activeTab={activeTab}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete Dream?"
        description="Are you sure you want to delete this dream? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}