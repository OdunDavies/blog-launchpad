export type ChallengeVisibility = 'public' | 'invite_only'
export type ChallengeGoalMetric = 'reps' | 'weight' | 'streak_days' | 'sessions' | 'distance' | 'other'

export interface Challenge {
  id: string
  creatorId: string
  creatorName?: string
  name: string
  description?: string
  goalMetric: ChallengeGoalMetric
  goalTarget: number
  durationDays: number
  visibility: ChallengeVisibility
  inviteCode?: string
  createdAt: string
  startDate?: string
  endDate?: string
  participantCount: number
  isCurated?: boolean
}

export interface ChallengeParticipant {
  challengeId: string
  userId: string
  displayName?: string
  joinedAt: string
  progress: number
  goalTarget: number
  completed: boolean
  completedAt?: string
}

export const GOAL_METRIC_LABELS: Record<ChallengeGoalMetric, string> = {
  reps: 'Total Reps',
  weight: 'Weight Lifted',
  streak_days: 'Streak Days',
  sessions: 'Workout Sessions',
  distance: 'Distance',
  other: 'Custom',
}

export const GOAL_METRIC_UNITS: Record<ChallengeGoalMetric, string> = {
  reps: 'reps',
  weight: 'kg',
  streak_days: 'days',
  sessions: 'sessions',
  distance: 'km',
  other: '',
}

export const CHALLENGES_KEY = 'muscleatlas-challenges'
export const CHALLENGE_PARTICIPANTS_KEY = 'muscleatlas-challenge-participants'
export const CHALLENGE_REFERRAL_KEY = 'muscleatlas-challenge-referral'

export const CURATED_CHALLENGES: Challenge[] = [
  {
    id: '30-day-pushup',
    creatorId: 'muscleatlas',
    creatorName: 'MuscleAtlas',
    name: '30-Day Push-Up Challenge',
    description: 'Complete 3,000 push-ups in 30 days. Build chest, shoulder, and tricep endurance with this classic bodyweight challenge.',
    goalMetric: 'reps',
    goalTarget: 3000,
    durationDays: 30,
    visibility: 'public',
    createdAt: '2024-01-01T00:00:00Z',
    participantCount: 0,
    isCurated: true,
  },
  {
    id: 'squat-streak',
    creatorId: 'muscleatlas',
    creatorName: 'MuscleAtlas',
    name: '14-Day Squat Streak',
    description: 'Squat every day for 14 days. Build leg strength and consistency with daily squat sessions.',
    goalMetric: 'streak_days',
    goalTarget: 14,
    durationDays: 14,
    visibility: 'public',
    createdAt: '2024-01-01T00:00:00Z',
    participantCount: 0,
    isCurated: true,
  },
  {
    id: 'plank-progress',
    creatorId: 'muscleatlas',
    creatorName: 'MuscleAtlas',
    name: '21-Day Plank Progress',
    description: 'Hold plank for a cumulative 60 minutes over 21 days. Strengthen your core and improve stability.',
    goalMetric: 'reps',
    goalTarget: 60,
    durationDays: 21,
    visibility: 'public',
    createdAt: '2024-01-01T00:00:00Z',
    participantCount: 0,
    isCurated: true,
  },
  {
    id: 'deadlift-milestone',
    creatorId: 'muscleatlas',
    creatorName: 'MuscleAtlas',
    name: '28-Day Deadlift Builder',
    description: 'Accumulate 50,000 kg in deadlift volume over 28 days. Build posterior chain strength and track your progress.',
    goalMetric: 'weight',
    goalTarget: 50000,
    durationDays: 28,
    visibility: 'public',
    createdAt: '2024-01-01T00:00:00Z',
    participantCount: 0,
    isCurated: true,
  },
  {
    id: 'weekly-warrior',
    creatorId: 'muscleatlas',
    creatorName: 'MuscleAtlas',
    name: 'Weekly Warrior (4 Sessions)',
    description: 'Complete 4 workout sessions per week for 4 weeks. Build the habit of consistent training.',
    goalMetric: 'sessions',
    goalTarget: 16,
    durationDays: 28,
    visibility: 'public',
    createdAt: '2024-01-01T00:00:00Z',
    participantCount: 0,
    isCurated: true,
  },
]

export function generateChallengeId(): string {
  return `ch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function getChallenges(): Challenge[] {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY)
    const userChallenges: Challenge[] = raw ? JSON.parse(raw) : []
    const all = [...CURATED_CHALLENGES]
    for (const uc of userChallenges) {
      const existing = all.findIndex(c => c.id === uc.id)
      if (existing >= 0) {
        all[existing] = uc
      } else {
        all.push(uc)
      }
    }
    return all
  } catch {
    return CURATED_CHALLENGES
  }
}

export function saveChallenge(c: Challenge): void {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY)
    const list: Challenge[] = raw ? JSON.parse(raw) : []
    const idx = list.findIndex(x => x.id === c.id)
    if (idx >= 0) list[idx] = c
    else list.push(c)
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(list))
  } catch {}
}

export function getParticipants(challengeId: string): ChallengeParticipant[] {
  try {
    const raw = localStorage.getItem(CHALLENGE_PARTICIPANTS_KEY)
    const all: ChallengeParticipant[] = raw ? JSON.parse(raw) : []
    return all.filter(p => p.challengeId === challengeId)
  } catch { return [] }
}

export function addParticipant(p: ChallengeParticipant): void {
  try {
    const raw = localStorage.getItem(CHALLENGE_PARTICIPANTS_KEY)
    const list: ChallengeParticipant[] = raw ? JSON.parse(raw) : []
    const idx = list.findIndex(x => x.challengeId === p.challengeId && x.userId === p.userId)
    if (idx >= 0) list[idx] = p
    else list.push(p)
    localStorage.setItem(CHALLENGE_PARTICIPANTS_KEY, JSON.stringify(list))
  } catch {}
}

export function getUserParticipations(userId: string): ChallengeParticipant[] {
  try {
    const raw = localStorage.getItem(CHALLENGE_PARTICIPANTS_KEY)
    const all: ChallengeParticipant[] = raw ? JSON.parse(raw) : []
    return all.filter(p => p.userId === userId)
  } catch { return [] }
}
