
# Unified Cuisine Food Database Plan

## Problem Summary
Currently, the Diet Generator has 3 separate cuisine options (International, Nigerian, West African) that are mutually exclusive. Users must choose one, limiting meal variety. The goal is to combine all food databases into a single unified approach that intelligently draws from both International and Nigerian/West African foods to create the best, most varied meal plans.

---

## Solution Overview

Instead of asking users to choose a cuisine, we will:
1. **Remove the Cuisine step** from the wizard (reducing from 7 steps to 6)
2. **Create a unified food database** that includes International AND Nigerian/West African foods
3. **Add an optional "Regional Preference" toggle** to let users indicate if they want a heavier focus on Nigerian/African foods vs balanced global mix

---

## Phase 1: Remove Cuisine Step from Wizard

### Task 1.1: Update Wizard Steps
**File:** `src/components/DietGenerator.tsx`

Changes:
- Remove `StepCuisine` from imports and renderStep()
- Change wizardSteps from 7 to 6 steps
- Remove cuisine state and setCuisine
- Update step indices in `canProceed()` and `renderStep()`
- Send `cuisine: 'unified'` to the edge function

### Task 1.2: Update Type Definitions
**File:** `src/types/diet.ts`

Changes:
- Change `CuisinePreference` type to just `'unified'`
- Update `CUISINE_LABELS` to reflect unified approach
- Keep backward compatibility for saved plans

---

## Phase 2: Create Unified Food Database in Edge Function

### Task 2.1: Merge Food Databases
**File:** `supabase/functions/generate-diet/index.ts`

Create a comprehensive unified database that includes:

```text
GLOBAL FITNESS FOOD DATABASE:

PROTEINS (International):
- Grilled Chicken Breast, Salmon, Greek Yogurt, Eggs, Turkey, Tuna, Tofu, etc.

PROTEINS (Nigerian/West African):
- Suya, Kilishi, Stockfish, Goat Meat, Grilled Tilapia, Chicken Pepper Soup, Asun, etc.

CARBOHYDRATES (International):
- Brown Rice, Sweet Potato, Quinoa, Oatmeal, Whole Wheat Pasta, etc.

CARBOHYDRATES (Nigerian/West African):
- Ofada Rice, Jollof Rice, Pounded Yam, Moi Moi, Akara, Plantain, Fufu, etc.

SOUPS & STEWS (Nigerian/West African):
- Egusi Soup, Okra Soup, Efo Riro, Ogbono Soup, Pepper Soup, etc.

VEGETABLES & GREENS (International):
- Broccoli, Spinach, Bell Peppers, Asparagus, Mixed Salad, etc.

HEALTHY FATS (Global):
- Avocado, Olive Oil, Almonds, Roasted Groundnuts, Walnuts, etc.
```

### Task 2.2: Add Smart Prompt Instructions
**File:** `supabase/functions/generate-diet/index.ts`

Update the AI prompt to:
- Intelligently mix foods from both databases
- Ensure variety across the 7 days
- Balance International and African meals throughout the week
- Consider meal appropriateness (e.g., Suya for dinner, oatmeal for breakfast)

---

## Phase 3: Add Optional Regional Preference (Enhancement)

### Task 3.1: Add Regional Focus Toggle to StepDietType
**File:** `src/components/diet-wizard/StepDietType.tsx`

Add a simple preference toggle at the bottom:
- "Nigerian/African Focus" - Prioritize local foods
- "Balanced Global" (default) - Even mix of cuisines

This is lighter than the previous cuisine step but gives users some control.

### Task 3.2: Pass Preference to Edge Function
**File:** `src/components/DietGenerator.tsx`

Add `regionalFocus: 'african' | 'balanced'` state and pass it to the edge function.

---

## Phase 4: Update Edge Function Prompt Logic

### Task 4.1: Implement Regional Focus in Prompt
**File:** `supabase/functions/generate-diet/index.ts`

Modify prompt based on regional focus:
- **African Focus**: "Prioritize Nigerian and West African foods, but include some International options for variety"
- **Balanced**: "Create a diverse mix of International and Nigerian/West African meals, alternating cuisines throughout the week"

---

## Phase 5: Clean Up Unused Components

### Task 5.1: Delete StepCuisine Component
**File:** `src/components/diet-wizard/StepCuisine.tsx`

Remove this file entirely as it's no longer needed.

### Task 5.2: Update StepReview
**File:** `src/components/diet-wizard/StepReview.tsx`

- Remove cuisine display from review
- Add regional preference display if applicable

---

## Technical Implementation Details

### Files to Modify
| File | Change |
|------|--------|
| `src/types/diet.ts` | Update CuisinePreference type |
| `src/components/DietGenerator.tsx` | Remove cuisine step, add regional preference |
| `src/components/diet-wizard/StepDietType.tsx` | Add regional focus toggle |
| `src/components/diet-wizard/StepReview.tsx` | Update review display |
| `supabase/functions/generate-diet/index.ts` | Unified food database + smart prompts |

### Files to Delete
| File | Reason |
|------|--------|
| `src/components/diet-wizard/StepCuisine.tsx` | No longer needed |

### New Data Flow

```text
User Wizard (6 Steps):
Goal -> Calories -> Diet Type + Regional Pref -> Restrictions -> Meals -> Review

Edge Function receives:
{
  goal, dailyCalories, dietType, restrictions, mealTypes,
  regionalFocus: 'african' | 'balanced'  // NEW
}

AI Uses:
- Full unified food database (all foods)
- Smart mixing instructions based on regionalFocus
- Goal-specific macro calculations
```

---

## Expected Outcome

**Before:** Users pick ONE cuisine and only get foods from that database
**After:** Users get a rich, varied 7-day plan with:
- Best foods from International AND Nigerian/African cuisines
- Smart meal pairing (African dinner + International breakfast variety)
- Optional preference to skew toward local foods if desired
- Reduced wizard steps (6 instead of 7)

---

## Implementation Order

1. Update types in `diet.ts`
2. Modify `StepDietType.tsx` to add regional toggle
3. Update `DietGenerator.tsx` to remove cuisine step
4. Update `StepReview.tsx` to show regional preference
5. Rewrite edge function with unified database
6. Delete `StepCuisine.tsx`
7. Test the complete flow
