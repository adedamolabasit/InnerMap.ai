"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, Bell, CheckSquare, FileText, Notebook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmModal } from "./confirm-modal";
import { DreamInsightCard } from "@/api/types";

import { API_BASE_URL, getOrCreateVisitorId } from "@/api/config";
import { useProfileConnection } from "@/hooks/useProfileConnection";
import { useStartReflection } from "@/api/hooks/useMutate";
import { DreamDetailsProps, AgenticHook, SafeDreamParams } from "@/api/types";

import { infoCards } from "@/config";

export function DreamDetails({
  dream,
  profile,
  onBack,
  isLoading = false,
  onDelete,
}: DreamDetailsProps) {
  const [activeTab, setActiveTab] = useState("dream");
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [dreamToDelete, setDreamToDelete] = useState<string | null>(null);
  // const [analysisCards, setAnalysisCards] = useState<DreamInsightCard[]>([]);

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
    {
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
    }
  > = {
    "todo:add": {
      label: isTodoistConnected ? "Connected to Todoist" : "Connect to Todoist",
      icon: <CheckSquare className="w-4 h-4" />,
      onClick: connectTodoist,
    },
    "calendar:add": {
      label: "Connect Calendar",
      icon: <Calendar className="w-4 h-4" />,
      onClick: connectTodoist,
    },
    "reminder:set": {
      label: "Enable Reminders",
      icon: <Bell className="w-4 h-4" />,
      onClick: connectTodoist,
    },
    "doc:write": {
      label: "Create Document",
      icon: <FileText className="w-4 h-4" />,
      onClick: connectTodoist,
    },
    "notion:add": {
      label: "Connect Notion",
      icon: <Notebook className="w-4 h-4" />,
      onClick: connectTodoist,
    },
  };

  const getAgencyColor = (percentage: number) => {
    if (percentage < 30) return "text-red-500 bg-red-500/10";
    if (percentage < 60) return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
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

  const wordCount = safeDream.dreamText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const agencyPercentage = Math.round(safeDream.intake.agency * 100);

  const analysisCards = useMemo(() => {
    return infoCards(safeDream);
  }, [safeDream]);

  if (isLoading || !dream) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">
              Loading your dream journal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
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
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
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
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card className="p-6 border-border bg-card">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Dream Analysis
                    </h1>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getAgencyColor(agencyPercentage)}`}
                      >
                        {agencyPercentage}% Agency
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        {wordCount} words
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(dream.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      User {dream?.userId}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {analysisCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() =>
                      setSelectedAnalysis(
                        selectedAnalysis === card.id ? null : card.id,
                      )
                    }
                    className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedAnalysis === card.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary ring-opacity-50 shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 ${selectedAnalysis === card.id ? "text-primary" : "text-muted-foreground"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={card.icon}
                            />
                          </svg>
                          <span
                            className={`text-sm font-medium ${selectedAnalysis === card.id ? "text-primary" : "text-foreground"}`}
                          >
                            {card.title}
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold ${selectedAnalysis === card.id ? "text-primary" : "text-primary"}`}
                        >
                          {card.count}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {card.summary}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedAnalysis && (
                <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              analysisCards.find(
                                (c) => c.id === selectedAnalysis,
                              )?.icon || ""
                            }
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-foreground">
                          {
                            analysisCards.find((c) => c.id === selectedAnalysis)
                              ?.title
                          }
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAnalysis(null)}
                        className="h-8 w-8 p-0"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {
                        analysisCards.find((c) => c.id === selectedAnalysis)
                          ?.details
                      }
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b border-border">
                  <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto overflow-x-auto">
                    <TabsTrigger
                      value="dream"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6 whitespace-nowrap"
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
                      Dream Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="insights"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6 whitespace-nowrap"
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
                  </TabsList>
                </div>

                <TabsContent value="dream" className="p-0 m-0">
                  <div className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-foreground">
                        Dream Narrative
                      </h2>
                      <div className="prose prose-invert max-w-none">
                        <div className="p-6 bg-muted/20 rounded-lg border border-border">
                          <p className="text-base sm:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                            {safeDream.dreamText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="p-0 m-0">
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <svg
                            className="w-6 h-6 text-primary"
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
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            Dream Insights
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            AI-powered interpretation of your dream
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-background/50 rounded-lg border border-border">
                          <p className="text-sm sm:text-base text-foreground leading-relaxed">
                            {safeDream.reflection.insights}
                          </p>
                        </div>

                        <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                          <h4 className="text-sm font-semibold text-accent mb-2">
                            Suggested Reflection
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {safeDream.reflection.suggested_action_hint}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Practice Section */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Recommended Practice
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Integrate insights from your dream into your daily life
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-border">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {safeDream.action.type}
                        </h3>
                        {safeDream.action.duration && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {safeDream.action.duration}
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm sm:text-base text-foreground leading-relaxed">
                          {safeDream.action.content}
                        </p>
                      </div>

                      {safeDream.action.agenticHooks &&
                        safeDream.action.agenticHooks.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground">
                              Actionable Steps:
                            </h4>
                            <div className="space-y-2">
                              {safeDream.action.agenticHooks.map(
                                (hook, index) => {
                                  const action = hookUIMap[hook as AgenticHook];

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 p-3 bg-background/30 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                                    >
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-xs font-semibold text-primary">
                                          {index + 1}
                                        </span>
                                      </div>

                                      <div className="flex-1 space-y-2">
                                        {action && (
                                          <button
                                            onClick={action.onClick}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md
                             bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
                                          >
                                            {action.icon}
                                            {action.label}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}

                      {isTodoistConnected && (
                        <Button
                          onClick={() =>
                            handleStartReflection(safeDream.action.id as string)
                          }
                          className="w-full bg-primary hover:bg-primary/90 mt-4"
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
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Start Reflection Practice
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      How to get the most out of this practice:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground">
                          Find a quiet, comfortable space where you won't be
                          disturbed
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground">
                          Set aside dedicated time (10-15 minutes works well)
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground">
                          Keep a journal nearby to capture any insights
                        </span>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground">
                          Approach with curiosity rather than expectation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
