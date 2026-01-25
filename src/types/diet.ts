// Fitness Goal Types
export type FitnessGoal = 'muscle-gain' | 'fat-loss' | 'maintenance' | 'recomposition';

// Activity Level for TDEE calculation
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

// Diet Type/Approach
export type DietType = 'balanced' | 'high-protein' | 'low-carb' | 'mediterranean' | 'vegetarian' | 'vegan';

// Cuisine Preference
export type CuisineType = 'international' | 'nigerian' | 'west-african';

// Dietary Restrictions
export type DietaryRestriction = 
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'shellfish-free'
  | 'soy-free'
  | 'egg-free'
  | 'halal'
  | 'kosher';

// User Profile for personalized calculations
export interface UserProfile {
  name?: string;
  gender?: 'male' | 'female';
  age?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  heightInches?: number;
  activityLevel?: ActivityLevel;
  trainingDays?: number;
}

// Food item in a meal
export interface Food {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Individual Meal Structure
export interface Meal {
  name: string;
  time: string;
  foods: Food[];
}

// Daily Plan
export interface DayPlan {
  day: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

// Generated Diet Plan
export interface DietPlan {
  calorieTarget: number;
  dietType: DietType;
  restrictions: string[];
  mealsPerDay: number;
  goal: FitnessGoal;
  profile?: UserProfile;
  gender?: string;
  cuisine: CuisineType;
  mealPlan: DayPlan[];
}

// Saved Diet Plan (extends generated with metadata)
export interface SavedDietPlan extends DietPlan {
  id: string;
  name: string;
  savedAt: string;
}

// Activity Level Multipliers for TDEE
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

// Goal Labels for Display
export const GOAL_LABELS: Record<FitnessGoal, string> = {
  'muscle-gain': 'Build Muscle',
  'fat-loss': 'Lose Fat',
  maintenance: 'Maintain Weight',
  recomposition: 'Body Recomposition',
};

// Diet Type Labels for Display
export const DIET_TYPE_LABELS: Record<DietType, string> = {
  balanced: 'Balanced',
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  mediterranean: 'Mediterranean',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

// Cuisine Labels for Display
export const CUISINE_LABELS: Record<CuisineType, string> = {
  international: 'International Mix',
  nigerian: 'Nigerian',
  'west-african': 'West African',
};

// Activity Level Labels for Display
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  'very-active': 'Extremely Active',
};

// Restriction Labels for Display
export const RESTRICTION_LABELS: Record<DietaryRestriction, string> = {
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
  'shellfish-free': 'Shellfish-Free',
  'soy-free': 'Soy-Free',
  'egg-free': 'Egg-Free',
  halal: 'Halal',
  kosher: 'Kosher',
};
