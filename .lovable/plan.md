
# AI Diet Generator Redesign Plan

## Overview
Replace the current diet generator implementation with the enhanced version from the reference repository. The new version includes a more structured wizard, better calorie calculation with TDEE integration, a cuisine selector, and improved result display with MealCard and NutritionSummary components.

---

## Key Differences: Current vs Reference

| Feature | Current | Reference |
|---------|---------|-----------|
| Goals | 4 options (muscle_building, fat_loss, maintenance, endurance) | 4 options (muscle-gain, fat-loss, maintenance, recomposition) |
| Calories | Number input with TDEE quick buttons | Preset options + Suggested (from TDEE) + Custom |
| Diet Type | Combined with Regional Focus | Separate step with 6 options |
| Cuisine | Regional Focus (african/balanced) | Dedicated Cuisine step (international/nigerian/west-african) |
| Meals | Checkbox selection of 8 meal types | Radio selection of 3-6 meals per day |
| Review | Basic summary cards | Detailed review with profile and TDEE |
| Result Display | Inline accordions | Day selector tabs + MealCard + NutritionSummary |
| Progress | Uses WizardProgress from workout-wizard | Dedicated DietWizardProgress component |
| PDF Download | Not visible in current | Download button with PDF generation |
| Saved Plans | Basic save/load | Save, rename, delete functionality |

---

## Phase 1: Update Type Definitions

### Task 1.1: Rewrite `src/types/diet.ts`

Update types to match the reference structure:

```text
New/Changed Types:
- FitnessGoal: 'muscle-gain' | 'fat-loss' | 'maintenance' | 'recomposition'
- ActivityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
- CuisineType: 'international' | 'nigerian' | 'west-african'

New Interfaces:
- Food: { name, portion, calories, protein, carbs, fat }
- Meal: { name, time, foods: Food[] }
- DayPlan: { day, totalCalories, totalProtein, totalCarbs, totalFat, meals: Meal[] }

Updated Interfaces:
- UserProfile: Add weightUnit, heightUnit, heightInches, trainingDays
- DietPlan: { calorieTarget, dietType, restrictions, mealsPerDay, goal, profile, gender, cuisine, mealPlan: DayPlan[] }
- SavedDietPlan: extends DietPlan with id, name, savedAt
```

---

## Phase 2: Add TDEE Calculator Utility

### Task 2.1: Create `src/utils/tdeeCalculator.ts`

New utility file with functions:
- `calculateBMR(profile)` - Mifflin-St Jeor equation with unit conversion
- `calculateTDEE(bmr, activityLevel)` - TDEE with activity multipliers
- `getMacroDistribution(goal)` - Macro ratios based on fitness goal
- `calculateMacros(calories, goal)` - Macro grams from calories
- `calculateTDEEWithRecommendations(profile, goal)` - Complete calculation returning TDEEResult
- `getProteinRecommendation(profile, goal)` - Protein per body weight

TDEEResult interface:
```text
{
  bmr: number;
  tdee: number;
  suggestedCalories: number;
  macros: { protein, carbs, fat };
}
```

---

## Phase 3: Create New Diet Wizard Components

### Task 3.1: Create `src/components/diet-wizard/DietWizardProgress.tsx`

New progress component with:
- Step icons showing current/completed/pending states
- Checkmark for completed steps
- Step titles hidden on mobile
- Connecting lines between steps

### Task 3.2: Rewrite `src/components/diet-wizard/StepGoal.tsx`

Enhanced goal selection:
- 4 goals: Muscle Gain, Fat Loss, Maintenance, Body Recomposition
- Each with icon, description, and macro detail
- Centered header with icon
- Card-based RadioGroup

### Task 3.3: Rewrite `src/components/diet-wizard/StepCalories.tsx`

Enhanced calorie selection:
- Display TDEE summary card if profile is complete (BMR, TDEE, Suggested)
- "Suggested" option with Recommended badge
- 4 preset options (1500, 2000, 2500, 3000)
- Custom option with text input
- Goal-specific descriptions

### Task 3.4: Rewrite `src/components/diet-wizard/StepDietType.tsx`

Simplified diet type selection:
- 6 diet types: Balanced, High Protein, Low Carb, Mediterranean, Vegetarian, Vegan
- Remove RegionalFocus (moved to separate step)
- Card-based RadioGroup with icons

### Task 3.5: Rewrite `src/components/diet-wizard/StepRestrictions.tsx`

Updated restrictions:
- Use string-based restriction values (e.g., 'gluten-free' instead of 'gluten_free')
- Card-based checkboxes
- Toggle function prop instead of setter

### Task 3.6: Rewrite `src/components/diet-wizard/StepMeals.tsx`

Simplified meals selection:
- Radio selection instead of checkboxes
- 4 options: 3, 4, 5, 6 meals per day
- Single selection (mealsPerDay as string)

### Task 3.7: Create `src/components/diet-wizard/StepCuisine.tsx`

New cuisine selection step:
- 3 options: International Mix, Nigerian, West African
- Emoji icons + descriptions
- Info cards for Nigerian/West African options listing available foods

### Task 3.8: Create `src/components/diet-wizard/StepDietReview.tsx`

Enhanced review step:
- Goal card
- Profile card (if available)
- TDEE summary card (if calculated)
- Calories, Diet Style, Meals Per Day, Cuisine cards
- Restrictions badges

---

## Phase 4: Create New Display Components

### Task 4.1: Create `src/components/MealCard.tsx`

New component for displaying individual meals:
- Header with meal name and time
- Macro badges (calories, protein, carbs, fat)
- Food items list with portion and calories
- Optional editing mode with remove button

### Task 4.2: Create `src/components/NutritionSummary.tsx`

New component for daily nutrition summary:
- Calorie progress bar
- Macro breakdown grid (Protein, Carbs, Fat)
- Percentage calculations for each macro

---

## Phase 5: Rewrite DietGenerator Component

### Task 5.1: Rewrite `src/components/DietGenerator.tsx`

Complete rewrite with:

**State Management:**
- currentStep (1-7)
- goal: FitnessGoal
- calorieTarget: 'suggested' | '1500' | '2000' | '2500' | '3000' | 'custom'
- customCalories: string
- dietType: string
- restrictions: string[]
- mealsPerDay: '3' | '4' | '5' | '6'
- cuisine: CuisineType
- generatedPlan: DietPlan | null
- savedPlans: SavedDietPlan[]
- selectedDayIndex: number
- isDownloading: boolean

**New Features:**
- TDEE calculation using profile from context
- toggleRestriction function
- getEffectiveCalories() helper
- savePlan, loadPlan, deletePlan, startEditing, saveRename functions
- downloadPlan function for PDF export
- Day selector tabs for result view
- MealCard + NutritionSummary for result display

**Wizard Steps (7 total):**
1. Goal
2. Calories
3. Diet Type
4. Restrictions
5. Meals
6. Cuisine
7. Review

---

## Phase 6: Update Edge Function

### Task 6.1: Update `supabase/functions/generate-diet/index.ts`

Update request body parsing:
- Accept: `calorieTarget`, `dietType`, `restrictions`, `mealsPerDay`, `goal`, `profile`, `cuisine`
- Map `mealsPerDay` number to meal types array internally
- Map `cuisine` to `regionalFocus` logic

Update response structure:
- Return `mealPlan` array with `DayPlan` structure
- Each meal includes `Food` objects with `name`, `portion`, `calories`, `protein`, `carbs`, `fat`

---

## Phase 7: Update Profile Context

### Task 7.1: Update `src/contexts/ProfileContext.tsx`

Add new fields to UserProfile:
- weightUnit: 'kg' | 'lbs'
- heightUnit: 'cm' | 'ft'
- heightInches?: number
- trainingDays: number

Update type imports to use new diet types.

---

## Phase 8: Update Profile Editor

### Task 8.1: Update `src/components/ProfileEditor.tsx`

Add new input fields:
- Weight unit selector (kg/lbs)
- Height unit selector (cm/ft)
- Height inches input (when ft selected)
- Training days slider (1-7)

---

## Files to Create

| File | Description |
|------|-------------|
| `src/utils/tdeeCalculator.ts` | TDEE and macro calculation utilities |
| `src/components/diet-wizard/DietWizardProgress.tsx` | Enhanced wizard progress indicator |
| `src/components/diet-wizard/StepCuisine.tsx` | Cuisine preference selection |
| `src/components/diet-wizard/StepDietReview.tsx` | Enhanced review before generation |
| `src/components/MealCard.tsx` | Individual meal display component |
| `src/components/NutritionSummary.tsx` | Daily nutrition summary component |

## Files to Rewrite

| File | Description |
|------|-------------|
| `src/types/diet.ts` | Updated type definitions |
| `src/components/diet-wizard/StepGoal.tsx` | Enhanced goal selection |
| `src/components/diet-wizard/StepCalories.tsx` | TDEE-integrated calorie selection |
| `src/components/diet-wizard/StepDietType.tsx` | Simplified diet type selection |
| `src/components/diet-wizard/StepRestrictions.tsx` | Updated restrictions selection |
| `src/components/diet-wizard/StepMeals.tsx` | Simplified meals per day selection |
| `src/components/DietGenerator.tsx` | Complete rewrite |
| `supabase/functions/generate-diet/index.ts` | Updated to match new structure |
| `src/contexts/ProfileContext.tsx` | Extended profile fields |
| `src/components/ProfileEditor.tsx` | New profile inputs |

## Files to Delete

| File | Reason |
|------|--------|
| `src/components/diet-wizard/StepReview.tsx` | Replaced by `StepDietReview.tsx` |

---

## Implementation Order

1. Update `src/types/diet.ts` with new type definitions
2. Create `src/utils/tdeeCalculator.ts`
3. Create `DietWizardProgress.tsx`
4. Rewrite step components (Goal, Calories, DietType, Restrictions, Meals)
5. Create `StepCuisine.tsx`
6. Create `StepDietReview.tsx`
7. Create `MealCard.tsx`
8. Create `NutritionSummary.tsx`
9. Rewrite `DietGenerator.tsx`
10. Update edge function
11. Update ProfileContext and ProfileEditor
12. Delete old StepReview.tsx

---

## Migration Considerations

### LocalStorage Keys
The reference uses `diet-planner-saved-plans` which matches the current implementation.

### Breaking Changes
- Goal values change format (e.g., `muscle_building` → `muscle-gain`)
- MealType array replaced by mealsPerDay number
- Diet structure changes from `schedule: DietDay[]` to `mealPlan: DayPlan[]`
- Meal structure changes to include `Food` objects instead of string arrays

### Edge Function Changes
The edge function needs to return `mealPlan` with `Meal[]` containing `Food[]` objects instead of the current `schedule` with `DietMeal[]` structure.
