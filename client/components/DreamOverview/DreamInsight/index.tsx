"use client";  

import { FC, useEffect, useState } from "react";
import {
  AgenticHook,
} from "@/shared/types/types";
import { Badge } from "@/shared/components/Ui/badge";
import { Button } from "@/shared/components/Ui/button";
import { useDreamManager } from "@/shared/hooks/useDreamManager";
import { DreamInsightParams } from "@/shared/types/types";

export const DreamInsight: FC<DreamInsightParams> = ({
  safeDream,
  dream,
  hookUIMap,
  isTodoistConnected,
  handleStartReflection,
  activeTab,
}) => {
  const [userFeedback, setUserFeedback] = useState("");

  const [practiceStatus, setPracticeStatus] = useState<
    "idle" | "completed" | "skipped"
  >("idle");

  const isCompleted = practiceStatus === "completed";
  const isSkipped = practiceStatus === "skipped";

  const { handleCompleteAction } = useDreamManager();

  useEffect(() => {
    if (isCompleted) {
      handleCompleteAction(dream._id);
    }
  }, [isCompleted]);

  return (
    <div className="flex flex-col">
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
            <div
              className={`p-4 rounded-lg border ${
                safeDream.reflection.insights
                  ? "bg-background/50 border-border"
                  : "bg-background/50 border-border animate-pulse"
              }`}
            >
              <p className="text-sm sm:text-base text-foreground leading-relaxed">
                {safeDream.reflection.insights || "No insights yet..."}
              </p>
            </div>

            <div
              className={`p-4 rounded-lg border ${
                safeDream.reflection.suggested_action_hint
                  ? "bg-accent/5 border-accent/10"
                  : "bg-accent/5 border-accent/10 animate-pulse"
              }`}
            >
              <h4 className="text-sm font-semibold text-accent mb-2">
                Suggested Reflection
              </h4>
              <p className="text-sm text-muted-foreground">
                {safeDream.reflection.suggested_action_hint ||
                  "No suggested actions yet..."}
              </p>
            </div>
          </div>
        </div>
      </div>
      {activeTab === "insights" && (
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

            <div
              className={`p-6 rounded-lg border ${
                safeDream.action && safeDream.action.type
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 border-border"
                  : "bg-gradient-to-r from-primary/10 to-accent/10 border-border animate-pulse"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {safeDream.action?.type || "No action yet..."}
                  </h3>
                  {safeDream.action?.duration && (
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
                    {safeDream.action?.content ||
                      "No action content available."}
                  </p>
                </div>

                {safeDream.action?.agenticHooks?.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Actionable Steps:
                    </h4>
                    <div className="space-y-2">
                      {safeDream.action.agenticHooks.map(
                        (hook: any, index: any) => {
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
                              <div className="flex space-y-2">
                                {action && (
                                  <button
                                    disabled={isTodoistConnected}
                                    onClick={action.onClick}
                                    className="flex px-2 py-1 gap-2 items-center text-xs font-medium rounded-md bg-primary/90 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
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
                ) : !safeDream.action ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    No actionable steps yet.
                  </div>
                ) : null}

                {isTodoistConnected && safeDream.action?.id && (
                  <div className="space-y-4 mt-4">
                    {practiceStatus === "idle" && (
                      <Button
                        onClick={() =>
                          handleStartReflection(safeDream.action.id as string)
                        }
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Start Reflection Practice
                      </Button>
                    )}

                    {safeDream.action.completed && (
                      <div className="p-4 border rounded-lg bg-emerald-500/5 border-emerald-500/20">
                        <p className="text-sm text-emerald-600 font-medium">
                          ✅ Practice completed
                        </p>
                      </div>
                    )}

                    {practiceStatus === "skipped" && (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                          Practice skipped
                        </p>
                      </div>
                    )}

                    {practiceStatus === "idle" &&
                      !safeDream.action.completed && (
                        <div className="mt-4 p-4 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Help improve your future insights — mark this
                            practice as completed or skipped.
                          </p>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`practice-${safeDream.action?.id}`}
                                className="w-5 h-5 text-emerald-500 border-border rounded-full focus:ring-emerald-400"
                                checked={isCompleted}
                                onChange={() => setPracticeStatus("completed")}
                              />
                              <span className="text-sm text-foreground">
                                ✅ Completed
                              </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`practice-${safeDream.action?.id}`}
                                className="w-5 h-5 text-red-500 border-border rounded-full focus:ring-red-400"
                                checked={isSkipped}
                                onChange={() => setPracticeStatus("skipped")}
                              />
                              <span className="text-sm text-foreground">
                                ❌ Skipped
                              </span>
                            </label>
                          </div>

                          <span className="block text-[11px] text-muted-foreground italic mt-1">
                            Your feedback helps the AI learn and adapt future
                            recommendations.
                          </span>
                        </div>
                      )}

                    {practiceStatus === "completed" && (
                      <textarea
                        value={userFeedback}
                        onChange={(e) => setUserFeedback(e.target.value)}
                        placeholder="Optional: what did you notice?"
                        className="w-full p-3 text-sm rounded-lg border bg-background"
                      />
                    )}
                  </div>
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
                    Find a quiet, comfortable space where you won't be disturbed
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
      )}
    </div>
  );
};
