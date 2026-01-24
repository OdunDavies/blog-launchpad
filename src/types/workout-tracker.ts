export interface WorkoutSet {
  setNumber: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
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
  date: string; // ISO date
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  workoutName?: string;
  templateId?: string; // If started from a template
  exercises: LoggedExercise[];
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
}

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  reps: number;
  estimated1RM: number;
  date: string;
}

export interface ActiveWorkoutState {
  id: string;
  startTime: string;
  workoutName?: string;
  templateId?: string;
  exercises: LoggedExercise[];
}

export type WeightUnit = 'kg' | 'lbs';

export const WORKOUT_LOGS_KEY = 'muscleatlas-workout-logs';
export const ACTIVE_WORKOUT_KEY = 'muscleatlas-active-workout';
export const EXERCISE_PRS_KEY = 'muscleatlas-exercise-prs';
export const WEIGHT_UNIT_KEY = 'muscleatlas-weight-unit';
