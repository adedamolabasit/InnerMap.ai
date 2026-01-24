'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/landing-page'
import { DreamCapture } from '@/components/dream-capture'
import { DreamJournal } from '@/components/dream-journal'
import { InsightsDashboard } from '@/components/insights-dashboard'
import { DreamDetails } from '@/components/dream-details'

interface Dream {
  id: string
  title: string
  content: string
  date: string
  mood?: string
}

type View = 'landing' | 'capture' | 'journal' | 'insights' | 'details'

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('landing')
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: '1',
      title: 'The Floating City',
      content:
        "I was standing on a cloud platform looking down at a magnificent city below. The buildings were made of crystalline structures that glowed with soft light. People were walking on bridges made of light, moving between the towers. I felt a sense of wonder and possibility. I could hear music coming from somewhere, a melody I couldn\'t quite recognize but felt deeply familiar. As I watched, the city started to shift and change, revealing new pathways and connections I hadn\'t seen before. The colors shifted from blue to purple to gold. I felt safe and curious, wanting to explore every corner of this dream world.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'Peaceful',
    },
    {
      id: '2',
      title: 'The Garden Path',
      content:
        'I found myself in an overgrown garden with winding paths. Plants were everywhere, some familiar and some completely alien. The garden was wild and untamed, yet somehow perfectly balanced. As I walked deeper, I discovered small pockets of incredible beauty - flowers that seemed to glow from within, ancient trees with wise faces, streams of clear water. I felt like I was on a journey of discovery, each turn revealing something new. The further I went, the more I understood that this wasn\'t just a place, but a representation of possibilities within myself.',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'Curious',
    },
    {
      id: '3',
      title: 'Ocean of Stars',
      content:
        "Instead of water, the ocean was made of stars and cosmic light. I was swimming through this luminous sea, and each movement created ripples of color. Below me, the depths seemed infinite, filled with possibilities. Above, the sky mirrored the ocean. I wasn't afraid of the vastness - instead, I felt connected to everything. The experience of moving through this star-ocean felt like freedom, like I could go anywhere and be anything. It was both calming and exhilarating.",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      mood: 'Expansive',
    },
  ])
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null)

  const handleSaveDream = (content: string, title: string) => {
    const newDream: Dream = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
      mood: 'Neutral',
    }
    setDreams([newDream, ...dreams])
    setCurrentView('journal')
  }

  const handleSelectDream = (dream: Dream) => {
    setSelectedDream(dream)
    setCurrentView('details')
  }

  const handleDeleteDream = (id: string) => {
    setDreams(dreams.filter((d) => d.id !== id))
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('journal')} />
      case 'capture':
        return (
          <DreamCapture
            onSave={handleSaveDream}
            onBack={() => setCurrentView('journal')}
          />
        )
      case 'journal':
        return (
          <DreamJournal
            dreams={dreams}
            onNewDream={() => setCurrentView('capture')}
            onBack={() => setCurrentView('landing')}
            onSelectDream={handleSelectDream}
          />
        )
      case 'insights':
        return (
          <InsightsDashboard
            onBack={() => setCurrentView('journal')}
            dreamCount={dreams.length}
          />
        )
      case 'details':
        return selectedDream ? (
          <DreamDetails
            dream={selectedDream}
            onBack={() => setCurrentView('journal')}
            onDelete={handleDeleteDream}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {renderView()}

      {/* Floating Navigation */}
      {currentView !== 'landing' && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          {currentView === 'journal' && (
            <button
              onClick={() => setCurrentView('insights')}
              className="px-4 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Insights
            </button>
          )}
        </div>
      )}
    </main>
  )
}
