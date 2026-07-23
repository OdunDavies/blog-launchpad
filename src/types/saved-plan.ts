export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
}

export interface SavedPlan {
  id: string;
  name: string;
  splitDays: number;
  goal: string;
  gender?: string;
  targetMuscles?: string[];
  schedule: WorkoutDay[];
  savedAt?: string;
}
