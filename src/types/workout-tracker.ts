// Workout Tracker Types

export interface ExerciseSet {
  setNumber: number;
  weight: number; // in kg
  reps: number;
  isWarmup?: boolean;
  isPR?: boolean;
}

export interface TrackedExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime?: string; // ISO datetime string
  duration?: number; // in minutes
  exercises: TrackedExercise[];
  notes?: string;
  source?: 'template' | 'ai-generated' | 'custom';
  sourceId?: string;
  sourceDayIndex?: number;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number; // Brzycki formula
  date: string;
  sessionId: string;
}

export interface WorkoutStats {
  totalSessions: number;
  totalVolume: number; // total weight lifted
  totalDuration: number; // in minutes
  exerciseCount: number;
  prCount: number;
}

// For selecting a workout to start
export interface WorkoutSource {
  type: 'template' | 'ai-generated' | 'custom';
  id?: string;
  name: string;
  days: {
    index: number;
    day: string;
    focus: string;
  }[];
}

// Brzycki formula for estimated 1RM
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps > 12) return weight; // Less accurate for high reps
  return Math.round(weight * (36 / (37 - reps)));
}

// Calculate total volume for a session
export function calculateSessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => {
      if (set.isWarmup) return setTotal;
      return setTotal + (set.weight * set.reps);
    }, 0);
  }, 0);
}
