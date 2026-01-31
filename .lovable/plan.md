
# Fix Mobile Touch Scrolling in Workout Plan Editor

## Problem Summary

When editing an exercise plan on mobile, users cannot scroll through the list of exercises or the page. However, if they click on the "search exercise" box and go back, scrolling works again. This is a classic DnD Kit touch conflict issue.

## Root Cause Analysis

The issue is in `WorkoutGenerator.tsx` at lines 86-92:

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);
```

**Why this causes the bug:**

1. **PointerSensor captures ALL touch events** - It intercepts touch gestures to detect potential drags, which blocks native touch scrolling on mobile
2. **Distance-based activation doesn't distinguish swipe direction** - An 8px movement in any direction (including vertical scroll) triggers drag mode consideration
3. **The "search box workaround"** - When users focus the search input, the browser regains touch event control temporarily, which is why scrolling works after interacting with the input

## Solution

Replace `PointerSensor` with separate `MouseSensor` and `TouchSensor` sensors:

- **MouseSensor**: For desktop pointer interactions (click and drag)
- **TouchSensor**: For touch devices with a **delay-based activation** - users can scroll immediately, but must press-and-hold to initiate a drag

This is the official DnD Kit recommendation for sortable lists on touch devices.

---

## File Changes

### `src/components/WorkoutGenerator.tsx`

**1. Update imports (line 21):**

```text
Before:
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

After:
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
```

**2. Update sensor configuration (lines 85-92):**

```text
Before:
// DnD sensors
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);

After:
// DnD sensors - separate Mouse and Touch for proper mobile scrolling
const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8, // 8px movement before drag activates (desktop)
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms press-and-hold before drag activates (mobile)
      tolerance: 5, // 5px movement allowed during delay
    },
  })
);
```

---

## Technical Explanation

| Sensor | Device | Activation | Result |
|--------|--------|------------|--------|
| `MouseSensor` | Desktop | Move 8px | Immediate drag, like before |
| `TouchSensor` | Mobile | Hold 200ms | Scroll works normally; hold to drag |

The **delay-based activation** for touch is the key fix:

- **Immediate swipes** = normal page/content scrolling
- **Press and hold (200ms)** = drag mode activates for reordering

The `tolerance: 5` allows for small finger movements during the delay period without canceling the drag activation.

---

## Why the Search Box "Fixes" It Temporarily

When users tap the search input:
1. The input gains focus, triggering a keyboard appearance
2. The browser takes control of touch events for text input
3. The DndContext temporarily loses event priority
4. When focus leaves, there's a brief window where native scrolling works

This is a race condition between DnD Kit's event listeners and the browser's focus handling, not a real fix.

---

## Expected Result

After this change:
- Users can scroll through their workout plan normally on mobile
- To reorder exercises, users press and hold for 200ms, then drag
- Desktop behavior remains unchanged (8px movement to drag)
- The drag handle grip icon still provides a visual cue for dragging
