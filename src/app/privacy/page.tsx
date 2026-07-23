'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function Privacy() {
  useEffect(() => { document.title = 'Privacy Policy — MuscleAtlas' }, [])

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 prose prose-sm sm:prose dark:prose-invert max-w-none">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Dumbbell className="w-4 h-4" /> MuscleAtlas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">Privacy Policy</span>
      </div>
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide when creating an account, including your email address and profile information (name, age, gender, weight, height, fitness goals). We also store your workout logs, exercise preferences, and application settings locally and on our servers when you are signed in.</p>

      <h2>How We Use Your Information</h2>
      <p>Your information is used to provide and improve our services: generate personalized workout plans, track your fitness progress, sync data across devices, and send occasional service-related communications.</p>

      <h2>Data Storage & Sync</h2>
      <p>When signed in, your data is stored on Supabase servers. You can export or delete your data at any time. When not signed in, all data is stored locally in your browser&apos;s localStorage and is not transmitted to our servers.</p>

      <h2>Third-Party Services</h2>
      <p>We use Supabase for authentication and database hosting, Google Analytics for usage analysis, OpenRouter for AI-powered workout generation, and Sentry for error monitoring. Each service has its own privacy policy governing data handling.</p>

      <h2>Your Rights</h2>
      <p>You can access, export, or delete your data at any time through the app settings. Contact us at support@muscleatlas.site for data deletion requests.</p>

      <h2>Contact</h2>
      <p>Questions about this policy? Email us at support@muscleatlas.site.</p>
    </div>
  )
}
