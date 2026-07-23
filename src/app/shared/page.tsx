'use client'

import { Suspense } from 'react'
import SharedWorkoutContent from './[id]/page'

export default function SharedLegacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <SharedWorkoutContent />
    </Suspense>
  )
}
