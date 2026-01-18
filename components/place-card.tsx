"use client"

import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PlaceCardProps {
  place: {
    id: number
    name: string
    category: string
    distance: number
    vibe: string
  }
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Card className="bg-card border-border hover:border-accent/50 transition-colors p-4 cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-foreground">{place.name}</h3>
          <p className="text-xs text-muted-foreground">{place.category}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {place.distance} km
        </div>
      </div>
      <p className="text-sm text-accent/80">{place.vibe}</p>
    </Card>
  )
}
