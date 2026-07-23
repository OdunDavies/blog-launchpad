'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Dumbbell, Library, Sparkles, BarChart3, LayoutTemplate, Trophy, ArrowUp, Users, Plus, Search, Lock, Globe, Check, ChevronRight, ArrowLeft, Share2, UserPlus, Target, Clock, Award, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { getChallenges, saveChallenge, getParticipants, addParticipant, getUserParticipations, generateChallengeId, generateInviteCode, GOAL_METRIC_LABELS, GOAL_METRIC_UNITS, CHALLENGE_REFERRAL_KEY } from '@/types/challenges'
import type { Challenge, ChallengeVisibility, ChallengeGoalMetric, ChallengeParticipant } from '@/types/challenges'

const TABS = [
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'generator', icon: Sparkles, label: 'AI Workout' },
  { id: 'tracker', icon: BarChart3, label: 'Tracker' },
  { id: 'challenges', icon: Trophy, label: 'Challenges' },
] as const

type ChallengeView = 'list' | 'discover' | 'create' | 'detail'

function AppPageInner() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const challengeIdParam = searchParams.get('id')

  const [activeTab, setActiveTab] = useState('library')
  const [challengeView, setChallengeView] = useState<ChallengeView>('list')
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (challengeIdParam && activeTab === 'challenges') {
      const all = getChallenges()
      const c = all.find(x => x.id === challengeIdParam)
      if (c) {
        setChallengeView('detail')
        setSelectedChallenge(c)
      }
    }
  }, [challengeIdParam, activeTab])

  useEffect(() => {
    const referral = localStorage.getItem(CHALLENGE_REFERRAL_KEY)
    if (referral && user) {
      try {
        const { challengeId } = JSON.parse(referral)
        localStorage.removeItem(CHALLENGE_REFERRAL_KEY)
        const all = getChallenges()
        const c = all.find(x => x.id === challengeId)
        if (c) {
          setActiveTab('challenges')
          setChallengeView('detail')
          setSelectedChallenge(c)
        }
      } catch {}
    }
  }, [user])

  const setCS = (view: ChallengeView, challenge?: Challenge | null) => {
    setChallengeView(view)
    if (challenge) setSelectedChallenge(challenge)
    if (view === 'list') setSelectedChallenge(null)
  }

  const userId = user?.id || `local-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-visible">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" role="banner">
        <nav className="container max-w-6xl mx-auto px-4 py-3 sm:py-4" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-foreground text-background">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight">MuscleAtlas</span>
                <p className="text-xs text-muted-foreground hidden sm:block">Navigate your fitness journey</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors" aria-label="Dashboard">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors" aria-label="Profile">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-6 sm:py-8" role="main" aria-label="Main content">
        <div className="grid grid-cols-5 gap-1 mb-6 max-w-xl mx-auto">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const isAI = tab.id === 'generator'
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id !== 'challenges') setCS('list') }}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors touch-target ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isAI
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 bg-red-50/50 dark:bg-red-950/10'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                role="tab"
                aria-selected={isActive}
              >
                <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isAI && !isActive ? 'text-red-500' : ''}`} />
                <span className="truncate w-full text-center leading-tight">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {activeTab === 'library' && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Exercise Library</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Browse our collection of exercises with video demonstrations and muscle targeting info.</p>
            <Link href="/exercises"><Button>View Exercise Library</Button></Link>
          </section>
        )}

        {activeTab === 'templates' && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Workout Templates</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Pre-made workout routines to get you started quickly.</p>
            <Link href="/about"><Button>Learn More</Button></Link>
          </section>
        )}

        {activeTab === 'generator' && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">AI Workout Generator</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Get a personalized workout split based on your goals and target muscles.</p>
            <Link href="/about"><Button>Try Generator</Button></Link>
          </section>
        )}

        {activeTab === 'tracker' && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Workout Tracker</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">Log your workouts, track your progress, and celebrate your personal records.</p>
            <Link href="/dashboard"><Button>View Dashboard</Button></Link>
          </section>
        )}

        {activeTab === 'challenges' && (
          <section>
            {challengeView === 'list' && (
              <ChallengesList
                userId={userId}
                user={!!user}
                onDiscover={() => setCS('discover')}
                onCreate={() => setCS('create')}
                onSelect={(c) => setCS('detail', c)}
              />
            )}
            {challengeView === 'discover' && (
              <DiscoverChallenges
                userId={userId}
                user={!!user}
                onBack={() => setCS('list')}
                onSelect={(c) => setCS('detail', c)}
              />
            )}
            {challengeView === 'create' && (
              <CreateChallenge
                userId={userId}
                user={!!user}
                onBack={() => setCS('list')}
                onCreated={(c) => setCS('detail', c)}
              />
            )}
            {challengeView === 'detail' && selectedChallenge && (
              <ChallengeDetail
                challenge={selectedChallenge}
                userId={userId}
                user={!!user}
                onBack={() => setCS('list')}
              />
            )}
          </section>
        )}
      </main>

      <footer className="border-t mt-auto bg-muted/30" role="contentinfo">
        <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-foreground text-background">
                <Dumbbell className="w-3 h-3" aria-hidden="true" />
              </div>
              <span className="font-semibold text-sm sm:text-base">MuscleAtlas</span>
              <span className="text-xs sm:text-sm text-muted-foreground">&copy; {new Date().getFullYear()}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="gap-1" aria-label="Scroll to top">
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              Top
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AppPageInner />
    </Suspense>
  )
}

function ChallengesList({ userId, user, onDiscover, onCreate, onSelect }: {
  userId: string; user: boolean; onDiscover: () => void; onCreate: () => void; onSelect: (c: Challenge) => void
}) {
  const participations = useMemo(() => getUserParticipations(userId), [userId])
  const allChallenges = useMemo(() => getChallenges(), [])
  const myChallengeIds = new Set(participations.map(p => p.challengeId))
  const myChallenges = allChallenges.filter(c => myChallengeIds.has(c.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">My Challenges</h2>
          <p className="text-sm text-muted-foreground">{myChallenges.length} active {myChallenges.length === 1 ? 'challenge' : 'challenges'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDiscover}>
            <Search className="w-4 h-4 mr-1" /> Discover
          </Button>
          {user && (
            <Button size="sm" onClick={onCreate}>
              <Plus className="w-4 h-4 mr-1" /> Create
            </Button>
          )}
        </div>
      </div>

      {myChallenges.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <div>
            <p className="font-medium">No challenges yet</p>
            <p className="text-sm text-muted-foreground">Join a public challenge or create your own</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onDiscover}>
              <Search className="w-4 h-4 mr-1" /> Discover
            </Button>
            {user && (
              <Button onClick={onCreate}>
                <Plus className="w-4 h-4 mr-1" /> Create
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {myChallenges.map(c => {
            const p = participations.find(x => x.challengeId === c.id)
            const progressPct = p ? Math.min(100, Math.round((p.progress / p.goalTarget) * 100)) : 0
            return (
              <button key={c.id} onClick={() => onSelect(c)} className="text-left">
                <Card className="card-hover cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-sm leading-tight">{c.name}</span>
                      </div>
                      {c.visibility === 'invite_only' && <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span>{c.goalTarget.toLocaleString()} {GOAL_METRIC_UNITS[c.goalMetric]}</span>
                      <span>&middot;</span>
                      <span>{c.durationDays} days</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{progressPct}% complete</p>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DiscoverChallenges({ userId, user, onBack, onSelect }: {
  userId: string; user: boolean; onBack: () => void; onSelect: (c: Challenge) => void
}) {
  const allChallenges = useMemo(() => getChallenges().filter(c => c.visibility === 'public'), [])
  const participations = useMemo(() => getUserParticipations(userId), [userId])
  const joinedIds = new Set(participations.map(p => p.challengeId))

  const handleJoin = (c: Challenge) => {
    if (!user) {
      localStorage.setItem(CHALLENGE_REFERRAL_KEY, JSON.stringify({ challengeId: c.id }))
      window.location.href = '/'
      return
    }
    if (!joinedIds.has(c.id)) {
      addParticipant({
        challengeId: c.id,
        userId,
        joinedAt: new Date().toISOString(),
        progress: 0,
        goalTarget: c.goalTarget,
        completed: false,
      })
    }
    onSelect(c)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h2 className="text-xl font-bold">Discover</h2>
          <p className="text-sm text-muted-foreground">Public challenges you can join</p>
        </div>
      </div>

      {allChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground/40 mb-2" />
          <p className="font-medium">No public challenges yet</p>
          <p className="text-sm text-muted-foreground">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {allChallenges.map(c => {
            const isJoined = joinedIds.has(c.id)
            const participants = getParticipants(c.id)
            return (
              <Card key={c.id} className={isJoined ? 'border-primary/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-sm truncate">{c.name}</span>
                      </div>
                      {c.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>}
                    </div>
                    {c.isCurated && <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">Featured</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                    <span>{c.goalTarget.toLocaleString()} {GOAL_METRIC_UNITS[c.goalMetric]}</span>
                    <span>&middot;</span>
                    <span>{c.durationDays} days</span>
                    <span>&middot;</span>
                    <span>{participants.length + c.participantCount} joined</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isJoined ? 'outline' : 'default'}
                      className="flex-1"
                      onClick={() => isJoined ? onSelect(c) : handleJoin(c)}
                    >
                      {isJoined ? <Check className="w-3 h-3 mr-1" /> : <UserPlus className="w-3 h-3 mr-1" />}
                      {isJoined ? 'Joined' : (user ? 'Join' : 'Join — Sign Up')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onSelect(c)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CreateChallenge({ userId, user, onBack, onCreated }: {
  userId: string; user: boolean; onBack: () => void; onCreated: (c: Challenge) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goalMetric, setGoalMetric] = useState<ChallengeGoalMetric>('reps')
  const [goalTarget, setGoalTarget] = useState('')
  const [durationDays, setDurationDays] = useState('30')
  const [visibility, setVisibility] = useState<ChallengeVisibility>('invite_only')

  if (!user) {
    return (
      <div className="text-center py-12 space-y-4">
        <Lock className="w-12 h-12 mx-auto text-muted-foreground/40" />
        <p className="font-medium">Sign in to create a challenge</p>
        <p className="text-sm text-muted-foreground">You need an account to create challenges</p>
        <Button onClick={() => window.location.href = '/'}>Sign In</Button>
      </div>
    )
  }

  const handleCreate = () => {
    if (!name.trim() || !goalTarget) return
    const c: Challenge = {
      id: generateChallengeId(),
      creatorId: userId,
      name: name.trim(),
      description: description.trim() || undefined,
      goalMetric,
      goalTarget: parseInt(goalTarget) || 0,
      durationDays: parseInt(durationDays) || 30,
      visibility,
      inviteCode: visibility === 'invite_only' ? generateInviteCode() : undefined,
      createdAt: new Date().toISOString(),
      participantCount: 1,
    }
    saveChallenge(c)
    addParticipant({
      challengeId: c.id,
      userId,
      joinedAt: new Date().toISOString(),
      progress: 0,
      goalTarget: c.goalTarget,
      completed: false,
    })
    onCreated(c)
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h2 className="text-xl font-bold">Create Challenge</h2>
          <p className="text-sm text-muted-foreground">Set a goal and invite others to join</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Challenge Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 30-Day Push-Up Challenge" />
        </div>
        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your challenge" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Goal Metric</Label>
            <Select value={goalMetric} onValueChange={v => setGoalMetric(v as ChallengeGoalMetric)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_METRIC_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Goal Target ({GOAL_METRIC_UNITS[goalMetric]})</Label>
            <Input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} placeholder="1000" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duration (days)</Label>
          <Input type="number" value={durationDays} onChange={e => setDurationDays(e.target.value)} placeholder="30" />
        </div>
        <div className="space-y-2">
          <Label>Visibility</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setVisibility('invite_only')}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                visibility === 'invite_only' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
              }`}
            >
              <Lock className="w-4 h-4" />
              <div className="text-left">
                <span className="font-medium">Invite Only</span>
                <p className="text-[11px] text-muted-foreground">Private link only</p>
              </div>
            </button>
            <button
              onClick={() => setVisibility('public')}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                visibility === 'public' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
              }`}
            >
              <Globe className="w-4 h-4" />
              <div className="text-left">
                <span className="font-medium">Public</span>
                <p className="text-[11px] text-muted-foreground">Anyone can find & join</p>
              </div>
            </button>
          </div>
        </div>
        <Button className="w-full" onClick={handleCreate} disabled={!name.trim() || !goalTarget}>
          <Plus className="w-4 h-4 mr-1" /> Create Challenge
        </Button>
      </div>
    </div>
  )
}

function ChallengeDetail({ challenge, userId, user, onBack }: {
  challenge: Challenge; userId: string; user: boolean; onBack: () => void
}) {
  const participations = useMemo(() => getUserParticipations(userId), [userId])
  const allParticipants = useMemo(() => getParticipants(challenge.id), [challenge.id])
  const isJoined = participations.some(p => p.challengeId === challenge.id)
  const myParticipation = participations.find(p => p.challengeId === challenge.id)
  const isCreator = challenge.creatorId === userId || challenge.creatorId === 'muscleatlas'

  const handleJoin = () => {
    if (!user) {
      localStorage.setItem(CHALLENGE_REFERRAL_KEY, JSON.stringify({ challengeId: challenge.id }))
      window.location.href = '/'
      return
    }
    if (!isJoined) {
      addParticipant({
        challengeId: challenge.id,
        userId,
        joinedAt: new Date().toISOString(),
        progress: 0,
        goalTarget: challenge.goalTarget,
        completed: false,
      })
    }
  }

  const sortedParticipants = useMemo(() =>
    [...allParticipants].sort((a, b) => b.progress - a.progress),
    [allParticipants]
  )

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = `${baseUrl}/challenges/${challenge.id}${challenge.inviteCode ? `?code=${challenge.inviteCode}` : ''}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: challenge.name, url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }

  const progressPct = myParticipation
    ? Math.min(100, Math.round((myParticipation.progress / myParticipation.goalTarget) * 100))
    : 0

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{challenge.name}</h2>
            {challenge.visibility === 'invite_only' ? (
              <Badge variant="outline" className="text-[10px] shrink-0"><Lock className="w-3 h-3 mr-1" />Invite Only</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] shrink-0"><Globe className="w-3 h-3 mr-1" />Public</Badge>
            )}
            {challenge.isCurated && <Badge className="text-[10px] shrink-0">Featured</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">by {challenge.creatorName || 'MuscleAtlas'}</p>
        </div>
      </div>

      {challenge.description && (
        <p className="text-sm text-muted-foreground">{challenge.description}</p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{challenge.goalTarget.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{GOAL_METRIC_LABELS[challenge.goalMetric]}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{challenge.durationDays}</p>
          <p className="text-[11px] text-muted-foreground">Days</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{allParticipants.length + challenge.participantCount}</p>
          <p className="text-[11px] text-muted-foreground">Participants</p>
        </div>
      </div>

      {!isJoined && (
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleJoin}>
            <UserPlus className="w-4 h-4 mr-1" /> {user ? 'Join Challenge' : 'Sign Up to Join'}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {isJoined && myParticipation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4" /> Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{myParticipation.progress.toLocaleString()} / {myParticipation.goalTarget.toLocaleString()} {GOAL_METRIC_UNITS[challenge.goalMetric]}</span>
              <span className="text-sm font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
              {challenge.visibility === 'invite_only' && challenge.inviteCode && (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                  <ExternalLink className="w-4 h-4 mr-1" /> Invite Link
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Leaderboard
        </h3>
        {sortedParticipants.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No participants yet. Be the first to join!</p>
        ) : (
          <div className="space-y-2">
            {sortedParticipants.map((p, i) => {
              const pct = Math.min(100, Math.round((p.progress / p.goalTarget) * 100))
              return (
                <div key={p.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <span className={`w-6 text-center text-sm font-bold ${i === 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
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
                  {p.userId === userId && <Badge variant="secondary" className="text-[10px]">You</Badge>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
