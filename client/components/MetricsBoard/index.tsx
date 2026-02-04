"use client";

import { Button } from "@/shared/components/Ui/button";
import { Card } from "@/shared/components/Ui/card";

interface InsightsDashboardProps {
  onBack: () => void;
  dreamCount: number;
}

export function MetricsBoard({ onBack, dreamCount }: InsightsDashboardProps) {
  const insights = [
    {
      category: "Recurring Themes",
      items: ["Journeys", "Water", "Flying", "People"],
      color: "bg-primary/10 text-primary",
    },
    {
      category: "Common Emotions",
      items: ["Curiosity", "Wonder", "Anticipation", "Calm"],
      color: "bg-accent/10 text-accent",
    },
    {
      category: "Symbols",
      items: ["Mountains", "Doors", "Light", "Nature"],
      color: "bg-secondary/10 text-secondary",
    },
  ];

  const weeklyData = [
    { day: "Mon", dreams: 1 },
    { day: "Tue", dreams: 2 },
    { day: "Wed", dreams: 1 },
    { day: "Thu", dreams: 0 },
    { day: "Fri", dreams: 2 },
    { day: "Sat", dreams: 3 },
    { day: "Sun", dreams: 1 },
  ];

  const maxDreams = Math.max(...weeklyData.map((d) => d.dreams)) || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Dream Insights
            </h1>
            <p className="text-muted-foreground">
              Patterns and themes from your dreams
            </p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Dreams
                </p>
                <p className="text-3xl font-bold text-primary">{dreamCount}</p>
              </div>
              <div className="text-4xl text-primary/20">◆</div>
            </div>
          </Card>
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">This Week</p>
                <p className="text-3xl font-bold text-accent">
                  {weeklyData.reduce((sum, d) => sum + d.dreams, 0)}
                </p>
              </div>
              <div className="text-4xl text-accent/20">✧</div>
            </div>
          </Card>
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Avg per Week
                </p>
                <p className="text-3xl font-bold text-secondary">
                  {(dreamCount / 4).toFixed(1)}
                </p>
              </div>
              <div className="text-4xl text-secondary/20">◈</div>
            </div>
          </Card>
        </div>

        <Card className="p-6 border-border bg-card mb-8">
          <h3 className="font-semibold text-foreground mb-6">
            Dreams This Week
          </h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((data) => (
              <div
                key={data.day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-primary/20 rounded-t-lg relative group"
                  style={{
                    height: `${data.dreams > 0 ? (data.dreams / maxDreams) * 100 : 5}%`,
                    minHeight: data.dreams > 0 ? "auto" : "4px",
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-foreground bg-primary/20 px-2 py-1 rounded whitespace-nowrap">
                      {data.dreams}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, idx) => (
            <Card key={idx} className="p-6 border-border bg-card space-y-4">
              <h3 className="font-semibold text-foreground">
                {insight.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {insight.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className={`text-xs px-3 py-2 rounded-full ${insight.color}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-border bg-gradient-to-br from-primary/5 to-accent/5 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Analysis Summary
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Based on your dream journal, you show a strong connection to
              themes of
              <span className="text-primary font-semibold">
                {" "}
                exploration and growth
              </span>
              . Water and journey motifs appear frequently, suggesting a deep
              interest in
              <span className="text-accent font-semibold">
                {" "}
                personal transformation
              </span>
              .
            </p>
            <p>
              Your dreams often feature a sense of
              <span className="text-secondary font-semibold">
                {" "}
                wonder and curiosity
              </span>
              , with positive emotions dominating the landscape. This indicates
              a generally optimistic outlook and openness to new experiences.
            </p>
            <p>
              Consider exploring what specific moments or transitions in your
              waking life might be triggering these archetypal dream patterns.
              Journaling about these connections can deepen your
              self-understanding.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
