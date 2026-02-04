"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Ui/button";
import { Card } from "@/shared/components/Ui/card";
import { DreamJournalProps } from "@/shared/types/types";
import {
  ContentLoading,
  ContentError,
  EmptyDreams,
  EmptySearch,
} from "@/shared/components/AppStates";

export function DreamJournal({
  dreams,
  onNewDream,
  onBack,
  onSelectDream,
  isLoading,
  error,
}: DreamJournalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const filteredDreams = dreams
    .filter((dream) =>
      dream.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  if (isLoading) {
    return <ContentLoading message="Loading your dream journal..." />;
  }

  if (error) {
    return <ContentError message={error.message} onRetry={onNewDream} />;
  }

  if (!dreams.length) {
    return <EmptyDreams onNewDream={onNewDream} />;
  }

  if (!filteredDreams.length && searchTerm) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Your Dream Journal
              </h1>
              <p className="text-muted-foreground">
                {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={onNewDream}
                size="lg"
                className="cursor-pointer"
              >
                + New Dream
              </Button>
              <Button
                variant="ghost"
                onClick={onBack}
                className="cursor-pointer"
              >
                Back
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search dreams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "title")}
              className="px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <EmptySearch onClear={() => setSearchTerm("")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Your Dream Journal
            </h1>
            <p className="text-muted-foreground">
              {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={onNewDream}
              size="lg"
              className="cursor-pointer"
            >
              + New Dream
            </Button>
            <Button variant="ghost" onClick={onBack} className="cursor-pointer">
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search dreams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2 px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
            className="px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date">Sort by Date</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredDreams.map((dream) => (
            <Card
              key={dream.id}
              className="p-6 border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectDream(dream.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {dream.mood && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                        {dream.mood}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {dream.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(dream.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-muted-foreground text-2xl">→</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
