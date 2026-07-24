import { supabase } from '@/integrations/supabase/client'

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

export const CHALLENGE_REFERRAL_KEY = 'muscleatlas-challenge-referral'

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001'

const CURATED_CHALLENGES: Challenge[] = [
  {
    id: '30-day-pushup',
    creatorId: SYSTEM_USER_ID,
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
    creatorId: SYSTEM_USER_ID,
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
    creatorId: SYSTEM_USER_ID,
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
    creatorId: SYSTEM_USER_ID,
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
    creatorId: SYSTEM_USER_ID,
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

function rowToChallenge(row: any): Challenge {
  return {
    id: row.id,
    creatorId: row.creator_id,
    creatorName: row.creator_name || undefined,
    name: row.name,
    description: row.description || undefined,
    goalMetric: row.goal_metric as ChallengeGoalMetric,
    goalTarget: row.goal_target,
    durationDays: row.duration_days,
    visibility: row.visibility as ChallengeVisibility,
    inviteCode: row.invite_code || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined,
    participantCount: row.participant_count || 0,
    isCurated: row.creator_id === SYSTEM_USER_ID,
  }
}

function challengeToRow(c: Challenge): any {
  return {
    id: c.id,
    creator_id: c.creatorId,
    creator_name: c.creatorName || null,
    name: c.name,
    description: c.description || null,
    goal_metric: c.goalMetric,
    goal_target: c.goalTarget,
    duration_days: c.durationDays,
    visibility: c.visibility,
    invite_code: c.inviteCode || null,
    created_at: c.createdAt,
    start_date: c.startDate || null,
    end_date: c.endDate || null,
    participant_count: c.participantCount,
  }
}

function rowToParticipant(row: any): ChallengeParticipant {
  return {
    challengeId: row.challenge_id,
    userId: row.user_id,
    displayName: row.display_name || undefined,
    joinedAt: row.joined_at || new Date().toISOString(),
    progress: row.progress || 0,
    goalTarget: row.goal_target || 0,
    completed: row.completed || false,
    completedAt: row.completed_at || undefined,
  }
}

function participantToRow(p: ChallengeParticipant): any {
  return {
    challenge_id: p.challengeId,
    user_id: p.userId,
    display_name: p.displayName || null,
    joined_at: p.joinedAt,
    progress: p.progress,
    goal_target: p.goalTarget,
    completed: p.completed,
    completed_at: p.completedAt || null,
  }
}

export function generateChallengeId(): string {
  return `ch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function generateInviteCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function getChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) {
    console.warn('[challenges] Supabase query failed, using fallback:', error?.message)
    return CURATED_CHALLENGES
  }
  const all = data.map(rowToChallenge)
  for (const curated of CURATED_CHALLENGES) {
    if (!all.find(c => c.id === curated.id)) {
      all.push(curated)
    }
  }
  return all
}

export async function saveChallenge(c: Challenge): Promise<void> {
  const { error } = await supabase
    .from('challenges')
    .upsert(challengeToRow(c))
  if (error) console.error('[challenges] Failed to save challenge:', error.message)
}

export async function getParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challengeId)
  if (error || !data) return []
  return data.map(rowToParticipant)
}

export async function addParticipant(p: ChallengeParticipant): Promise<void> {
  const { error } = await supabase
    .from('challenge_participants')
    .upsert(participantToRow(p))
  if (error) console.error('[challenges] Failed to add participant:', error.message)
}

export async function getUserParticipations(userId: string): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('user_id', userId)
  if (error || !data) return []
  return data.map(rowToParticipant)
}
