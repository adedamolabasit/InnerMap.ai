"use client"

import { useState } from "react"
import EntryScreen from "@/components/entry-screen"
import LocalRoom from "@/components/local-room"

interface Location {
  latitude: number
  longitude: number
  city: string
  country: string
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Simulate reverse geocoding to get city/country
        // In production, you'd use a real geocoding API
        const cities = [
          { lat: 40.7128, lng: -74.006, city: "New York", country: "USA" },
          { lat: 34.0522, lng: -118.2437, city: "Los Angeles", country: "USA" },
          { lat: 41.8781, lng: -87.6298, city: "Chicago", country: "USA" },
          { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" },
          { lat: 48.8566, lng: 2.3522, city: "Paris", country: "France" },
        ]

        // Find nearest city for demo
        let nearest = cities[0]
        let minDistance = Number.POSITIVE_INFINITY

        cities.forEach((c) => {
          const dist = Math.sqrt((c.lat - latitude) ** 2 + (c.lng - longitude) ** 2)
          if (dist < minDistance) {
            minDistance = dist
            nearest = c
          }
        })

        setLocation({
          latitude,
          longitude,
          city: nearest.city,
          country: nearest.country,
        })
        setLoading(false)
      },
      (err) => {
        setError("Unable to access location. Please enable location services.")
        setLoading(false)
      },
    )
  }

  if (!location) {
    return <EntryScreen onRequestLocation={handleRequestLocation} loading={loading} error={error} />
  }

  return <LocalRoom location={location} />
}
