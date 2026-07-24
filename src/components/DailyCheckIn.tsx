'use client'

import { useState, useEffect } from 'react'
import { useProfile } from '@/contexts/ProfileContext'
import { Sparkles, Brain, Dumbbell, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DailyCheckIn, Mood, SoreSpot } from '@/lib/daily-plan'
import { loadTodayCheckIn, saveCheckIn, generateDailyPlan } from '@/lib/daily-plan'
import type { WorkoutDay } from '@/types/saved-plan'

type Phase = 'checkin' | 'plan'

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'exhausted', label: 'Exhausted', emoji: '😴' },
  { value: 'tired', label: 'Tired', emoji: '😮‍💨' },
  { value: 'okay', label: 'Okay', emoji: '🙂' },
  { value: 'good', label: 'Good', emoji: '💪' },
  { value: 'great', label: 'Great', emoji: '🔥' },
]

const SORE_SPOTS: { value: SoreSpot; label: string }[] = [
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'knee', label: 'Knee' },
  { value: 'lower-back', label: 'Lower Back' },
  { value: 'hip', label: 'Hip' },
  { value: 'ankle', label: 'Ankle' },
  { value: 'wrist', label: 'Wrist' },
  { value: 'neck', label: 'Neck' },
]

const RECOVERY_LABELS = ['Wrecked', 'Sore', 'Fair', 'Alright', 'Decent', 'Good', 'Rested', 'Fresh', 'Primed', 'Peak']

export default function DailyCheckIn() {
  const { profile } = useProfile()
  const [phase, setPhase] = useState<Phase>('checkin')
  const [mood, setMood] = useState<Mood>('okay')
  const [recovery, setRecovery] = useState(5)
  const [soreSpots, setSoreSpots] = useState<SoreSpot[]>([])
  const [note, setNote] = useState('')
  const [planResult, setPlanResult] = useState<{ day: WorkoutDay; reason: string } | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const checkIn = loadTodayCheckIn()
    if (checkIn) {
      setMood(checkIn.mood)
      setRecovery(checkIn.recovery)
      setSoreSpots(checkIn.soreSpots)
      setNote(checkIn.note || '')
      try {
        const saved = JSON.parse(localStorage.getItem('muscleatlas-latest-plan') || 'null')
        if (saved) {
          setPlanResult(saved)
          setPhase('plan')
        }
      } catch {}
    }
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  const toggleSoreSpot = (spot: SoreSpot) => {
    setSoreSpots(prev => prev.includes(spot) ? prev.filter(s => s !== spot) : [...prev])
  }

  const handleCheckIn = () => {
    const checkIn: DailyCheckIn = {
      date: new Date().toISOString().split('T')[0],
      mood,
      recovery,
      soreSpots,
      note: note.trim() || undefined,
    }
    saveCheckIn(checkIn)

    const result = generateDailyPlan(checkIn, {
      goal: profile.fitnessGoal,
      experience: profile.experience,
      activityLevel: profile.activityLevel,
    })
    setPlanResult(result)
    localStorage.setItem('muscleatlas-latest-plan', JSON.stringify(result))
    setPhase('plan')
  }

  const handleRedo = () => {
    setMood('okay')
    setRecovery(5)
    setSoreSpots([])
    setNote('')
    setPhase('checkin')
  }

  if (phase === 'plan' && planResult) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" /> Today's Plan
            </h2>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRedo}>
              <RefreshCw className="w-3 h-3 mr-1" /> Redo Check-In
            </Button>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Why today looks like this</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{planResult.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {planResult.day && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> {planResult.day.focus}
                </CardTitle>
                <Badge variant="outline" className="text-[11px]">{planResult.day.day}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planResult.day.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <span className="w-6 h-6 rounded-full bg-muted text-xs font-medium flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.sets} sets &times; {ex.reps} &middot; rest {ex.rest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Button className="w-full" size="lg" asChild>
          <a href="/dashboard">
            <Dumbbell className="w-4 h-4 mr-2" /> Start Workout
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold">Daily Check-In</h2>
        <p className="text-sm text-muted-foreground">How are you feeling today?</p>
      </div>

      {/* Mood */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Mood</label>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${
                mood === m.value ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-input hover:bg-accent text-muted-foreground'
              }`}
            >
              <span className="text-lg">{m.emoji}</span>
              <span className="truncate w-full text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recovery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Recovery</label>
          <span className="text-sm text-muted-foreground">{recovery}/10 &middot; {RECOVERY_LABELS[recovery] || 'Fair'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12 text-right">Low</span>
          <input
            type="range"
            min="0"
            max="10"
            value={recovery}
            onChange={e => setRecovery(parseInt(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
          />
          <span className="text-xs text-muted-foreground w-12">High</span>
        </div>
      </div>

      {/* Sore Spots */}
      <div className="space-y-3">
        <label className="text-sm font-medium">What's bothering you?</label>
        <div className="flex flex-wrap gap-2">
          {SORE_SPOTS.map(spot => {
            const active = soreSpots.includes(spot.value)
            return (
              <button
                key={spot.value}
                onClick={() => toggleSoreSpot(spot.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  active ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'border-input hover:bg-accent text-muted-foreground'
                }`}
              >
                {active && '× '}{spot.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Anything else? <span className="text-muted-foreground font-normal">(optional)</span></label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="How you slept, stress, something sore..."
          rows={2}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <Button className="w-full" size="lg" onClick={handleCheckIn}>
        <Sparkles className="w-4 h-4 mr-2" /> Get Today's Workout
      </Button>
    </div>
  )
}
