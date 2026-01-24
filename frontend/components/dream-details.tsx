'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Dream {
  id: string
  title: string
  content: string
  date: string
  mood?: string
}

interface DreamDetailsProps {
  dream: Dream
  onBack: () => void
  onDelete: (id: string) => void
}

export function DreamDetails({ dream, onBack, onDelete }: DreamDetailsProps) {
  const analysisPoints = [
    {
      category: 'Themes',
      items: ['Journey', 'Discovery', 'Growth'],
    },
    {
      category: 'Emotions',
      items: ['Wonder', 'Curiosity', 'Determination'],
    },
    {
      category: 'Symbols',
      items: ['Path', 'Light', 'Nature'],
    },
  ]

  const wordCount = dream.content.split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Delete this dream?')) {
                onDelete(dream.id)
                onBack()
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>

        {/* Dream Content */}
        <div className="space-y-6">
          {/* Title and Meta */}
          <Card className="p-8 border-border bg-card space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">{dream.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  {new Date(dream.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {dream.mood && (
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {dream.mood}
                  </span>
                )}
                <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  {wordCount} words
                </span>
              </div>
            </div>

            {/* Dream Text */}
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {dream.content}
              </p>
            </div>
          </Card>

          {/* AI Analysis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisPoints.map((point, idx) => (
                <Card key={idx} className="p-6 border-border bg-card space-y-4">
                  <h3 className="font-semibold text-foreground text-sm">{point.category}</h3>
                  <div className="space-y-2">
                    {point.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Interpretation */}
          <Card className="p-8 border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Interpretation</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                This dream appears to center on themes of
                <span className="text-primary font-semibold"> personal exploration</span> and
                <span className="text-accent font-semibold"> growth</span>. The vivid imagery
                suggests a strong connection to your subconscious desires and aspirations.
              </p>
              <p>
                The recurring motifs in your dream work indicate that these themes are currently
                significant in your waking life. They may reflect challenges you're navigating or
                new directions you're considering.
              </p>
              <p>
                Consider how these symbolic elements relate to your current situation. What
                connections do you notice? These insights can guide your personal development
                journey.
              </p>
            </div>
          </Card>

          {/* Related Dreams */}
          <Card className="p-6 border-border bg-card space-y-4">
            <h3 className="font-semibold text-foreground">Related Themes</h3>
            <p className="text-sm text-muted-foreground">
              This dream shares similar themes and symbols with 3 other entries in your journal.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              View Related Dreams
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
