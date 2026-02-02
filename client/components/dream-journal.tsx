"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DreamJournalProps } from "@/api/types";



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
      dream.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your dream journal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to load dreams</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={onNewDream}>Try Again / Create New Dream</Button>
        </div>
      </div>
    );
  }

  if (!filteredDreams.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 border-border bg-card text-center space-y-4">
          <div className="text-4xl">◆</div>
          <h3 className="text-lg font-semibold text-foreground">No dreams yet</h3>
          <p className="text-muted-foreground">
            Start your first dream journal entry to begin exploring your inner world.
          </p>
          <Button onClick={onNewDream} className="mt-4">
            Create First Entry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Your Dream Journal</h1>
            <p className="text-muted-foreground">
              {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="default" onClick={onNewDream} size="lg" className="cursor-pointer">
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
            <option value="title">Sort by Title</option>
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
