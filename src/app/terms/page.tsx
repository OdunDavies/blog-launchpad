'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function Terms() {
  useEffect(() => { document.title = 'Terms of Service — MuscleAtlas' }, [])

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 prose prose-sm sm:prose dark:prose-invert max-w-none">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Dumbbell className="w-4 h-4" /> MuscleAtlas
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">Terms of Service</span>
      </div>
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Acceptance of Terms</h2>
      <p>By using MuscleAtlas, you agree to these terms. If you do not agree, do not use the service.</p>

      <h2>Use of Service</h2>
      <p>MuscleAtlas provides exercise information, AI-generated workout plans, and fitness tracking tools. The content is for informational purposes only and is not medical advice. Consult a healthcare professional before starting any exercise program.</p>

      <h2>Account Responsibilities</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

      <h2>Data & Privacy</h2>
      <p>Your data is handled as described in our Privacy Policy. You can export or delete your data at any time.</p>

      <h2>Limitation of Liability</h2>
      <p>MuscleAtlas is provided &quot;as is&quot; without warranty. We are not liable for injuries, damages, or losses resulting from the use of our service.</p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use after changes constitutes acceptance of the new terms.</p>

      <h2>Contact</h2>
      <p>Questions? Email us at support@muscleatlas.site.</p>
    </div>
  )
}
