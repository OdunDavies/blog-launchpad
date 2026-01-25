
# Mobile UI/UX Optimization Plan

## Problem Summary
The MuscleAtlas app has several components that don't adapt well to mobile screens (< 768px), causing cramped layouts, text overflow, and poor touch targets. This plan addresses all mobile UX issues across the application.

---

## Phase 1: Main Navigation Tabs

### Task 1.1: Responsive Tab Navigation
**File:** `src/pages/Index.tsx`

Current issue: 5 tabs in `grid-cols-5` become unreadable on mobile.

**Solution:**
- On mobile: Show only icons (no text labels)
- Add horizontal scroll capability for very small screens
- Increase touch target size for mobile

```text
Mobile View:
[📚] [📋] [✨] [🥗] [📝]

Desktop View:
[📚 Library] [📋 Templates] [✨ AI Workout] [🥗 AI Diet] [📝 Tracker]
```

**Changes:**
- Update TabsList to use `overflow-x-auto` with `scrollbar-hide` on mobile
- Hide ALL tab text on mobile (not just partial words)
- Use `flex` instead of `grid` for more flexible spacing
- Increase TabsTrigger padding for better touch targets

---

## Phase 2: Active Workout Tracker

### Task 2.1: Mobile-Optimized Set Logging
**File:** `src/components/workout-tracker/ActiveWorkout.tsx`

Current issue: 5-column grid for sets is too cramped on mobile.

**Solution:**
- Stack weight/reps inputs vertically on mobile
- Use a card-based layout for each set instead of grid
- Make Warmup/Working toggle full-width on mobile

```text
Mobile Layout (each set):
+---------------------------+
| Set 1              [🗑️]  |
| Weight: [____] kg         |
| Reps:   [____]            |
| [Warmup] [Working]        |
+---------------------------+

Desktop Layout (unchanged):
| Set | Weight | Reps | Type    | X |
| 1   | [80]   | [8]  | Working | X |
```

**Changes:**
- Add responsive breakpoint classes
- Use `flex flex-col sm:grid sm:grid-cols-[40px_1fr_1fr_1fr_40px]`
- Make inputs larger for touch (`h-10` instead of `h-9`)
- Increase spacing on mobile

### Task 2.2: Mobile-Optimized Header
**File:** `src/components/workout-tracker/ActiveWorkout.tsx`

Current issue: Timer, buttons, and session info crowd the header on mobile.

**Solution:**
- Stack session info and controls vertically on mobile
- Make timer more prominent
- Full-width buttons on mobile

---

## Phase 3: Workout History

### Task 3.1: Mobile-Friendly Session Cards
**File:** `src/components/workout-tracker/WorkoutHistory.tsx`

Current issue: Date, duration, and volume stats overflow on mobile.

**Solution:**
- Stack metadata vertically on mobile
- Use wrapping flex layout
- Reduce text size on mobile

```text
Mobile Layout:
+---------------------------+
| Push Day          [🗑️] ⌄ |
| 📅 Today                  |
| ⏱️ 45m  💪 12.5k kg      |
+---------------------------+
```

---

## Phase 4: Start Workout Modal

### Task 4.1: Mobile-Optimized Modal
**File:** `src/components/workout-tracker/StartWorkoutModal.tsx`

Current issue: Dialog content can be too wide on mobile.

**Solution:**
- Use `Drawer` component on mobile instead of `Dialog`
- Full-width on mobile with proper padding
- Larger touch targets for plan/template selection

---

## Phase 5: Workout Stats Dashboard

### Task 5.1: Mobile Stats Grid
**File:** `src/components/workout-tracker/WorkoutStats.tsx`

Current issue: Stats cards are cramped on mobile.

**Solution:**
- Use 2-column grid on mobile with scrollable overflow
- Reduce card padding on mobile
- Stack icon and value vertically on very small screens

---

## Phase 6: Diet Generator Wizard

### Task 6.1: Mobile Wizard Progress
**File:** `src/components/DietGenerator.tsx`

Current issue: 7-step wizard progress indicator takes too much space.

**Solution:**
- Show step numbers only (no titles) on mobile
- Use compact step indicators
- Horizontal scroll for step navigation

### Task 6.2: Mobile-Friendly Wizard Steps
**Files:** `src/components/diet-wizard/*.tsx`

**Solution:**
- Full-width option cards on mobile
- Increase tap targets
- Reduce padding/margins on mobile
- Single column grids on mobile

---

## Phase 7: Profile Components

### Task 7.1: Mobile Header Optimization
**Files:** `src/pages/Index.tsx`, `src/components/ProfileStatusBadge.tsx`

Current issue: Header can get crowded on mobile.

**Solution:**
- Collapse ProfileStatusBadge to icon-only on mobile
- Use a smaller logo on mobile
- Add proper spacing

### Task 7.2: Mobile Profile Editor
**File:** `src/components/ProfileEditor.tsx`

**Solution:**
- Sheet component already works well on mobile
- Ensure input fields have proper spacing
- Add scroll behavior for keyboard

---

## Phase 8: Global Mobile Styles

### Task 8.1: Add Utility Classes
**File:** `src/index.css`

Add mobile-first utility classes:
- `.scrollbar-hide` - Hide scrollbars for horizontal scroll areas
- `.touch-target` - Minimum 44px touch targets
- `.mobile-card` - Optimized card padding for mobile

---

## Technical Implementation Details

### Responsive Breakpoints Used
- `sm:` (640px) - Small tablets
- `md:` (768px) - Tablets/small laptops (main mobile breakpoint)
- `lg:` (1024px) - Desktops

### Key Mobile Patterns
1. **Icon-only navigation** on mobile
2. **Stacked layouts** instead of horizontal grids
3. **Drawer/Sheet** instead of Dialog for modals
4. **Larger touch targets** (min 44px)
5. **Horizontal scroll** instead of wrapping/hiding

---

## File Changes Summary

| File | Change Type |
|------|-------------|
| `src/pages/Index.tsx` | Modify - Responsive tabs |
| `src/components/workout-tracker/ActiveWorkout.tsx` | Modify - Mobile set logging |
| `src/components/workout-tracker/WorkoutHistory.tsx` | Modify - Mobile cards |
| `src/components/workout-tracker/StartWorkoutModal.tsx` | Modify - Mobile modal/drawer |
| `src/components/workout-tracker/WorkoutStats.tsx` | Modify - Mobile stats grid |
| `src/components/DietGenerator.tsx` | Modify - Mobile wizard |
| `src/components/diet-wizard/*.tsx` | Modify - Mobile option cards |
| `src/components/ProfileStatusBadge.tsx` | Modify - Mobile-compact |
| `src/components/HeroSection.tsx` | Modify - Mobile stats |
| `src/index.css` | Modify - Add utility classes |

---

## Implementation Order

1. **Global styles** (CSS utilities)
2. **Main navigation** (Index.tsx tabs)
3. **Active Workout** (highest interaction frequency)
4. **Start Workout Modal** (convert to Drawer on mobile)
5. **Workout History** (viewing past workouts)
6. **Stats Dashboard** (overview)
7. **Diet Generator** (wizard flow)
8. **Profile components** (finishing touches)
