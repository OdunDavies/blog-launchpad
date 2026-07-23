'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff } from 'lucide-react'

export default function Offline() {
  useEffect(() => { document.title = 'Offline — MuscleAtlas' }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <WifiOff className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>You&apos;re Offline</CardTitle>
          <CardDescription>
            Some features may be unavailable. Your saved workouts and plans are still accessible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Data will sync automatically when you&apos;re back online.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
