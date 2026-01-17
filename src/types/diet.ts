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

export interface DietPlan {
  calorieTarget: number;
  dietType: string;
  restrictions: string[];
  mealsPerDay: number;
  goal: string;
  gender: string;
  mealPlan: DayPlan[];
}

export interface SavedDietPlan extends DietPlan {
  id: string;
  name: string;
  savedAt: string;
}
