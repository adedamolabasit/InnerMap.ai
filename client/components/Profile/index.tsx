"use client";

import { FC } from "react";
import { Card } from "@/shared/components/Ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/Ui/tooltip";
import { getOrCreateVisitorId } from "@/api/config";
import { ProfileParams } from "@/shared/types/types";



export const Profile: FC<ProfileParams> = ({ safeDream, dream }) => {
  const getAgencyColor = (percentage: number) => {
    if (percentage < 30) return "text-red-500 bg-red-500/10";
    if (percentage < 60) return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  const wordCount = safeDream.dreamText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const agencyPercentage = Math.round(safeDream.intake.agency * 100);

  return (
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

                <span>User: {getOrCreateVisitorId()}</span>
              </div>

              <div className="flex w-full justify-start gap-12 items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs cursor-help">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 9V5h2v4H9zm0 2h2v4H9v-4z" />
                        </svg>
                        Guest
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      You are a guest user. Log in to retain your data across
                      browsers.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
