"use client";

import { Button } from "@/components/ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">◆</span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            InnerMap
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm">
            About
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onGetStarted}
            className="cursor-pointer"
          >
            Get Started
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Explore Your <span className="text-primary">Inner World</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capture your dreams, uncover patterns, and gain insights into your
            subconscious with AI-powered analysis.
          </p>
        </div>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="rounded-full px-8 py-6 text-base cursor-pointer"
        >
          Start Journaling
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
          <div className="space-y-3 p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl mx-auto">
              ◊
            </div>
            <h3 className="font-semibold text-foreground">Capture Dreams</h3>
            <p className="text-sm text-muted-foreground">
              Record your dreams with voice or text for easy journaling
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg bg-card border border-border hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl mx-auto">
              ✧
            </div>
            <h3 className="font-semibold text-foreground">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent insights about themes and patterns in your dreams
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-lg bg-card border border-border hover:border-secondary/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl mx-auto">
              ◈
            </div>
            <h3 className="font-semibold text-foreground">Track Growth</h3>
            <p className="text-sm text-muted-foreground">
              View your dream history and evolving insights over time
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>Understand yourself better. One dream at a time.</p>
      </footer>
    </div>
  );
}
