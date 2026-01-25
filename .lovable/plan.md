

# Implementation Plan: Add Exercises, Show Protein, and Fix Scrolling

## Overview

This plan addresses three requests:
1. **Investigate scrolling** - Check and fix any potential scroll issues
2. **Add 3 new exercises** - Sumo Squats, Step Ups, Bulgarian Split Squats
3. **Show protein content** - Display protein information for individual food items

---

## Task 1: Investigate Scrolling Issue

### Current State
From the screenshot, the page appears to render correctly with the full content visible. The CSS already includes proper scroll properties:

```text
html { scroll-behavior: smooth; overflow-y: auto; height: auto; }
body { min-height: 100vh; overflow-y: auto; }
```

### Potential Causes
Since no obvious issue is visible, the scroll problem may be:
- A specific component or modal blocking scroll
- An interaction state (e.g., after opening a popup)
- A mobile-specific issue

### Fix Approach
Add a safety reset to ensure `html` and `body` never get `overflow: hidden` stuck on them, and verify no nested containers are trapping scroll.

---

## Task 2: Add 3 New Leg Exercises

### File to Modify
`src/data/exercises.ts`

### Exercises to Add

| Exercise | Primary Muscles | Secondary | Equipment | Difficulty |
|----------|----------------|-----------|-----------|------------|
| Sumo Squat | quads, glutes | hamstrings, abs | Barbell or Bodyweight | beginner |
| Step Ups | quads, glutes | hamstrings, calves | Bench/Box, Dumbbells | beginner |
| Bulgarian Split Squat | quads, glutes | hamstrings | Bench, Dumbbells | intermediate |

### Exercise Data Entries

```text
Sumo Squat
- Wide stance with toes pointed out
- Descend keeping chest up
- Drive through heels
- Good for inner thigh emphasis

Step Ups
- Step onto raised platform
- Drive through front heel
- Fully extend at top
- Step down with control

Bulgarian Split Squat
- Rear foot elevated on bench
- Lower until front thigh parallel
- Keep torso upright
- Push through front heel
```

---

## Task 3: Show Protein Content in MealCard

### File to Modify
`src/components/MealCard.tsx`

### Current Display
Each food item currently shows:
- Name
- Portion
- Calories only

### Improved Display
Show protein alongside calories for each food:

```text
Before:  "Grilled Chicken Breast" - 165 cal
After:   "Grilled Chicken Breast" - 165 cal | 31g protein
```

This helps users quickly identify protein-rich foods when editing their meal plans.

---

## Implementation Details

### File 1: `src/data/exercises.ts`

Insert 3 new exercise entries in the LEGS section (after Hip Thrust, before CORE):

```text
{
  id: 'sumo-squat',
  name: 'Sumo Squat',
  primaryMuscles: ['quads', 'glutes'],
  secondaryMuscles: ['hamstrings', 'abs'],
  equipment: 'Barbell, Dumbbell, or Bodyweight',
  difficulty: 'beginner',
  videoUrl: 'https://www.youtube.com/embed/9ZuXKqRbT9k',
  instructions: [
    'Stand with feet wider than shoulder-width, toes pointed out 45 degrees',
    'Keep chest up and core engaged',
    'Lower by pushing hips back and bending knees',
    'Descend until thighs are parallel or below',
    'Drive through heels to stand'
  ],
  category: 'legs'
}
```

```text
{
  id: 'step-ups',
  name: 'Step Ups',
  primaryMuscles: ['quads', 'glutes'],
  secondaryMuscles: ['hamstrings', 'calves'],
  equipment: 'Bench or Box, Dumbbells (optional)',
  difficulty: 'beginner',
  videoUrl: 'https://www.youtube.com/embed/dQqApCGd5Ss',
  instructions: [
    'Stand facing a sturdy bench or box',
    'Step up with one foot, driving through the heel',
    'Bring the other foot up to stand on platform',
    'Step back down with control',
    'Alternate legs or complete all reps on one side'
  ],
  category: 'legs'
}
```

```text
{
  id: 'bulgarian-split-squat',
  name: 'Bulgarian Split Squat',
  primaryMuscles: ['quads', 'glutes'],
  secondaryMuscles: ['hamstrings'],
  equipment: 'Bench, Dumbbells (optional)',
  difficulty: 'intermediate',
  videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE',
  instructions: [
    'Stand about 2 feet in front of a bench',
    'Place rear foot on bench behind you',
    'Lower until front thigh is parallel to ground',
    'Keep torso upright and core tight',
    'Push through front heel to stand'
  ],
  category: 'legs'
}
```

### File 2: `src/components/MealCard.tsx`

Update the food item display (around line 87-89) to include protein:

```text
Current:
<span className="text-xs text-muted-foreground whitespace-nowrap">
  {food.calories} cal
</span>

Updated:
<span className="text-xs text-muted-foreground whitespace-nowrap">
  {food.calories} cal | {food.protein}g protein
</span>
```

### File 3: `src/index.css`

Add safety styles to prevent scroll lock:

```text
/* At the end of the file */
html, body {
  overflow-y: auto !important;
  height: auto !important;
}
```

This ensures modals or other components cannot accidentally lock the page scroll.

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/data/exercises.ts` | Add 3 new leg exercises (Sumo Squat, Step Ups, Bulgarian Split Squat) |
| `src/components/MealCard.tsx` | Display protein content for each food item |
| `src/index.css` | Add scroll safety reset styles |

---

## Expected Results

1. **Scrolling**: Page will reliably scroll even after modal interactions
2. **Exercise Library**: Users will find Sumo Squats, Step Ups, and Bulgarian Split Squats when filtering by legs/quads/glutes
3. **Diet Plans**: Each food item will show both calories AND protein (e.g., "165 cal | 31g protein") making it easier to track protein intake

