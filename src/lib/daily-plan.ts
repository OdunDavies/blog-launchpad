import { workoutTemplates } from '@/data/workoutTemplates'
import type { WorkoutDay, WorkoutExercise } from '@/types/saved-plan'
import type { WorkoutGoal, ActivityLevel } from '@/types/profile'

export type Mood = 'exhausted' | 'tired' | 'okay' | 'good' | 'great'
export type SoreSpot = 'shoulder' | 'knee' | 'lower-back' | 'hip' | 'ankle' | 'wrist' | 'neck'

export interface DailyCheckIn {
  date: string
  mood: Mood
  recovery: number
  soreSpots: SoreSpot[]
  note?: string
}

export interface ActivePlan {
  templateId: string
  templateName: string
  currentDayIndex: number
  startedAt: string
}

export interface DailyPlanResult {
  day: WorkoutDay
  reason: string
  adjustments: string[]
}

const CHECKINS_KEY = 'muscleatlas-daily-checkins'
const ACTIVE_PLAN_KEY = 'muscleatlas-active-plan'

const MOOD_INTENSITY: Record<Mood, number> = {
  exhausted: 0.5,
  tired: 0.75,
  okay: 0.9,
  good: 1.0,
  great: 1.1,
}

const SORE_SPOT_SUBSTITUTIONS: Record<string, Record<string, string>> = {
  knee: {
    'Barbell Back Squat': 'Leg Press',
    'Walking Lunges': 'Hip Thrust',
    'Bulgarian Split Squats': 'Leg Press',
    'Box Jumps': 'Step-Ups',
    'Jumping Jacks': 'Mountain Climbers',
  },
  shoulder: {
    'Barbell Overhead Press': 'Dumbbell Lateral Raises',
    'Barbell Bench Press': 'Push-Ups',
    'Incline Dumbbell Press': 'Cable Flyes',
    'Pull-Ups': 'Lat Pulldown',
    'Skull Crushers': 'Tricep Pushdown',
  },
  'lower-back': {
    'Conventional Deadlift': 'Romanian Deadlift',
    'Barbell Bent-Over Rows': 'Seated Cable Row',
    'Barbell Back Squat': 'Leg Press',
    'Good Mornings': 'Hyperextensions',
  },
  hip: {
    'Walking Lunges': 'Leg Press',
    'Bulgarian Split Squats': 'Leg Curl',
    'Step-Ups': 'Leg Press',
  },
  ankle: {
    'Walking Lunges': 'Seated Leg Curl',
    'Box Jumps': 'Step-Ups',
    'Jumping Jacks': 'Mountain Climbers',
  },
  wrist: {
    'Push-Ups': 'Cable Flyes',
    'Barbell Curl': 'Hammer Curls',
    'Barbell Bench Press': 'Dumbbell Bench Press',
    'Tricep Pushdown': 'Overhead Tricep Extension',
  },
  neck: {
    'Barbell Shrugs': 'Dumbbell Shrugs',
    'Conventional Deadlift': 'Trap Bar Deadlift',
  },
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

export function loadTodayCheckIn(): DailyCheckIn | null {
  try {
    const raw = localStorage.getItem(CHECKINS_KEY)
    if (!raw) return null
    const all: DailyCheckIn[] = JSON.parse(raw)
    return all.find(c => c.date === getTodayKey()) || null
  } catch { return null }
}

export function saveCheckIn(checkIn: DailyCheckIn): void {
  try {
    const raw = localStorage.getItem(CHECKINS_KEY)
    const all: DailyCheckIn[] = raw ? JSON.parse(raw) : []
    const idx = all.findIndex(c => c.date === checkIn.date)
    if (idx >= 0) all[idx] = checkIn
    else all.push(checkIn)
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(all))
  } catch {}
}

export function loadActivePlan(): ActivePlan | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PLAN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveActivePlan(plan: ActivePlan): void {
  localStorage.setItem(ACTIVE_PLAN_KEY, JSON.stringify(plan))
}

function pickTemplate(goal?: WorkoutGoal, experience?: string, activityLevel?: ActivityLevel): typeof workoutTemplates[0] {
  if (experience === 'beginner') {
    return workoutTemplates.find(t => t.id === 'beginner-full-body')!
  }
  if (goal === 'weight-loss') {
    return workoutTemplates.find(t => t.id === 'weight-loss')!
  }
  if (goal === 'hypertrophy' || goal === 'strength') {
    const days = activityLevel === 'very-active' || activityLevel === 'active' ? 4 : 3
    const preferred = workoutTemplates.find(t => {
      if (t.id === 'upper-lower') return days >= 4
      if (t.id === 'beginner-full-body') return days <= 3
      return false
    })
    return preferred || workoutTemplates[0]
  }
  return workoutTemplates[0]
}

function substituteExercise(
  exerciseName: string,
  soreSpots: SoreSpot[],
  allExercises: WorkoutExercise[]
): { substituted: boolean; newName: string } {
  for (const spot of soreSpots) {
    const subs = SORE_SPOT_SUBSTITUTIONS[spot]
    if (subs && subs[exerciseName]) {
      const replacement = subs[exerciseName]
      if (!allExercises.find(e => e.name === replacement)) {
        return { substituted: true, newName: replacement }
      }
    }
  }
  return { substituted: false, newName: exerciseName }
}

function parseRepsToNumber(reps: string): number {
  const match = reps.match(/\d+/)
  return match ? parseInt(match[0]) : 10
}

function repsToString(base: string, factor: number): string {
  if (factor >= 1) return base
  const nums = base.match(/\d+/g)
  if (!nums) return base
  if (nums.length === 2) {
    const low = Math.max(1, Math.round(parseInt(nums[0]) * factor))
    const high = Math.max(low + 1, Math.round(parseInt(nums[1]) * factor))
    return `${low}-${high}`
  }
  return `${Math.max(1, Math.round(parseInt(nums[0]) * factor))}`
}

export function generateDailyPlan(
  checkIn: DailyCheckIn,
  profile: { goal?: WorkoutGoal; experience?: string; activityLevel?: ActivityLevel }
): DailyPlanResult {
  let plan = loadActivePlan()
  if (!plan) {
    const template = pickTemplate(profile.goal, profile.experience, profile.activityLevel)
    plan = {
      templateId: template.id,
      templateName: template.name,
      currentDayIndex: 0,
      startedAt: new Date().toISOString(),
    }
    saveActivePlan(plan)
  }

  const template = workoutTemplates.find(t => t.id === plan!.templateId) || workoutTemplates[0]
  const baseDay = template.schedule[plan!.currentDayIndex] || template.schedule[0]

  const intensity = MOOD_INTENSITY[checkIn.mood] * (checkIn.recovery / 10)
  const clampedIntensity = Math.max(0.4, Math.min(1.1, intensity))
  const lowRecovery = checkIn.recovery < 5
  const veryLowRecovery = checkIn.recovery < 3
  const flaggedSpots = checkIn.soreSpots.length > 0

  const adjustments: string[] = []
  let reasonParts: string[] = []

  if (veryLowRecovery) {
    adjustments.push('volume halved — recovery critically low')
    reasonParts.push(`recovery's very low (${checkIn.recovery}/10)`)
  } else if (lowRecovery) {
    adjustments.push('one set dropped per exercise')
    reasonParts.push(`recovery's low (${checkIn.recovery}/10)`)
  }
  if (checkIn.mood === 'exhausted') {
    adjustments.push('intensity reduced — choose lighter weights than usual')
    reasonParts.push('you reported feeling exhausted')
  } else if (checkIn.mood === 'tired' && !lowRecovery) {
    adjustments.push('moderate pace recommended')
  }

  const substituted: string[] = []
  const adjustedExercises: WorkoutExercise[] = []

  for (const ex of baseDay.exercises) {
    const { substituted: wasSubbed, newName } = substituteExercise(ex.name, checkIn.soreSpots, adjustedExercises)
    let sets = ex.sets
    let reps = ex.reps

    if (veryLowRecovery) {
      sets = Math.max(1, Math.round(sets * 0.5))
    } else if (lowRecovery) {
      sets = Math.max(1, sets - 1)
    }
    if (clampedIntensity < 0.7) {
      reps = repsToString(reps, clampedIntensity + 0.2)
    }

    adjustedExercises.push({ name: wasSubbed ? newName : ex.name, sets, reps, rest: ex.rest })
    if (wasSubbed) substituted.push(`${ex.name} → ${newName}`)
  }

  if (substituted.length > 0) {
    adjustments.push(`exercises swapped: ${substituted.join(', ')}`)
    reasonParts.push(`you flagged ${formatSoreSpots(checkIn.soreSpots)}`)
  }

  let reason: string
  if (reasonParts.length > 0) {
    const joined = reasonParts.join(' and ')
    const tail = veryLowRecovery
      ? ' — today drops to half volume. Focus on form and mobility.'
      : lowRecovery
        ? ' — today drops a set per exercise. Prioritise quality over intensity.'
        : substituted.length > 0
          ? ' — flagged exercises swapped for joint-friendlier alternatives.'
          : ' — take it at a steady pace today.'
    reason = `${joined}${tail}`
  } else {
    if (checkIn.mood === 'great' || checkIn.mood === 'good') {
      reason = 'You\'re feeling good and recovery is solid — keep progressing as scheduled.'
    } else {
      reason = 'Everything looks steady — stick to today\'s plan.'
    }
  }

  const result: WorkoutDay = {
    day: template.schedule[plan!.currentDayIndex]?.day || 'Today',
    focus: baseDay.focus,
    exercises: adjustedExercises,
  }

  const nextDayIndex = (plan!.currentDayIndex + 1) % template.schedule.length
  saveActivePlan({ ...plan!, currentDayIndex: nextDayIndex })

  return { day: result, reason, adjustments }
}

function formatSoreSpots(spots: SoreSpot[]): string {
  const labels: Record<string, string> = {
    'lower-back': 'your lower back',
    shoulder: 'your shoulder',
    knee: 'your knee',
    hip: 'your hip',
    ankle: 'your ankle',
    wrist: 'your wrist',
    neck: 'your neck',
  }
  if (spots.length === 1) return labels[spots[0]] || spots[0]
  const last = spots[spots.length - 1]
  const rest = spots.slice(0, -1)
  return `${rest.map(s => labels[s] || s).join(', ')} and ${labels[last] || last}`
}
