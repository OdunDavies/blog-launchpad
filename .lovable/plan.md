
# Fix: Enable Saved Plans in Start Workout Modal

## Problem
When users try to start a workout, their saved AI-generated plans don't appear as an option. This is because the `StartWorkoutModal` is looking for plans at the wrong location.

## Root Cause
The Workout Generator saves plans to localStorage with key `'workout-planner-saved-plans'`, but the Start Workout Modal looks for `'muscleatlas-saved-plans'`. Additionally, there's a field name mismatch (`savedAt` vs `createdAt`).

## Solution
Update the `StartWorkoutModal` to:
1. Read from the correct localStorage key (`'workout-planner-saved-plans'`)
2. Map the `savedAt` field to `createdAt` for display
3. Import shared types for consistency

---

## Implementation Details

### File: `src/components/tracker/StartWorkoutModal.tsx`

**Change 1: Update localStorage key**
```typescript
// Before (line 46)
const saved = localStorage.getItem('muscleatlas-saved-plans');

// After
const saved = localStorage.getItem('workout-planner-saved-plans');
```

**Change 2: Update SavedPlan interface to match actual data**
```typescript
// Current interface (lines 25-31)
interface SavedPlan {
  id: string;
  name: string;
  goal: string;
  schedule: TemplateDay[];
  createdAt: string;
}

// Updated interface to match WorkoutGenerator
interface SavedPlan {
  id: string;
  name: string;
  goal: string;
  splitDays: number;
  gender: string;
  targetMuscles: string[];
  schedule: TemplateDay[];
  savedAt: string;  // Changed from createdAt
}
```

**Change 3: Update date display (line 247)**
```typescript
// Before
Created {new Date(plan.createdAt).toLocaleDateString()}

// After
Saved {new Date(plan.savedAt).toLocaleDateString()}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracker/StartWorkoutModal.tsx` | Update localStorage key, fix interface, update date field |

## Expected Outcome
After this fix:
- Users will see their saved workout plans when clicking "Start Workout"
- The "Saved AI Plans" option will appear with the correct plan count
- Clicking a saved plan shows the day selection with all exercises pre-populated
- Starting a workout from a saved plan correctly logs the source as `'ai-generated'`

## Notes
- The schedule structure (`TemplateDay[]`) is already compatible - no data transformation needed
- Existing saved plans will immediately become visible without any migration
