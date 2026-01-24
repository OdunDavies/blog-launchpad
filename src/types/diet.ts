export interface Food {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  name: string;
  time: string;
  foods: Food[];
}

export interface DayPlan {
  day: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export type FitnessGoal = 'muscle-gain' | 'fat-loss' | 'maintenance' | 'recomposition';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export interface UserProfile {
  gender: 'male' | 'female' | 'other';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  heightInches?: number; // Only used when heightUnit is 'ft'
  age: number;
  activityLevel: ActivityLevel;
  trainingDays: number;
}

export type CuisineType = 'international' | 'nigerian' | 'west-african';

export interface DietPlan {
  calorieTarget: number;
  dietType: string;
  restrictions: string[];
  mealsPerDay: number;
  goal: FitnessGoal | string;
  profile?: UserProfile;
  gender: string;
  cuisine?: CuisineType;
  mealPlan: DayPlan[];
}

export interface SavedDietPlan extends DietPlan {
  id: string;
  name: string;
  savedAt: string;
}
