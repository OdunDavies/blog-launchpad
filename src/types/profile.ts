export type FitnessGoal = 'muscle-gain' | 'fat-loss' | 'maintenance' | 'recomposition';
export type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'weight-loss';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type Gender = 'male' | 'female';

export interface UserProfile {
  name?: string;
  gender?: Gender;
  age?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  heightInches?: number;
  activityLevel?: ActivityLevel;
  trainingDays?: number;
  fitnessGoal?: WorkoutGoal;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  onboardingComplete?: boolean;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export const WORKOUT_GOAL_LABELS: Record<WorkoutGoal, string> = {
  strength: 'Build Strength',
  hypertrophy: 'Muscle Growth',
  endurance: 'Endurance',
  'weight-loss': 'Weight Loss',
};

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  'muscle-gain': 'Build Muscle',
  'fat-loss': 'Lose Fat',
  maintenance: 'Maintain Weight',
  recomposition: 'Body Recomposition',
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  'very-active': 'Extremely Active',
};
