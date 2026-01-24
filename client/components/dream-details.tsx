'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Dream {
  _id: string
  userId: string
  dreamText: string
  intake: {
    symbols: string[]
    characters: string[]
    emotions: string[]
    actions: string[]
    repeated_elements: string[]
    agency: number
  }
  reflection: {
    themes: string[]
    insights: string
    suggested_action_hint: string
  }
  action: {
    type: string
    content: string
    duration?: string
    agenticHooks: string[]
  }
  createdAt: string
}

interface DreamDetailsProps {
  dream: Dream
  onBack: () => void
  // onDelete: (id: string) => void
}

export function DreamDetails({ dream, onBack}: DreamDetailsProps) {
  const [activeTab, setActiveTab] = useState('dream')
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>('symbols')

  const wordCount = dream.dreamText.split(/\s+/).filter(Boolean).length
  const agencyPercentage = Math.round(dream.intake.agency * 100)

  const getAgencyColor = (percentage: number) => {
    if (percentage < 30) return 'text-red-500 bg-red-500/10'
    if (percentage < 60) return 'text-yellow-500 bg-yellow-500/10'
    return 'text-green-500 bg-green-500/10'
  }

  // Analysis cards data
  const analysisCards = [
    {
      id: 'symbols',
      title: 'Symbols',
      count: dream.intake.symbols.length,
      icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
      summary: 'Key symbols and imagery from your dream',
      details: (
        <>
          <div className="flex flex-wrap gap-2">
            {dream.intake.symbols.map((symbol, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {symbol}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Symbols represent significant objects, places, or concepts in your dream. 
            They often carry metaphorical meaning related to your subconscious thoughts.
          </p>
        </>
      )
    },
    {
      id: 'characters',
      title: 'Characters',
      count: dream.intake.characters.length,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197v-1a6 6 0 00-9-5.197M9 21v-1a6 6 0 0112 0v1z',
      summary: 'People and entities in your dream',
      details: (
        <>
          <div className="space-y-2">
            {dream.intake.characters.map((character, index) => (
              <div key={index} className="flex items-center gap-2 text-sm p-2 hover:bg-muted/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">{character}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Characters in dreams often represent aspects of yourself or significant people in your life. 
            They can symbolize different emotions, traits, or relationships.
          </p>
        </>
      )
    },
    {
      id: 'emotions',
      title: 'Emotions',
      count: dream.intake.emotions.length,
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      summary: 'Emotional tones experienced',
      details: (
        <>
          <div className="flex flex-wrap gap-2">
            {dream.intake.emotions.map((emotion, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-secondary/20 text-secondary-foreground border-secondary/30 text-sm"
              >
                {emotion}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Emotions in dreams reflect your subconscious feelings about situations in your waking life. 
            Strong or recurring emotions often point to areas needing attention.
          </p>
        </>
      )
    },
    {
      id: 'themes',
      title: 'Themes',
      count: dream.reflection.themes.length,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      summary: 'Major themes identified',
      details: (
        <>
          <div className="space-y-3">
            {dream.reflection.themes.map((theme, index) => (
              <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm font-medium text-foreground">{theme}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Themes represent the core patterns and messages in your dream. 
            They provide insight into recurring issues or significant life themes.
          </p>
        </>
      )
    },
    {
      id: 'actions',
      title: 'Actions',
      count: dream.intake.actions.length,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      summary: 'Notable actions and behaviors',
      details: (
        <>
          <div className="space-y-3">
            {dream.intake.actions.map((action, index) => (
              <div key={index} className="text-sm text-foreground pl-4 border-l-2 border-primary/30 py-2">
                {action}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Actions in dreams reveal how you're responding to situations and your level of agency. 
            They can indicate active or passive approaches to life challenges.
          </p>
        </>
      )
    },
    {
      id: 'repetitions',
      title: 'Repeated Elements',
      count: dream.intake.repeated_elements.length,
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      summary: 'Patterns and recurring elements',
      details: (
        <>
          <div className="space-y-3">
            {dream.intake.repeated_elements.map((element, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-foreground">{element}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Recurring
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Repeated elements highlight patterns that are particularly significant in your subconscious. 
            These often point to unresolved issues or deeply ingrained habits.
          </p>
        </>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dreams
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this dream?')) {
                // onDelete(dream._id)
                onBack()
              }
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Analysis Cards */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Dream Info Card */}
              <Card className="p-6 border-border bg-card">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Dream Analysis</h1>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${getAgencyColor(agencyPercentage)}`}>
                        {agencyPercentage}% Agency
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                        {wordCount} words
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(dream.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      User {dream.userId}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Analysis Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                {analysisCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedAnalysis(selectedAnalysis === card.id ? null : card.id)}
                    className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedAnalysis === card.id 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary ring-opacity-50 shadow-md' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg 
                            className={`w-4 h-4 ${selectedAnalysis === card.id ? 'text-primary' : 'text-muted-foreground'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                          </svg>
                          <span className={`text-sm font-medium ${selectedAnalysis === card.id ? 'text-primary' : 'text-foreground'}`}>
                            {card.title}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${selectedAnalysis === card.id ? 'text-primary' : 'text-primary'}`}>
                          {card.count}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">{card.summary}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Analysis Details Panel */}
              {selectedAnalysis && (
                <Card className="border-primary/30 bg-primary/5 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            analysisCards.find(c => c.id === selectedAnalysis)?.icon || ''
                          } />
                        </svg>
                        <h3 className="text-lg font-semibold text-foreground">
                          {analysisCards.find(c => c.id === selectedAnalysis)?.title}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAnalysis(null)}
                        className="h-8 w-8 p-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {analysisCards.find(c => c.id === selectedAnalysis)?.details}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Main Content Tabs */}
          <div className="lg:col-span-2">
            <Card className=" border-border bg-card overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mx-2">
                <div className="border-b border-border">
                  <TabsList className="w-4/5 justify-center rounded-none bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="dream" 
                      className="rounded-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      Dream Text
                    </TabsTrigger>
                    <TabsTrigger 
                      value="insights" 
                      className="rounded-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Insights
                    </TabsTrigger>
                    <TabsTrigger 
                      value="practice" 
                      className="rounded-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Practice
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Dream Text Tab */}
                <TabsContent value="dream" className="p-0 m-0">
                  <div className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-foreground">Dream Narrative</h2>
                      <div className="prose prose-invert max-w-none">
                        <div className="p-6 bg-muted/20 rounded-lg border border-border">
                          <p className="text-base sm:text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                            {dream.dreamText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Insights Tab */}
                <TabsContent value="insights" className="p-0 m-0">
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Dream Insights</h2>
                          <p className="text-sm text-muted-foreground">AI-powered interpretation of your dream</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-background/50 rounded-lg border border-border">
                          <p className="text-sm sm:text-base text-foreground leading-relaxed">
                            {dream.reflection.insights}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                          <h4 className="text-sm font-semibold text-accent mb-2">Suggested Reflection</h4>
                          <p className="text-sm text-muted-foreground">
                            {dream.reflection.suggested_action_hint}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Practice Tab */}
                <TabsContent value="practice" className="p-0 m-0">
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Recommended Practice</h2>
                          <p className="text-sm text-muted-foreground">Integrate insights from your dream</p>
                        </div>
                      </div>

                      <Card className="p-6 border-border bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{dream.action.type}</h3>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {dream.action.duration}
                            </Badge>
                          </div>
                          
                          <div className="p-4 bg-background/50 rounded-lg">
                            <p className="text-sm sm:text-base text-foreground leading-relaxed">
                              {dream.action.content}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground">How to get started:</h4>
                            <ol className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">1</span>
                                <span>Find a quiet space where you won't be disturbed</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">2</span>
                                <span>Set a timer for {dream.action.duration}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">3</span>
                                <span>Reflect on the key themes from your dream</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">4</span>
                                <span>Consider how these insights relate to your waking life</span>
                              </li>
                            </ol>
                          </div>

                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Start Reflection Practice
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}