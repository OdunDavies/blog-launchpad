import { UserProfile, FitnessGoal, ActivityLevel, ACTIVITY_MULTIPLIERS } from '@/types/diet';

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

// Convert weight to kg
export function convertWeightToKg(weight: number, unit: 'kg' | 'lbs'): number {
  return unit === 'lbs' ? weight * 0.453592 : weight;
}

// Convert height to cm
export function convertHeightToCm(height: number, unit: 'cm' | 'ft', inches?: number): number {
  if (unit === 'ft') {
    const totalInches = (height * 12) + (inches || 0);
    return totalInches * 2.54;
  }
  return height;
}

// Calculate BMR using Mifflin-St Jeor equation
export function calculateBMR(profile: UserProfile): number | null {
  const { gender, weight, weightUnit, height, heightUnit, heightInches, age } = profile;
  
  if (!gender || !weight || !height || !age) return null;
  
  const weightKg = convertWeightToKg(weight, weightUnit || 'kg');
  const heightCm = convertHeightToCm(height, heightUnit || 'cm', heightInches);
  
  // Mifflin-St Jeor Formula
  const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  return Math.round(gender === 'male' ? baseBMR + 5 : baseBMR - 161);
}

// Calculate TDEE from BMR and activity level
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// Get macro distribution based on fitness goal
export function getMacroDistribution(goal: FitnessGoal): { protein: number; carbs: number; fat: number } {
  const distributions: Record<FitnessGoal, { protein: number; carbs: number; fat: number }> = {
    'muscle-gain': { protein: 0.30, carbs: 0.45, fat: 0.25 },
    'fat-loss': { protein: 0.35, carbs: 0.30, fat: 0.35 },
    maintenance: { protein: 0.25, carbs: 0.45, fat: 0.30 },
    recomposition: { protein: 0.35, carbs: 0.35, fat: 0.30 },
  };
  return distributions[goal];
}

// Calculate macros in grams from calories
export function calculateMacros(
  calories: number, 
  goal: FitnessGoal
): { protein: number; carbs: number; fat: number } {
  const ratios = getMacroDistribution(goal);
  
  return {
    protein: Math.round((calories * ratios.protein) / 4),
    carbs: Math.round((calories * ratios.carbs) / 4),
    fat: Math.round((calories * ratios.fat) / 9),
  };
}

// Get suggested calories based on goal
export function getSuggestedCalories(tdee: number, goal: FitnessGoal): number {
  const modifiers: Record<FitnessGoal, number> = {
    'muscle-gain': 1.10,
    'fat-loss': 0.80,
    maintenance: 1.00,
    recomposition: 1.00,
  };
  return Math.round(tdee * modifiers[goal]);
}

// Complete TDEE calculation with recommendations
export function calculateTDEEWithRecommendations(
  profile: UserProfile, 
  goal: FitnessGoal
): TDEEResult | null {
  const bmr = calculateBMR(profile);
  if (!bmr || !profile.activityLevel) return null;
  
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const suggestedCalories = getSuggestedCalories(tdee, goal);
  const macros = calculateMacros(suggestedCalories, goal);
  
  return {
    bmr,
    tdee,
    suggestedCalories,
    macros,
  };
}

// Get protein recommendation per body weight
export function getProteinRecommendation(
  profile: UserProfile, 
  goal: FitnessGoal
): number | null {
  if (!profile.weight) return null;
  
  const weightKg = convertWeightToKg(profile.weight, profile.weightUnit || 'kg');
  
  // Protein per kg body weight based on goal
  const proteinPerKg: Record<FitnessGoal, number> = {
    'muscle-gain': 2.0,
    'fat-loss': 2.2,
    maintenance: 1.6,
    recomposition: 2.0,
  };
  
  return Math.round(weightKg * proteinPerKg[goal]);
}
