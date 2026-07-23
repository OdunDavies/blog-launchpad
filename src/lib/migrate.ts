import { pushAll, pullAll } from '@/lib/sync'
import type { UserProfile } from '@/types/profile'
import type { WorkoutLog, ExercisePR, WeightUnit } from '@/types/workout-tracker'
import type { WorkoutTemplate } from '@/data/workoutTemplates'
import type { SavedPlan } from '@/types/saved-plan'

export type MigrationResult = {
  migrated: boolean
  message: string
}

const KEYS = [
  'muscleatlas-profile',
  'muscleatlas-weight-unit',
  'muscleatlas-workout-logs',
  'muscleatlas-exercise-prs',
  'musclepedia-favorites',
  'musclepedia-custom-templates',
  'workout-planner-saved-plans',
] as const

export function hasLocalData(): boolean {
  return KEYS.some(key => {
    try {
      const val = localStorage.getItem(key)
      if (!val) return false
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parsed.length > 0
      if (typeof parsed === 'object' && parsed !== null) return Object.keys(parsed).length > 0
      return true
    } catch {
      return false
    }
  })
}

export async function migrateLocalToCloud(userId: string): Promise<MigrationResult> {
  try {
    const cloudData = await pullAll(userId)
    const hasCloudData =
      cloudData.profile ||
      cloudData.weightUnit ||
      cloudData.workoutLogs.length > 0 ||
      Object.keys(cloudData.exercisePRs).length > 0 ||
      cloudData.favorites.length > 0 ||
      cloudData.customTemplates.length > 0 ||
      cloudData.savedPlans.length > 0

    if (hasCloudData) {
      return { migrated: false, message: 'Cloud data already exists. No migration needed.' }
    }

    const profileRaw = localStorage.getItem('muscleatlas-profile')
    const weightUnitRaw = localStorage.getItem('muscleatlas-weight-unit')
    const logsRaw = localStorage.getItem('muscleatlas-workout-logs')
    const prsRaw = localStorage.getItem('muscleatlas-exercise-prs')
    const favsRaw = localStorage.getItem('musclepedia-favorites')
    const templatesRaw = localStorage.getItem('musclepedia-custom-templates')
    const plansRaw = localStorage.getItem('workout-planner-saved-plans')

    await pushAll(userId, {
      profile: profileRaw ? (JSON.parse(profileRaw) as UserProfile) : null,
      weightUnit: (weightUnitRaw?.replace(/"/g, '') as WeightUnit) || null,
      workoutLogs: logsRaw ? (JSON.parse(logsRaw) as WorkoutLog[]) : [],
      exercisePRs: prsRaw ? (JSON.parse(prsRaw) as Record<string, ExercisePR>) : {},
      favorites: favsRaw ? (JSON.parse(favsRaw) as string[]) : [],
      customTemplates: templatesRaw ? (JSON.parse(templatesRaw) as WorkoutTemplate[]) : [],
      savedPlans: plansRaw ? (JSON.parse(plansRaw) as SavedPlan[]) : [],
    })

    return { migrated: true, message: 'Local data migrated to cloud successfully.' }
  } catch (err) {
    console.error('Migration failed:', err)
    return { migrated: false, message: 'Migration failed. Please try again.' }
  }
}

function safeParse<T>(json: string): T | null {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}
