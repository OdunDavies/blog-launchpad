import { UserProfile, FitnessGoal, ActivityLevel } from '@/types/diet';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

const goalCalorieAdjustments: Record<FitnessGoal, number> = {
  'muscle-gain': 300, // Surplus for muscle building
  'fat-loss': -500, // Deficit for fat loss
  'maintenance': 0,
  'recomposition': -100, // Slight deficit for recomp
};

export interface TDEEResult {
  bmr: number;
  tdee: number;
  suggestedCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 */
export function calculateBMR(profile: UserProfile): number {
  // Convert weight to kg if needed
  const weightKg = profile.weightUnit === 'lbs' 
    ? profile.weight * 0.453592 
    : profile.weight;
  
  // Convert height to cm if needed
  let heightCm: number;
  if (profile.heightUnit === 'ft') {
    const totalInches = (profile.height * 12) + (profile.heightInches || 0);
    heightCm = totalInches * 2.54;
  } else {
    heightCm = profile.height;
  }
  
  // Mifflin-St Jeor Equation
  const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * profile.age);
  
  if (profile.gender === 'male') {
    return Math.round(baseBMR + 5);
  } else if (profile.gender === 'female') {
    return Math.round(baseBMR - 161);
  } else {
    // For 'other', use average of male and female
    return Math.round(baseBMR - 78);
  }
}

/**
 * Calculate TDEE based on activity level
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = activityMultipliers[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Get macro distribution based on goal
 */
export function getMacroDistribution(goal: FitnessGoal): { protein: number; carbs: number; fat: number } {
  switch (goal) {
    case 'muscle-gain':
      return { protein: 0.35, carbs: 0.45, fat: 0.20 };
    case 'fat-loss':
      return { protein: 0.40, carbs: 0.30, fat: 0.30 };
    case 'recomposition':
      return { protein: 0.40, carbs: 0.35, fat: 0.25 };
    case 'maintenance':
    default:
      return { protein: 0.30, carbs: 0.40, fat: 0.30 };
  }
}

/**
 * Calculate recommended macros in grams
 */
export function calculateMacros(
  calories: number, 
  goal: FitnessGoal
): { protein: number; carbs: number; fat: number } {
  const distribution = getMacroDistribution(goal);
  
  return {
    protein: Math.round((calories * distribution.protein) / 4), // 4 cal per gram
    carbs: Math.round((calories * distribution.carbs) / 4), // 4 cal per gram
    fat: Math.round((calories * distribution.fat) / 9), // 9 cal per gram
  };
}

/**
 * Complete TDEE calculation with suggested calories and macros
 */
export function calculateTDEEWithRecommendations(
  profile: UserProfile,
  goal: FitnessGoal
): TDEEResult {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieAdjustment = goalCalorieAdjustments[goal];
  const suggestedCalories = Math.round((tdee + calorieAdjustment) / 50) * 50; // Round to nearest 50
  const macros = calculateMacros(suggestedCalories, goal);
  
  return {
    bmr,
    tdee,
    suggestedCalories,
    macros,
  };
}

/**
 * Get protein recommendation based on body weight and goal
 */
export function getProteinRecommendation(profile: UserProfile, goal: FitnessGoal): number {
  const weightKg = profile.weightUnit === 'lbs' 
    ? profile.weight * 0.453592 
    : profile.weight;
  
  // Protein per kg of body weight
  const proteinMultiplier = goal === 'muscle-gain' || goal === 'recomposition' 
    ? 2.2 // Higher for muscle building
    : goal === 'fat-loss' 
      ? 2.0 // Preserve muscle during deficit
      : 1.6; // Maintenance
  
  return Math.round(weightKg * proteinMultiplier);
}
