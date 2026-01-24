// Diet Goal Types
export type DietGoal = 'muscle_building' | 'fat_loss' | 'maintenance' | 'endurance';

// Diet Type/Approach
export type DietType = 'balanced' | 'high_protein' | 'low_carb' | 'keto' | 'vegetarian' | 'vegan';

// Cuisine Preference
export type CuisinePreference = 'international' | 'nigerian' | 'west_african';

// Activity Level for TDEE calculation
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';

// User Profile for personalized calculations
export interface UserProfile {
  name?: string;
  gender?: 'male' | 'female';
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  activityLevel?: ActivityLevel;
}

// Dietary Restrictions
export type DietaryRestriction = 
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'shellfish_free'
  | 'soy_free'
  | 'egg_free'
  | 'halal'
  | 'kosher';

// Meal Types
export type MealType = 
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'afternoon_snack'
  | 'dinner'
  | 'evening_snack'
  | 'pre_workout'
  | 'post_workout';

// Individual Meal Structure
export interface DietMeal {
  mealType: MealType;
  name: string;
  foods: string[];
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

// Daily Diet Plan
export interface DietDay {
  day: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: DietMeal[];
}

// Generated Diet Plan
export interface GeneratedDietPlan {
  goal: DietGoal;
  dailyCalories: number;
  dietType: DietType;
  restrictions: DietaryRestriction[];
  mealTypes: MealType[];
  cuisine: CuisinePreference;
  schedule: DietDay[];
}

// Saved Diet Plan (extends generated with metadata)
export interface SavedDietPlan extends GeneratedDietPlan {
  id: string;
  name: string;
  savedAt: string;
}

// Activity Level Multipliers for TDEE
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

// Goal Labels for Display
export const GOAL_LABELS: Record<DietGoal, string> = {
  muscle_building: 'Build Muscle',
  fat_loss: 'Lose Fat',
  maintenance: 'Maintain Weight',
  endurance: 'Improve Endurance',
};

// Diet Type Labels for Display
export const DIET_TYPE_LABELS: Record<DietType, string> = {
  balanced: 'Balanced',
  high_protein: 'High Protein',
  low_carb: 'Low Carb',
  keto: 'Keto',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

// Cuisine Labels for Display
export const CUISINE_LABELS: Record<CuisinePreference, string> = {
  international: 'International',
  nigerian: 'Nigerian',
  west_african: 'West African',
};

// Activity Level Labels for Display
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extremely_active: 'Extremely Active',
};

// Meal Type Labels for Display
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  morning_snack: 'Morning Snack',
  lunch: 'Lunch',
  afternoon_snack: 'Afternoon Snack',
  dinner: 'Dinner',
  evening_snack: 'Evening Snack',
  pre_workout: 'Pre-Workout',
  post_workout: 'Post-Workout',
};

// Restriction Labels for Display
export const RESTRICTION_LABELS: Record<DietaryRestriction, string> = {
  gluten_free: 'Gluten-Free',
  dairy_free: 'Dairy-Free',
  nut_free: 'Nut-Free',
  shellfish_free: 'Shellfish-Free',
  soy_free: 'Soy-Free',
  egg_free: 'Egg-Free',
  halal: 'Halal',
  kosher: 'Kosher',
};
