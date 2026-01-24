
# Workout Tracker Implementation Plan

## Overview
Add a comprehensive workout tracking feature that allows users to log their workouts, track exercise progress (weight, reps, sets), view workout history, and analyze performance trends over time.

## Current State Analysis
- **Existing workout system**: Workout Generator and Templates create/manage workout plans
- **Data storage pattern**: Currently uses `localStorage` for saved plans (similar pattern in `useFavorites.ts`)
- **Database**: Supabase with `shared_workouts` table for sharing; no user-specific data storage
- **No authentication**: App is currently public/anonymous

## Feature Scope

### Core Tracking Features
1. **Log Workouts** - Record completed workout sessions
2. **Track Exercise Performance** - Weight, sets, reps for each exercise
3. **Workout History** - View past workout sessions
4. **Progress Charts** - Visualize strength gains over time
5. **Personal Records (PRs)** - Track and celebrate new PRs

## Architecture Decision

Since the app currently has no authentication and uses localStorage for saved workout plans, this implementation will follow the same pattern:
- **Local Storage** for workout logs (immediate, offline-capable)
- Data structure designed for future database migration if authentication is added

---

## Implementation Details

### 1. Create Type Definitions
**New File:** `src/types/workout-tracker.ts`

```typescript
interface WorkoutSet {
  setNumber: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isWarmup?: boolean;
  isPR?: boolean;
}

interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

interface WorkoutLog {
  id: string;
  date: string; // ISO date
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  workoutName?: string;
  templateId?: string; // If started from a template
  exercises: LoggedExercise[];
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
}

interface ExerciseHistory {
  exerciseId: string;
  logs: Array<{
    date: string;
    bestSet: WorkoutSet; // Heaviest weight with good reps
  }>;
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
  };
}
```

### 2. Create Workout Tracker Hook
**New File:** `src/hooks/useWorkoutTracker.ts`

Features:
- Load/save workout logs from localStorage
- Start new workout session (blank or from template)
- Add/update/remove exercises and sets
- Calculate duration
- Detect and mark Personal Records
- Get exercise history for a specific exercise

### 3. Create Workout Tracker Components

**New Files:**

| File | Purpose |
|------|---------|
| `src/components/WorkoutTracker.tsx` | Main container with tabs for Active/History/Stats |
| `src/components/tracker/ActiveWorkout.tsx` | Current workout session UI |
| `src/components/tracker/WorkoutHistory.tsx` | List of past workouts with filters |
| `src/components/tracker/WorkoutStats.tsx` | Progress charts and PR board |
| `src/components/tracker/ExerciseLogger.tsx` | Set-by-set input for each exercise |
| `src/components/tracker/SetRow.tsx` | Individual set input (weight/reps) |
| `src/components/tracker/WorkoutSummary.tsx` | Post-workout summary modal |
| `src/components/tracker/StartWorkoutModal.tsx` | Choose blank or from template |

### 4. Update Index Page
**File:** `src/pages/Index.tsx`

Add new tab "Tracker" alongside existing Library, Templates, Workout, Diet tabs.

```text
[Library] [Templates] [AI Workout] [AI Diet] [Tracker] <-- NEW
```

### 5. Active Workout UI Flow

```text
+----------------------------------+
|  Active Workout                  |
|  Started: 2:30 PM | Duration: 45m|
+----------------------------------+
|                                  |
|  [Bench Press]              [PR] |
|  +----+--------+------+-------+  |
|  |Set | Weight | Reps | Check |  |
|  +----+--------+------+-------+  |
|  | W  | 45 kg  |  10  |  [x]  |  |
|  | 1  | 80 kg  |   8  |  [x]  |  |
|  | 2  | 85 kg  |   6  |  [ ]  |  |
|  +----+--------+------+-------+  |
|  [+ Add Set]                     |
|  Last: 80kg x 8 on Jan 20        |
|                                  |
|  [Incline Dumbbell Press]        |
|  ...                             |
|                                  |
|  [+ Add Exercise]                |
|                                  |
+----------------------------------+
| [Cancel]          [Finish] |
+----------------------------------+
```

### 6. History View

- Calendar heat map showing workout frequency
- List view with filters (date range, exercise, muscle group)
- Click to view full workout details
- Option to repeat a past workout

### 7. Stats/Progress View

- **Exercise Progress Charts** using Recharts (already installed)
  - Line chart showing weight progression over time
  - Volume chart (total weight lifted per session)
- **Personal Records Board**
  - Grid of exercises with current PR weight/reps
  - Celebration animation when new PR is set
- **Weekly/Monthly summaries**
  - Total workouts
  - Total volume
  - Most trained muscle groups

### 8. Integration with Existing Features

| Feature | Integration |
|---------|-------------|
| **Workout Templates** | "Start Workout" button pre-fills tracker with template exercises |
| **Generated Workouts** | Same "Start Workout" button |
| **Exercise Library** | Show exercise history when viewing an exercise |
| **Exercise Picker** | Reuse existing modal for adding exercises to workout |

---

## File Changes Summary

### New Files
| Path | Description |
|------|-------------|
| `src/types/workout-tracker.ts` | Type definitions |
| `src/hooks/useWorkoutTracker.ts` | State management hook |
| `src/components/WorkoutTracker.tsx` | Main tracker component |
| `src/components/tracker/ActiveWorkout.tsx` | Active session UI |
| `src/components/tracker/WorkoutHistory.tsx` | History list |
| `src/components/tracker/WorkoutStats.tsx` | Charts and PRs |
| `src/components/tracker/ExerciseLogger.tsx` | Exercise set logging |
| `src/components/tracker/SetRow.tsx` | Individual set input |
| `src/components/tracker/WorkoutSummary.tsx` | Finish workout modal |
| `src/components/tracker/StartWorkoutModal.tsx` | Start options |

### Modified Files
| Path | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add Tracker tab |
| `src/components/WorkoutTemplates.tsx` | Add "Start Workout" button |
| `src/components/WorkoutGenerator.tsx` | Add "Start Workout" button for generated plans |

---

## Technical Implementation Notes

### localStorage Keys
```typescript
const WORKOUT_LOGS_KEY = 'muscleatlas-workout-logs';
const ACTIVE_WORKOUT_KEY = 'muscleatlas-active-workout';
const EXERCISE_PRS_KEY = 'muscleatlas-exercise-prs';
```

### PR Detection Logic
When a set is logged:
1. Compare weight x reps to stored PR for that exercise
2. If higher (using estimated 1RM formula), mark as PR
3. Show celebration toast with confetti animation

### Estimated 1RM Formula
```typescript
// Brzycki Formula
const estimated1RM = weight / (1.0278 - 0.0278 * reps);
```

### Unit Preferences
Store user's preferred weight unit (kg/lbs) in localStorage and persist across sessions.

---

## Benefits
- Track workout progress over time
- Celebrate personal records
- See exercise history when planning workouts
- Works offline with localStorage
- No account required (follows existing app pattern)
- Future-ready for database migration with auth
