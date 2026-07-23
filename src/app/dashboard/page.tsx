'use client'

import { useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Dumbbell, Flame, Zap, Trophy, TrendingUp, Target, Activity, ArrowRight, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WORKOUT_LOGS_KEY, EXERCISE_PRS_KEY, calculateLogVolume } from '@/types/workout-tracker'
import type { WorkoutLog, ExercisePR, WorkoutStats } from '@/types/workout-tracker'
import { WORKOUT_GOAL_LABELS } from '@/types/profile'

function useLocalData() {
  return useMemo(() => {
    let logs: WorkoutLog[] = []
    let prs: Record<string, ExercisePR> = {}
    try {
      const logsRaw = localStorage.getItem(WORKOUT_LOGS_KEY)
      if (logsRaw) logs = JSON.parse(logsRaw)
      const prsRaw = localStorage.getItem(EXERCISE_PRS_KEY)
      if (prsRaw) prs = JSON.parse(prsRaw)
    } catch {}
    return { logs, prs }
  }, [])
}

function calcStats(logs: WorkoutLog[]): WorkoutStats {
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  const today = new Date()
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const logDate = new Date(sorted[i].date)
    const diff = Math.round((expected.getTime() - logDate.getTime()) / 86400000)
    if (Math.abs(diff) <= 1) streak++
    else break
  }
  return {
    totalSessions: logs.length,
    totalVolume: logs.reduce((s, l) => s + calculateLogVolume(l), 0),
    totalDuration: logs.reduce((s, l) => s + (l.duration || 0), 0),
    exerciseCount: [...new Set(logs.flatMap(l => l.exercises.map(e => e.exerciseId)))].length,
    prCount: Object.keys(logs.flatMap(l => l.exercises.flatMap(e => e.sets.filter(s => s.isPR)))).length,
    currentStreak: streak,
  }
}

function VolumeChart({ logs }: { logs: WorkoutLog[] }) {
  const chartData = useMemo(() => {
    const last14 = logs
      .filter(l => new Date(l.date).getTime() > Date.now() - 14 * 86400000)
      .sort((a, b) => a.date.localeCompare(b.date))
    const map = new Map<string, number>()
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() - 13 + i)
      map.set(d.toISOString().slice(0, 10), 0)
    }
    last14.forEach(l => { map.set(l.date, (map.get(l.date) || 0) + calculateLogVolume(l)) })
    return Array.from(map.entries()).map(([date, volume]) => ({ date: date.slice(5), volume }))
  }, [logs])

  const maxV = Math.max(...chartData.map(d => d.volume), 1)
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-0.5 h-32">
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
              style={{ height: `${(d.volume / maxV) * 100}%`, minHeight: d.volume > 0 ? 4 : 0 }}
              title={`${d.date}: ${Math.round(d.volume).toLocaleString()} kg`}
              role="img"
              aria-label={`${d.date}: ${Math.round(d.volume).toLocaleString()} kg volume`}
            />
            {i % 3 === 0 && <span className="text-[10px] text-muted-foreground rotate-45 origin-left">{d.date.slice(3)}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function MuscleRadar({ logs }: { logs: WorkoutLog[] }) {
  const muscleTotals = useMemo(() => {
    const groups: Record<string, number> = {}
    logs.forEach(l => l.exercises.forEach(e => {
      const m = e.exerciseName
      groups[m] = (groups[m] || 0) + e.sets.reduce((s, set) => s + (set.completed !== false ? 1 : 0), 0)
    }))
    const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 8)
    const max = Math.max(...sorted.map(s => s[1]), 1)
    return sorted.map(([name, count]) => ({ name: name.length > 12 ? name.slice(0, 12) + '...' : name, count, pct: (count / max) * 100 }))
  }, [logs])

  return (
    <div className="space-y-2">
      {muscleTotals.map(m => (
        <div key={m.name} className="flex items-center gap-2">
          <span className="text-xs w-24 truncate text-right">{m.name}</span>
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${m.pct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{m.count}</span>
        </div>
      ))}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[1,2].map(i => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}
      </div>
    </div>
  )
}

export default function Dashboard() {
  useEffect(() => { document.title = 'Dashboard — MuscleAtlas' }, [])
  const { logs, prs } = useLocalData()
  const stats = useMemo(() => calcStats(logs), [logs])
  const prList = useMemo(() => Object.values(prs).sort((a, b) => b.estimated1RM - a.estimated1RM).slice(0, 5), [prs])

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your workout analytics</p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Dumbbell className="w-4 h-4" /> Sessions</div>
            <p className="text-2xl font-bold mt-1">{stats.totalSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Flame className="w-4 h-4" /> Volume</div>
            <p className="text-2xl font-bold mt-1">{(stats.totalVolume / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">kg total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Zap className="w-4 h-4" /> Streak</div>
            <p className="text-2xl font-bold mt-1">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Trophy className="w-4 h-4" /> Exercises</div>
            <p className="text-2xl font-bold mt-1">{stats.exerciseCount}</p>
            <p className="text-xs text-muted-foreground">unique</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Volume (14 days)</CardTitle></CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Complete a workout to see your volume trend</p>
                <Link href="/app"><Button variant="link" size="sm">Start a workout <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
              </div>
            ) : <VolumeChart logs={logs} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" /> Top Exercises</CardTitle></CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Log some workouts to see your most-used exercises</p>
              </div>
            ) : <MuscleRadar logs={logs} />}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4" /> Latest Personal Records</CardTitle></CardHeader>
        <CardContent>
          {prList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No PRs yet. Push yourself in your next workout!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {prList.map(pr => (
                <div key={pr.exerciseId} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">{pr.weight}{pr.weightUnit} × {pr.reps} reps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{pr.estimated1RM}</p>
                    <p className="text-[10px] text-muted-foreground">e1RM</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/app"><Button variant="outline" className="w-full h-auto py-4 flex-col gap-1"><Dumbbell className="w-5 h-5" /><span className="text-xs">Library</span></Button></Link>
        <Link href="/app?tab=generator"><Button variant="outline" className="w-full h-auto py-4 flex-col gap-1"><Target className="w-5 h-5" /><span className="text-xs">Generate</span></Button></Link>
        <Link href="/app?tab=tracker"><Button variant="outline" className="w-full h-auto py-4 flex-col gap-1"><BarChart3 className="w-5 h-5" /><span className="text-xs">Tracker</span></Button></Link>
        <Link href="/app?tab=templates"><Button variant="outline" className="w-full h-auto py-4 flex-col gap-1"><Activity className="w-5 h-5" /><span className="text-xs">Templates</span></Button></Link>
      </div>
    </div>
  )
}
