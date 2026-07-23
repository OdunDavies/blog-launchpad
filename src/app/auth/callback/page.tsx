'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/')
        return
      }
      if (data.session) {
        const referral = localStorage.getItem('muscleatlas-challenge-referral')
        if (referral) {
          try {
            const { challengeId } = JSON.parse(referral)
            router.push(`/challenges/${challengeId}`)
            return
          } catch {}
        }
        router.push('/app')
      } else {
        router.push('/')
      }
    }
    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
