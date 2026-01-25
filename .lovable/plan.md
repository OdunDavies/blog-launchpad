

# Implementation Plan: Update Exercise Videos and Images

## Overview

Update the 3 new leg exercises (Sumo Squat, Step Ups, Bulgarian Split Squat) with:
1. **Specific YouTube training videos** from reputable fitness channels
2. **Cover images** from liftmanual.com (consistent with existing exercises)

---

## Current State

The exercises were added but are missing `imageUrl` properties and have placeholder video URLs:

| Exercise | Current Video | Current Image |
|----------|---------------|---------------|
| Sumo Squat | `9ZuXKqRbT9k` | None (fallback used) |
| Step Ups | `dQqApCGd5Ss` | None (fallback used) |
| Bulgarian Split Squat | `2C-uNgKwPLE` | None (fallback used) |

---

## Updated Exercise Data

### 1. Sumo Squat

**Video**: Physical Therapist tutorial - clear form demonstration
```text
videoUrl: 'https://www.youtube.com/embed/u2oXPmPH0hA'
```
Source: "How to Do Sumo Squats: A Guide from Physical Therapists"

**Image**: Liftmanual.com (consistent with other exercises)
```text
imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/sumo-squat.jpg'
```

---

### 2. Step Ups

**Video**: Buff Dudes detailed tutorial with proper form
```text
videoUrl: 'https://www.youtube.com/embed/DeCnHqrN22U'
```
Source: "How To Perform Bulgarian Split Squats | Legs Exercise Tutorial" by Buff Dudes

**Image**: Liftmanual.com dumbbell step up image
```text
imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-step-up.jpg'
```

---

### 3. Bulgarian Split Squat

**Video**: Coach Kelly detailed tutorial with bias variations
```text
videoUrl: 'https://www.youtube.com/embed/9FOMyxA3Lw4'
```
Source: "HOW TO DO A BULGARIAN SPLIT SQUAT | Coach Kelly Cues" - includes glute/quad bias variations

**Image**: Liftmanual.com bulgarian split squat
```text
imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bulgarian-split-squat.jpg'
```

---

## File Changes

### `src/data/exercises.ts`

Update the 3 exercise entries at lines 432-482:

**Sumo Squat** (lines 432-448):
- Change `videoUrl` to: `https://www.youtube.com/embed/u2oXPmPH0hA`
- Add `imageUrl`: `https://liftmanual.com/wp-content/uploads/2023/04/sumo-squat.jpg`

**Step Ups** (lines 449-465):
- Change `videoUrl` to: `https://www.youtube.com/embed/DeCnHqrN22U`
- Add `imageUrl`: `https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-step-up.jpg`

**Bulgarian Split Squat** (lines 466-482):
- Change `videoUrl` to: `https://www.youtube.com/embed/9FOMyxA3Lw4`
- Add `imageUrl`: `https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bulgarian-split-squat.jpg`

---

## Video Selection Rationale

| Exercise | Channel | Why Selected |
|----------|---------|--------------|
| Sumo Squat | Physical Therapists | Professional instruction, injury prevention focus |
| Step Ups | Buff Dudes | Popular fitness channel, clear tutorial format |
| Bulgarian Split Squat | Coach Kelly | Detailed cues, covers quad vs glute bias variations |

---

## Image Source

All images from **liftmanual.com** - the same source used by 60+ other exercises in the library. This ensures:
- Consistent visual style across the exercise library
- Professional exercise demonstration photos
- Reliable image hosting

---

## Summary

| Change | Details |
|--------|---------|
| File | `src/data/exercises.ts` |
| Lines Modified | 432-482 |
| Videos Updated | 3 (new YouTube embed URLs) |
| Images Added | 3 (liftmanual.com URLs) |

