
# Workout Tracker Redesign Plan

## Overview
Replace the current workout tracker implementation with the enhanced version from the reference repository. The new version includes significant improvements in UX, feature set, and code architecture.

---

## Key Improvements from Reference Implementation

| Feature | Current | Reference |
|---------|---------|-----------|
| Workout Summary | Basic notes input | Full modal with mood, stats, PR celebration |
| Set Completion | No completion toggle | Checkbox per set to mark complete |
| Warmup Sets | Basic toggle | Dedicated warmup button with Flame icon |
| Exercise Logger | Inline in ActiveWorkout | Separate reusable component |
| Set Row | Table-based | Card-based with visual feedback |
| Weight Unit | Hardcoded kg | User-selectable kg/lbs with persistence |
| Exercise History | Minimal | Shows "previous best" per exercise |
| PR Detection | After workout | Real-time during workout |
| Day Streak | Not tracked | Calculated and displayed |
| Start Modal | Tab-based | Step-based wizard navigation |

---

## Phase 1: Update Type Definitions

### Task 1.1: Rewrite `src/types/workout-tracker.ts`

Replace current types with enhanced versions:
- Add `completed` field to `WorkoutSet`
- Add `weightUnit` field to `WorkoutSet`
- Add `rpe` (Rate of Perceived Exertion) optional field
- Rename `TrackedExercise` to `LoggedExercise` for consistency
- Rename `WorkoutSession` to `WorkoutLog` for clarity
- Add `ActiveWorkoutState` interface for active tracking
- Add `mood` field to completed workouts
- Add localStorage key constants
- Export `calculate1RM` function from hook

---

## Phase 2: Rewrite the Hook

### Task 2.1: Rewrite `src/hooks/useWorkoutTracker.ts`

Major changes:
- Add `weightUnit` state with localStorage persistence
- Use `Record<string, ExercisePR>` instead of array for faster lookups
- Persist active workout to localStorage (survives page refresh)
- Add `calculate1RM` export for external use
- Real-time PR detection during set updates
- Add `getExerciseHistory` with best set calculation
- Add workout streak calculation logic

---

## Phase 3: Create New Component Files

### Task 3.1: Create `src/components/tracker/SetRow.tsx`

New component for individual set logging:
- Grid layout with set number, weight input, reps input, completion checkbox, delete button
- Visual feedback for warmup sets (orange background)
- Visual feedback for completed sets (green/primary tint)
- PR trophy icon when set is a PR
- Weight unit display in input suffix
- Previous best hint in placeholder

### Task 3.2: Create `src/components/tracker/ExerciseLogger.tsx`

New component for per-exercise logging:
- Collapsible card with exercise name header
- Displays completed/total sets count
- Shows total volume lifted
- "Previous best" display from history
- PR badge when exercise contains a PR set
- SetRow components for each set
- Add Set and Add Warmup buttons
- Delete exercise button

### Task 3.3: Create `src/components/tracker/WorkoutSummary.tsx`

New modal component for finishing workouts:
- Summary stats grid (duration, total sets, volume)
- New PRs celebration card with yellow styling
- Mood selector with emoji icons (great, good, okay, tired, exhausted)
- Notes textarea
- Continue / Save & Finish buttons

### Task 3.4: Rewrite `src/components/tracker/ActiveWorkout.tsx`

Completely rewrite using new sub-components:
- Use ExercisePickerModal for adding exercises
- Use ExerciseLogger for each exercise
- Use WorkoutSummary modal for finishing
- Cancel confirmation AlertDialog
- Real-time PR detection using `calculate1RM`
- Pass exercise history to ExerciseLogger for "previous best"

### Task 3.5: Rewrite `src/components/tracker/StartWorkoutModal.tsx`

Replace tabs with step-based navigation:
- Step 1: Choose - Empty, Template, or Saved Plans
- Step 2: Template list or Saved Plans list
- Step 3: Day selection with exercise preview
- Back button navigation between steps
- Workout name input on first step
- Uses Dialog component (already mobile-optimized with Drawer)

### Task 3.6: Rewrite `src/components/tracker/WorkoutStats.tsx`

Enhance with:
- Day streak calculation and display with Flame icon
- 4-week bar chart for workout frequency
- Personal Records card with sorted list (most recent first)
- Responsive 2x2 or 4-column grid for stat cards

### Task 3.7: Rewrite `src/components/tracker/WorkoutHistory.tsx`

Enhance with:
- Click to view full workout detail in Dialog
- Mood emoji display
- PR badge on cards containing PRs
- Summary stats in detail view (exercises, sets, volume)
- Scrollable exercise list in detail modal
- Notes display

---

## Phase 4: Update Main Tracker Component

### Task 4.1: Rewrite `src/components/WorkoutTracker.tsx`

Update to use new hook interface:
- Destructure `weightUnit` and `setWeightUnit` from hook
- Add weight unit toggle in header
- Pass all required props to child components
- Handle new callback signatures

---

## Phase 5: File Organization

### Task 5.1: Create tracker folder structure

Rename `src/components/workout-tracker/` to `src/components/tracker/`:
- SetRow.tsx (new)
- ExerciseLogger.tsx (new)
- WorkoutSummary.tsx (new)
- ActiveWorkout.tsx (rewritten)
- StartWorkoutModal.tsx (rewritten)
- WorkoutStats.tsx (rewritten)
- WorkoutHistory.tsx (rewritten)
- ProgressCharts.tsx (keep, minor updates)

### Task 5.2: Update imports across the app

Update `src/components/WorkoutTracker.tsx` and any other files importing from `workout-tracker/` to use `tracker/`

---

## Technical Implementation Details

### New Type Definitions

```text
WorkoutSet:
  - setNumber: number
  - weight: number
  - weightUnit: 'kg' | 'lbs'
  - reps: number
  - rpe?: number (1-10)
  - isWarmup?: boolean
  - isPR?: boolean
  - completed?: boolean  // NEW

LoggedExercise:
  - exerciseId: string
  - exerciseName: string
  - sets: WorkoutSet[]
  - notes?: string

WorkoutLog:
  - id: string
  - date: string
  - startTime: string
  - endTime?: string
  - duration?: number
  - workoutName?: string
  - templateId?: string
  - exercises: LoggedExercise[]
  - notes?: string
  - mood?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted'  // NEW

ActiveWorkoutState:
  - id: string
  - startTime: string
  - workoutName?: string
  - templateId?: string
  - exercises: LoggedExercise[]

ExercisePR:
  - exerciseId: string
  - exerciseName: string
  - weight: number
  - weightUnit: 'kg' | 'lbs'
  - reps: number
  - estimated1RM: number
  - date: string

WeightUnit: 'kg' | 'lbs'
```

### LocalStorage Keys

```text
WORKOUT_LOGS_KEY = 'muscleatlas-workout-logs'
ACTIVE_WORKOUT_KEY = 'muscleatlas-active-workout'
EXERCISE_PRS_KEY = 'muscleatlas-exercise-prs'
WEIGHT_UNIT_KEY = 'muscleatlas-weight-unit'
```

---

## Migration Considerations

### Data Migration
The existing localStorage keys are different:
- Current: `muscleatlas-workout-sessions`, `muscleatlas-personal-records`
- New: `muscleatlas-workout-logs`, `muscleatlas-exercise-prs`

Add migration logic in the hook to check for old keys and convert data format if found.

### Breaking Changes
- Exercise ID changes from generated `${timestamp}-${index}` to slug-based `exercise-name-slug`
- PR storage changes from array to Record object
- Set completion is now explicit (checkbox) rather than implicit

---

## Files to Create

| File | Description |
|------|-------------|
| `src/components/tracker/SetRow.tsx` | Individual set input row |
| `src/components/tracker/ExerciseLogger.tsx` | Per-exercise logging card |
| `src/components/tracker/WorkoutSummary.tsx` | Finish workout modal |

## Files to Rewrite

| File | Description |
|------|-------------|
| `src/types/workout-tracker.ts` | Enhanced type definitions |
| `src/hooks/useWorkoutTracker.ts` | Complete hook rewrite |
| `src/components/tracker/ActiveWorkout.tsx` | Use new sub-components |
| `src/components/tracker/StartWorkoutModal.tsx` | Step-based wizard |
| `src/components/tracker/WorkoutStats.tsx` | Enhanced stats with streak |
| `src/components/tracker/WorkoutHistory.tsx` | Enhanced with detail modal |

## Files to Delete

| File | Reason |
|------|--------|
| `src/components/workout-tracker/*` | Old folder, replaced by `tracker/` |

---

## Implementation Order

1. Update type definitions (`src/types/workout-tracker.ts`)
2. Rewrite hook (`src/hooks/useWorkoutTracker.ts`)
3. Create SetRow component
4. Create ExerciseLogger component
5. Create WorkoutSummary component
6. Rewrite ActiveWorkout using new components
7. Rewrite StartWorkoutModal
8. Rewrite WorkoutStats
9. Rewrite WorkoutHistory
10. Update WorkoutTracker main component
11. Rename folder and update imports
12. Delete old files
