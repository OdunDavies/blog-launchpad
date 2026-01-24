

# Add "General Fitness / Balanced" Goal Option

## Context
The current training goals (Strength, Hypertrophy, Endurance, Weight Loss) are mutually exclusive in terms of exercise parameters - you can't do 3-8 reps AND 15-25 reps at the same time. However, adding a **"General Fitness"** option would give users a balanced program that incorporates elements from multiple training styles.

## What This Option Would Do
- Create a varied program with different rep ranges across exercises
- Include some heavy compound work (strength)
- Include moderate rep accessory work (hypertrophy)  
- Include higher rep finishers or conditioning (endurance)
- Provide a well-rounded approach for those who don't want to specialize

## Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/workout-wizard/StepGoal.tsx` | Add "General Fitness" option with new icon |
| `supabase/functions/generate-workout/index.ts` | Add exercise parameters for "general" goal |

### UI Changes
Add a fifth goal card:

| Goal | Label | Description |
|------|-------|-------------|
| `general` | General Fitness | Well-rounded training for overall fitness |

Icon suggestion: `Activity` (represents balanced movement) or `Layers` (represents variety)

### Backend Changes
Add to the edge function's exercise parameters:

```text
- General Fitness: Mix of rep ranges
  • Compound exercises: 4 sets, 6-10 reps, 90-120 sec rest
  • Accessory exercises: 3 sets, 10-15 reps, 60-90 sec rest
  • Finisher exercises: 2-3 sets, 15-20 reps, 45-60 sec rest
```

This creates variety within each workout while still being a cohesive program.

---

## Alternative Considered
A literal "Select All" checkbox was considered, but rejected because:
1. Goals have conflicting parameters (can't do 5 reps AND 20 reps)
2. Would require complex blending logic
3. A "General Fitness" option achieves the same user intent more elegantly

---

## Benefits
- Users who don't have a specific goal get an appropriate option
- Creates varied, interesting workouts
- Avoids the confusion of selecting conflicting goals
- Simple to implement - just one new option

