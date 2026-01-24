
# Create Standalone Profile Feature

## Overview
Extract the profile input from the AI Diet Plan Generator and create a reusable, standalone User Profile feature that persists in localStorage and can be used across both the Workout Generator and Diet Generator.

---

## Current Architecture

```text
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│      Diet Generator             │    │      Workout Generator          │
│  ┌───────────────────────────┐  │    │  ┌───────────────────────────┐  │
│  │ StepProfile (Full)        │  │    │  │ StepProfile (Gender only) │  │
│  │ - Gender                  │  │    │  │ - Gender                  │  │
│  │ - Weight/Height/Age       │  │    │  └───────────────────────────┘  │
│  │ - Activity Level          │  │    │                                 │
│  │ - Training Days           │  │    └─────────────────────────────────┘
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Proposed Architecture

```text
┌───────────────────────────────────────────────────────────────────┐
│                    Standalone Profile Manager                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Accessible from Header or dedicated Profile section          │  │
│  │ - Gender, Weight, Height, Age, Activity Level, Training Days │  │
│  │ - Persisted to localStorage (user-fitness-profile)           │  │
│  │ - Auto-loads when app starts                                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
                              │
                              │ Consumed by
                              ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│      Diet Generator             │    │      Workout Generator          │
│  • Reads from saved profile     │    │  • Reads gender from profile    │
│  • No profile step in wizard    │    │  • No profile step in wizard    │
│  • 7 steps (was 8)              │    │  • 4 steps (was 5)              │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Create Profile Context & Hook

**New File: `src/contexts/ProfileContext.tsx`**

Create a React Context to manage the user's fitness profile globally:
- Store profile in localStorage under key `user-fitness-profile`
- Provide `profile`, `setProfile`, `isProfileComplete` values
- Auto-load on app initialization

**New File: `src/hooks/useProfile.ts`**

Convenience hook that:
- Accesses the profile context
- Provides helper functions like `updateProfile()`, `clearProfile()`
- Calculates TDEE on-the-fly when profile is available

### Phase 2: Create Profile Editor Component

**New File: `src/components/ProfileEditor.tsx`**

A standalone UI component for editing the profile:
- Full form with all profile fields (gender, weight, height, age, activity level, training days)
- Can be displayed in a modal/dialog or as a dedicated section
- Shows calculated BMR/TDEE preview when data is complete
- Save button persists to localStorage via context

**New File: `src/components/ProfileStatusBadge.tsx`**

A small badge/button for the header:
- Shows "Set up profile" if incomplete
- Shows user's weight/goal summary if complete
- Clicking opens the ProfileEditor modal

### Phase 3: Update Diet Generator

**Modify: `src/components/DietGenerator.tsx`**

| Change | Details |
|--------|---------|
| Remove Step 2 (Profile) | Delete `StepProfile` import and rendering |
| Update step count | `TOTAL_STEPS = 7` (was 8) |
| Update `wizardSteps` array | Remove Profile entry |
| Use profile from context | Import `useProfile` hook and read saved profile |
| Update `canProceed` logic | Remove case 2 validation |
| Adjust step numbers | Shift all steps after Profile down by 1 |
| Show profile warning | If profile is incomplete, show a banner prompting user to set it up |

### Phase 4: Update Workout Generator

**Modify: `src/components/WorkoutGenerator.tsx`**

| Change | Details |
|--------|---------|
| Remove Step 2 (Profile) | Delete `StepProfile` import |
| Update step count | `TOTAL_STEPS = 4` (was 5) |
| Update `wizardSteps` array | Remove Profile entry |
| Use gender from context | Import `useProfile` hook |
| Update `canProceed` logic | Remove gender check in step navigation |
| Adjust step numbers | Shift Muscles and Review steps |
| Show profile warning | If gender not set, prompt user |

### Phase 5: Integrate into App

**Modify: `src/App.tsx`**

- Wrap the app with `ProfileProvider` context

**Modify: `src/pages/Index.tsx`**

- Add ProfileStatusBadge to header
- Optionally add a "Profile" tab or section in the main tabs

### Phase 6: Update Edge Functions

**Modify: `supabase/functions/generate-workout/index.ts`**

- Accept full profile object (not just gender)
- Use profile data in AI prompt for better personalization (optional enhancement)

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/contexts/ProfileContext.tsx` | **Create** | Profile context with localStorage persistence |
| `src/hooks/useProfile.ts` | **Create** | Hook for accessing profile + TDEE calculations |
| `src/components/ProfileEditor.tsx` | **Create** | Full profile editing form |
| `src/components/ProfileStatusBadge.tsx` | **Create** | Header badge showing profile status |
| `src/App.tsx` | **Modify** | Wrap with ProfileProvider |
| `src/pages/Index.tsx` | **Modify** | Add profile badge to header |
| `src/components/DietGenerator.tsx` | **Modify** | Remove profile step, use context, reduce to 7 steps |
| `src/components/WorkoutGenerator.tsx` | **Modify** | Remove profile step, use context, reduce to 4 steps |
| `src/components/diet-wizard/StepProfile.tsx` | **Delete** | No longer needed (moved to standalone) |
| `src/components/workout-wizard/StepProfile.tsx` | **Delete** | No longer needed |

---

## User Experience Flow

### Before (Current)
1. User goes to Diet Generator
2. Fills out Goal
3. **Fills out Profile (again)**
4. Fills out Calories, Diet Type, Restrictions, Meals, Cuisine
5. Reviews and generates

### After (Proposed)
1. **First visit**: User sees "Set up profile" badge in header
2. User clicks badge, enters profile once
3. User goes to Diet Generator
4. Fills out Goal, Calories, Diet Type, Restrictions, Meals, Cuisine (no profile step!)
5. Reviews and generates - profile is auto-included

---

## Technical Details

### Profile Data Structure
```typescript
interface UserProfile {
  gender: 'male' | 'female' | 'other';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  heightInches?: number;
  age: number;
  activityLevel: ActivityLevel;
  trainingDays: number;
}
```

### localStorage Key
```
user-fitness-profile
```

### Profile Completeness Check
```typescript
const isProfileComplete = (profile: UserProfile) => 
  profile.gender && 
  profile.weight > 0 && 
  profile.height > 0 && 
  profile.age >= 15;
```

### Fallback Behavior
If profile is not set when generating a plan:
- Diet Generator: Show warning banner, can still proceed with defaults
- Workout Generator: Show warning banner, can still proceed with defaults
- TDEE calculation: Return null, show "Set profile for personalized recommendations"

---

## Benefits

1. **Single source of truth** - Profile entered once, used everywhere
2. **Shorter wizards** - Diet wizard goes from 8 to 7 steps, Workout from 5 to 4
3. **Better UX** - Users don't re-enter the same data multiple times
4. **Persistence** - Profile survives page refreshes and returns
5. **Extensibility** - Future features (meal tracker, progress tracking) can use the same profile
6. **Consistent personalization** - Same profile used for both workout and diet AI generation
