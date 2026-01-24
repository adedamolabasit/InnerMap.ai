'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DreamListResponse } from '@/api/types'

interface Dream {
  id: string
  title: string
  content: string
  date: string
  mood?: string
}

interface DreamJournalProps {
  dreams: DreamListResponse[]
  onNewDream: () => void
  onBack: () => void
  onSelectDream: (dream: DreamListResponse) => void
}

export function DreamJournal({
  dreams,
  onNewDream,
  onBack,
  onSelectDream,
}: DreamJournalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')

const filteredDreams = dreams
  .filter((dream) =>
    dream.content.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return 0
  })


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Your Dream Journal</h1>
            <p className="text-muted-foreground">
              {dreams.length} dream{dreams.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="default" onClick={onNewDream} size="lg">
              + New Dream
            </Button>
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
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
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* Dreams List */}
        {filteredDreams.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDreams.map((dream) => (
              <Card
                key={dream.id}
                className="p-6 border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectDream(dream)}
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
                      {new Date(dream.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-muted-foreground text-2xl">→</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
