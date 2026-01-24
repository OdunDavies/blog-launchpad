

# AI Diet Plan Generator - Complete Implementation Plan

## Overview
This plan outlines the complete implementation of an AI-powered Diet Plan Generator for MuscleAtlas, following the established patterns from the existing Workout Generator while incorporating the previously designed features from the user profile system and diet generation logic.

---

## Architecture Summary

```text
+------------------+     +-------------------+     +--------------------+
|   Index.tsx      |     |   DietGenerator   |     |  generate-diet     |
|   (Add Tab)      | --> |   (Wizard UI)     | --> |  (Edge Function)   |
+------------------+     +-------------------+     +--------------------+
        |                        |                         |
        v                        v                         v
+------------------+     +-------------------+     +--------------------+
| ProfileContext   |     | Diet Wizard Steps |     | Lovable AI Gateway |
| (Global State)   |     | (7 Components)    |     | (Gemini 2.5 Flash) |
+------------------+     +-------------------+     +--------------------+
```

---

## Phase 1: Data Models and Types

### Task 1.1: Create Diet Types
**File:** `src/types/diet.ts`

Define TypeScript interfaces for the diet feature:
- `UserProfile` - name, gender, age, weight, height, activity level
- `DietMeal` - meal name, foods array, calories, macros (protein/carbs/fats)
- `DietDay` - day label, total calories, meals array
- `GeneratedDietPlan` - full plan with user inputs and schedule
- `SavedDietPlan` - extends generated plan with id, name, savedAt
- `DietGoal` - enum for muscle_building, fat_loss, maintenance, endurance
- `DietType` - enum for balanced, high_protein, low_carb, keto, vegetarian, vegan
- `CuisinePreference` - enum for international, nigerian, west_african

---

## Phase 2: Global User Profile System

### Task 2.1: Create Profile Context
**File:** `src/contexts/ProfileContext.tsx`

Implement React context for global user profile:
- Store user data: name, gender, age, weight (kg), height (cm), activity level
- Persist to localStorage with key `muscleatlas-user-profile`
- Calculate BMR using Mifflin-St Jeor equation
- Calculate TDEE based on activity level multiplier
- Provide `updateProfile` function for partial updates
- Export `useProfile` hook for consuming components

**BMR Formula (Mifflin-St Jeor):**
- Male: (10 x weight) + (6.25 x height) - (5 x age) + 5
- Female: (10 x weight) + (6.25 x height) - (5 x age) - 161

**Activity Multipliers:**
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Very Active: 1.725
- Extremely Active: 1.9

### Task 2.2: Create Profile Editor Component
**File:** `src/components/ProfileEditor.tsx`

Build a modal/sheet for editing user profile:
- Input fields for all profile data
- Plain-language explanations of BMR/TDEE
- Real-time calculation display
- Save button that updates context

### Task 2.3: Create Profile Status Badge
**File:** `src/components/ProfileStatusBadge.tsx`

Create header badge showing profile status:
- Display user's name if set, otherwise "Set Profile"
- Click to open ProfileEditor
- Visual indicator if profile is incomplete

---

## Phase 3: Diet Generator UI Components

### Task 3.1: Create Diet Wizard Step Components
**Directory:** `src/components/diet-wizard/`

Create 7 wizard step components following the workout-wizard pattern:

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `StepGoal.tsx` | Select diet goal (muscle building, fat loss, maintenance, endurance) |
| 2 | `StepCalories.tsx` | Set daily calorie target (auto-calculated from TDEE or manual) |
| 3 | `StepDietType.tsx` | Choose diet approach (balanced, high protein, keto, etc.) |
| 4 | `StepRestrictions.tsx` | Select dietary restrictions (gluten-free, dairy-free, allergies) |
| 5 | `StepMeals.tsx` | Choose meal types (breakfast, lunch, dinner, snacks, pre/post workout) |
| 6 | `StepCuisine.tsx` | Select cuisine preference (international, Nigerian, West African) |
| 7 | `StepReview.tsx` | Summary of all selections before generation |

### Task 3.2: Create Main DietGenerator Component
**File:** `src/components/DietGenerator.tsx`

Build the main diet generator component:
- 7-step wizard with progress indicator (reuse WizardProgress)
- State management for all wizard inputs
- Integration with ProfileContext for auto-populating data
- Save/Load functionality with localStorage
- PDF download capability
- Share functionality (reuse ShareModal pattern)
- Edit mode for generated plans

---

## Phase 4: Backend Edge Function

### Task 4.1: Create Diet Generation Edge Function
**File:** `supabase/functions/generate-diet/index.ts`

Implement the AI-powered diet generation:

**Request Body:**
```json
{
  "goal": "muscle_building",
  "dailyCalories": 2500,
  "dietType": "high_protein",
  "restrictions": ["dairy-free"],
  "mealTypes": ["breakfast", "lunch", "dinner", "post-workout"],
  "cuisine": "nigerian",
  "gender": "male"
}
```

**AI System Prompt Structure:**
- Comprehensive food database for each cuisine
- Macro distribution rules by goal:
  - Muscle Building: 30% protein, 40% carbs, 30% fats
  - Fat Loss: 35% protein, 30% carbs, 35% fats
  - Maintenance: 25% protein, 45% carbs, 30% fats
  - Endurance: 20% protein, 55% carbs, 25% fats
- Meal-type specific guidelines:
  - Breakfast: Light, energizing (15-20% daily calories)
  - Snacks: Portable, 150-300 calories
  - Lunch/Dinner: Substantial (25-35% daily calories)
  - Pre/Post-Workout: Performance nutrition
- Nigerian/West African food database:
  - Proteins: Suya, Kilishi, Stockfish, Goat Meat, Dried Fish
  - Carbs: Ofada Rice, Yam, Plantain, Garri, Moi Moi
  - Soups: Egusi, Okra, Efo Riro

**Tool Calling Schema:**
```json
{
  "name": "generate_diet_plan",
  "parameters": {
    "schedule": [{
      "day": "string",
      "totalCalories": "number",
      "meals": [{
        "mealType": "string",
        "name": "string",
        "foods": ["string"],
        "calories": "number",
        "protein": "number",
        "carbs": "number",
        "fats": "number"
      }]
    }]
  }
}
```

### Task 4.2: Update Supabase Config
**File:** `supabase/config.toml`

Add the generate-diet function configuration:
```toml
[functions.generate-diet]
verify_jwt = false
```

---

## Phase 5: PDF and Share Utilities

### Task 5.1: Create Diet PDF Generator
**File:** `src/utils/downloadDietPdf.ts`

Implement PDF generation for diet plans:
- Generate styled HTML template (similar to workout PDF)
- Include user's name in personalized title
- Display daily breakdown with meals and macros
- Show per-meal nutritional information
- Include total daily summary
- Use jsPDF + html2canvas for generation

### Task 5.2: Create Diet Share Utility
**File:** `src/utils/shareDiet.ts`

Implement sharing functionality:
- Generate shareable URL with diet plan data
- Encode plan data for URL sharing
- Reuse existing ShareModal component

---

## Phase 6: Integration

### Task 6.1: Update Index.tsx
Add the Diet tab and integrate new components:
- Import ProfileContext provider
- Import ProfileStatusBadge
- Import DietGenerator
- Add Diet tab to TabsList (5 tabs total: Library, Templates, Workout, Diet, Tracker)
- Add ProfileStatusBadge to header

### Task 6.2: Update App.tsx
Wrap application with ProfileProvider:
- Import ProfileProvider from ProfileContext
- Wrap existing component tree

### Task 6.3: Update Analytics Hook
**File:** `src/hooks/useAnalytics.ts`

Add diet-specific tracking:
- `trackDietGenerated(dietType, mealCount)`
- `trackDietPdfDownload(planName)`

---

## Phase 7: Shared Workout/Diet Page (Optional Enhancement)

### Task 7.1: Create Shared Diet Page
**File:** `src/pages/SharedDiet.tsx`

Similar to SharedWorkout.tsx but for diet plans:
- Parse diet plan from URL parameters
- Display formatted diet plan
- Allow users to save/download

---

## File Structure Summary

```text
src/
├── types/
│   └── diet.ts                    # Diet-related TypeScript interfaces
├── contexts/
│   └── ProfileContext.tsx         # Global user profile state
├── components/
│   ├── ProfileEditor.tsx          # Profile editing modal
│   ├── ProfileStatusBadge.tsx     # Header profile indicator
│   ├── DietGenerator.tsx          # Main diet generator component
│   └── diet-wizard/
│       ├── StepGoal.tsx           # Goal selection
│       ├── StepCalories.tsx       # Calorie target
│       ├── StepDietType.tsx       # Diet approach
│       ├── StepRestrictions.tsx   # Dietary restrictions
│       ├── StepMeals.tsx          # Meal types selection
│       ├── StepCuisine.tsx        # Cuisine preference
│       └── StepReview.tsx         # Summary review
├── utils/
│   ├── downloadDietPdf.ts         # Diet PDF generation
│   └── shareDiet.ts               # Diet sharing utilities
└── pages/
    └── SharedDiet.tsx             # Shared diet viewer (optional)

supabase/
├── config.toml                    # Add generate-diet function
└── functions/
    └── generate-diet/
        └── index.ts               # AI diet generation edge function
```

---

## Technical Details

### Dependencies
All required packages are already installed:
- `jspdf` and `html2canvas` for PDF generation
- `@tanstack/react-query` for data fetching
- `sonner` for toast notifications
- UI components from shadcn/ui

### API Integration
- Uses Lovable AI Gateway at `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-2.5-flash` (same as workout generator)
- LOVABLE_API_KEY is already configured as a secret

### Error Handling
- Handle 429 (rate limit) errors with user-friendly message
- Handle 402 (payment required) errors
- Display toast notifications for all error states
- Validate user inputs before API calls

### localStorage Keys
- `muscleatlas-user-profile` - User profile data
- `diet-planner-saved-plans` - Saved diet plans

---

## Implementation Order

1. **Phase 1** - Create type definitions (foundation)
2. **Phase 2** - Build ProfileContext and related components
3. **Phase 4** - Create backend edge function (can be done in parallel)
4. **Phase 3** - Build diet wizard components
5. **Phase 5** - Add PDF and share utilities
6. **Phase 6** - Integrate everything into main app
7. **Phase 7** - Optional enhancements

---

## Estimated Component Count
- 12 new files to create
- 3 existing files to modify (Index.tsx, App.tsx, useAnalytics.ts)
- 1 config file update (supabase/config.toml)

