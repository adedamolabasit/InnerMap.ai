"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import PlaceCard from "./place-card"
import ChatBox from "./chat-box"

interface LocalRoomProps {
  location: {
    latitude: number
    longitude: number
    city: string
    country: string
  }
}

const MOCK_VIBE =
  "Creative energy meets cozy atmosphere. Local artists gathering, independent cafes thriving. People here value authenticity and community."

const MOCK_PLACES = [
  {
    id: 1,
    name: "The Daily Brew",
    category: "Coffee",
    distance: 0.3,
    vibe: "cozy, artistic",
  },
  {
    id: 2,
    name: "Luna Park",
    category: "Recreation",
    distance: 0.8,
    vibe: "relaxed, outdoor",
  },
  {
    id: 3,
    name: "Vinyl Records",
    category: "Shop",
    distance: 1.2,
    vibe: "vintage, eclectic",
  },
]

export default function LocalRoom({ location }: LocalRoomProps) {
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "user" | "other" }>>([
    { id: 1, text: "Hey, anyone know good spots around here?", sender: "other" },
    { id: 2, text: "The coffee shop on Main St is amazing", sender: "other" },
  ])

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text,
          sender: "user",
        },
      ])
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <h1 className="text-2xl font-light tracking-tight text-foreground">{location.city}</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {location.country} · {(Math.random() * 500 + 100).toFixed(0)} people online
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Vibe Section */}
        <section className="px-4 py-8 border-b border-border">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Local Vibe</h2>
          <p className="text-foreground leading-relaxed text-base">{MOCK_VIBE}</p>
        </section>

        {/* Places Section */}
        <section className="px-4 py-8 border-b border-border">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Nearby Places</h2>
          <div className="space-y-3">
            {MOCK_PLACES.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* Chat Section */}
        <section className="px-4 py-8">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Local Chat</h2>
          <ChatBox messages={messages} onSendMessage={handleSendMessage} />
        </section>
      </div>
    </main>
  )
}
