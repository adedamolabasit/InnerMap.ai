"use client"

import { MapPin, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EntryScreenProps {
  onRequestLocation: () => void
  loading: boolean
  error: string | null
}

export default function EntryScreen({ onRequestLocation, loading, error }: EntryScreenProps) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Branding */}
        <div className="mb-12">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-foreground mb-2 tracking-tight">nearnow.</h1>
          <p className="text-muted-foreground text-sm">discover your local community</p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <p className="text-foreground text-base leading-relaxed">
            Find local places, read community vibes, and connect with people around you.
          </p>

          <Button
            onClick={onRequestLocation}
            disabled={loading}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Getting your location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Share Your Location
              </>
            )}
          </Button>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer text */}
        <p className="text-muted-foreground text-xs mt-8">
          We only use your location to show nearby places and communities.
        </p>
      </div>
    </main>
  )
}
