'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Dumbbell, Trophy, Users, Target, Clock, Lock, Globe, BadgeCheck, ArrowLeft, UserPlus, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { getChallenges, getParticipants, addParticipant, GOAL_METRIC_LABELS, GOAL_METRIC_UNITS, CHALLENGE_REFERRAL_KEY } from '@/types/challenges'
import type { ChallengeParticipant } from '@/types/challenges'

export default function ChallengeDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const challengeId = params.id as string

  const challenge = useMemo(() => getChallenges().find(c => c.id === challengeId), [challengeId])
  const participants = useMemo(() => getParticipants(challengeId), [challengeId])
  const isJoined = user ? participants.some(p => p.userId === user.id) : false

  const sortedParticipants = useMemo(() =>
    [...participants].sort((a, b) => b.progress - a.progress),
    [participants]
  )

  const handleJoin = () => {
    if (!user) {
      localStorage.setItem(CHALLENGE_REFERRAL_KEY, JSON.stringify({ challengeId }))
      window.location.href = '/'
      return
    }
    if (!isJoined && challenge) {
      addParticipant({
        challengeId: challenge.id,
        userId: user.id,
        joinedAt: new Date().toISOString(),
        progress: 0,
        goalTarget: challenge.goalTarget,
        completed: false,
      })
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: challenge?.name || 'Challenge', url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-xl font-bold">Challenge Not Found</h1>
          <p className="text-sm text-muted-foreground">This challenge may have expired or been removed.</p>
          <Link href="/app"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-1" /> Back to App</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95">
        <nav className="container max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Dumbbell className="w-4 h-4" /> MuscleAtlas
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
          </div>
        </nav>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{challenge.name}</h1>
                {challenge.visibility === 'invite_only' ? (
                  <Badge variant="outline"><Lock className="w-3 h-3 mr-1" />Invite Only</Badge>
                ) : (
                  <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />Public</Badge>
                )}
                {challenge.isCurated && <Badge>Featured</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">by {challenge.creatorName || 'MuscleAtlas'}</p>
            </div>
          </div>

          {challenge.description && (
            <p className="text-muted-foreground">{challenge.description}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">{challenge.goalTarget.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{GOAL_METRIC_LABELS[challenge.goalMetric]}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">{challenge.durationDays}</p>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">{participants.length + challenge.participantCount}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleJoin}>
            <UserPlus className="w-4 h-4 mr-2" />
            {user ? (isJoined ? 'Already Joined' : 'Join Challenge') : 'Sign Up to Join'}
          </Button>

          <Separator />

          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Leaderboard
            </h2>
            {sortedParticipants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No participants yet. Be the first to join!</p>
            ) : (
              <div className="space-y-2">
                {sortedParticipants.map((p, i) => {
                  const pct = Math.min(100, Math.round((p.progress / p.goalTarget) * 100))
                  return (
                    <div key={p.userId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <span className={`w-7 text-center text-sm font-bold ${i === 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {i === 0 ? <Trophy className="w-4 h-4 mx-auto" /> : `#${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.displayName || `User ${p.userId.slice(0, 6)}`}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{p.progress.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Back to MuscleAtlas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
