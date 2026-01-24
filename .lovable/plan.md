
# Day Selection Flow for Workout Tracker

## Overview
Enhance the "Start Workout" flow to let users select which specific day they want to track from a multi-day template or personalized plan, instead of always defaulting to Day 1.

---

## Current Problem
- Templates like "Push Pull Legs" have 6 different days (Push, Pull, Legs x2)
- The current code only uses `template.schedule[0]` (first day)
- Users cannot track Day 2, Day 3, etc.

---

## Proposed User Flow

```text
+----------------------------------+
|  Start Workout                   |
+----------------------------------+
|                                  |
|  [Empty Workout] - Add exercises |
|                                  |
|  [From Template] - Pre-made      |
|                                  |
|  [From My Plans] - AI generated  |
|                                  |
+----------------------------------+

         ↓ (select Template)

+----------------------------------+
|  ← Back                          |
|  Select Template                 |
+----------------------------------+
|  [Push Pull Legs]                |
|  [Upper/Lower Split]             |
|  [Beginner Full Body]            |
|  ...                             |
+----------------------------------+

         ↓ (select PPL)

+----------------------------------+
|  ← Back                          |
|  Push Pull Legs - Choose Day     |
+----------------------------------+
|  [Day 1: Push]                   |
|     Bench Press, OHP, ...        |
|                                  |
|  [Day 2: Pull]                   |
|     Deadlift, Pull-ups, ...      |
|                                  |
|  [Day 3: Legs]                   |
|     Squats, RDL, ...             |
|  ...                             |
+----------------------------------+

         ↓ (select Day 2)

→ Workout starts with Day 2 exercises
```

---

## Implementation Plan

### 1. Update StartWorkoutModal.tsx

Add a new step state: `'choose' | 'source' | 'template' | 'day' | 'saved-plans' | 'saved-day'`

**New Flow:**
1. `choose` - Empty workout or From Template/My Plans
2. `template` - List of available templates
3. `day` - List of days in selected template
4. `saved-plans` - List of user's saved AI-generated plans  
5. `saved-day` - List of days in selected saved plan

**State Changes:**
- Add `selectedTemplate: WorkoutTemplate | null`
- Add `selectedSavedPlan: SavedPlan | null`
- Add `step` states for the new navigation

### 2. Create Day Selection UI Component

**New Component:** `DaySelector` (inline in modal or separate)

Display each day as a card showing:
- Day number and focus (e.g., "Day 1 - Push")
- Exercise count
- List of first 3-4 exercises as preview
- Click to select and start

### 3. Update Props Interface

```typescript
interface StartWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlank: (name?: string) => void;
  onStartFromTemplate: (
    templateId: string, 
    name: string, 
    dayName: string, // NEW: which day
    exercises: Array<{ exerciseId: string; exerciseName: string }>
  ) => void;
  savedPlans?: SavedPlan[]; // NEW: pass user's AI-generated plans
}
```

### 4. Update WorkoutTracker.tsx

Pass `savedPlans` from localStorage to the modal so users can also start from their personalized AI-generated plans.

### 5. Update WorkoutTemplates.tsx

Change `startWorkoutFromTemplate` to show a day picker dialog instead of immediately starting Day 1.

**Option A:** Open a sub-dialog for day selection
**Option B:** Add day selection inline in the template detail view

### 6. Update WorkoutGenerator.tsx

Same change - when clicking "Start Workout" on a generated plan, show day selection.

---

## UI/UX Details

### Day Card Design
Each day shown as a selectable card:
```text
┌─────────────────────────────────┐
│ Day 2                    6 exer │
│ Pull (Back, Biceps)             │
│ ─────────────────────────────── │
│ • Deadlift                      │
│ • Pull-Ups                      │
│ • Bent-Over Rows                │
│ • +3 more                       │
└─────────────────────────────────┘
```

### Back Navigation
Clear "← Back" button at each step to navigate back through the selection flow.

### Workout Name Auto-fill
Auto-generate workout name from selection:
- "Push Pull Legs - Day 2: Pull"
- Can still be overridden by user

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/tracker/StartWorkoutModal.tsx` | Add multi-step flow with day selection |
| `src/components/WorkoutTracker.tsx` | Pass saved plans to modal, update handler |
| `src/components/WorkoutTemplates.tsx` | Add day picker before starting workout |
| `src/components/WorkoutGenerator.tsx` | Add day picker for generated plans |

---

## Benefits

1. **Full template utilization** - Users can track any day of their program
2. **Progress continuity** - Track Day 2 on Tuesday, Day 3 on Wednesday, etc.
3. **Unified experience** - Same flow for templates and personalized plans
4. **Better workout names** - Auto-named with day info for clearer history
