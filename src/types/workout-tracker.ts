// Workout Tracker Types - Enhanced Version

// Weight unit preference
export type WeightUnit = 'kg' | 'lbs';

// Mood after workout
export type WorkoutMood = 'great' | 'good' | 'okay' | 'tired' | 'exhausted';

// LocalStorage keys
export const WORKOUT_LOGS_KEY = 'muscleatlas-workout-logs';
export const ACTIVE_WORKOUT_KEY = 'muscleatlas-active-workout';
export const EXERCISE_PRS_KEY = 'muscleatlas-exercise-prs';
export const WEIGHT_UNIT_KEY = 'muscleatlas-weight-unit';

// Legacy keys for migration
export const LEGACY_SESSIONS_KEY = 'muscleatlas-workout-sessions';
export const LEGACY_PRS_KEY = 'muscleatlas-personal-records';

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  weightUnit: WeightUnit;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isWarmup?: boolean;
  isPR?: boolean;
  completed?: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // ISO datetime string
  endTime?: string; // ISO datetime string
  duration?: number; // in minutes
  workoutName?: string;
  templateId?: string;
  templateDayIndex?: number;
  exercises: LoggedExercise[];
  notes?: string;
  mood?: WorkoutMood;
  source?: 'template' | 'ai-generated' | 'custom';
  sourceId?: string;
  sourceDayIndex?: number;
}

export interface ActiveWorkoutState {
  id: string;
  startTime: string;
  workoutName?: string;
  templateId?: string;
  templateDayIndex?: number;
  exercises: LoggedExercise[];
  source?: 'template' | 'ai-generated' | 'custom';
  sourceId?: string;
  sourceDayIndex?: number;
}

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  weightUnit: WeightUnit;
  reps: number;
  estimated1RM: number;
  date: string;
  workoutLogId: string;
}

export interface WorkoutStats {
  totalSessions: number;
  totalVolume: number; // total weight lifted
  totalDuration: number; // in minutes
  exerciseCount: number;
  prCount: number;
  currentStreak: number;
}

export interface ExerciseHistory {
  date: string;
  workoutLogId: string;
  sets: WorkoutSet[];
  bestSet?: {
    weight: number;
    reps: number;
    estimated1RM: number;
  };
}

// Brzycki formula for estimated 1RM
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 0 || weight === 0) return 0;
  if (reps === 1) return weight;
  if (reps > 12) return weight; // Less accurate for high reps
  return Math.round(weight * (36 / (37 - reps)));
}

// Convert weight between units
export function convertWeight(weight: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return weight;
  if (from === 'kg' && to === 'lbs') return Math.round(weight * 2.20462 * 10) / 10;
  if (from === 'lbs' && to === 'kg') return Math.round(weight / 2.20462 * 10) / 10;
  return weight;
}

// Calculate total volume for a workout log
export function calculateLogVolume(log: WorkoutLog): number {
  return log.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => {
      if (set.isWarmup) return setTotal;
      // Convert to kg for consistent volume calculation
      const weightInKg = set.weightUnit === 'lbs' 
        ? convertWeight(set.weight, 'lbs', 'kg') 
        : set.weight;
      return setTotal + (weightInKg * set.reps);
    }, 0);
  }, 0);
}

// Generate exercise ID from name (slug-based)
export function generateExerciseId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Legacy type aliases for backwards compatibility
export type ExerciseSet = WorkoutSet;
export type TrackedExercise = LoggedExercise;
export type WorkoutSession = WorkoutLog;
export type PersonalRecord = ExercisePR;

// Legacy function for backwards compatibility
export function calculateEstimated1RM(weight: number, reps: number): number {
  return calculate1RM(weight, reps);
}

export function calculateSessionVolume(session: WorkoutLog): number {
  return calculateLogVolume(session);
}
