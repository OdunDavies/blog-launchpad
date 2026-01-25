
# Fix Pop-up Scrolling on Mobile Devices

## Problem Summary

The **Add Food** and **Add Exercise** popups don't scroll on mobile/tablet when you try to swipe. Touch scrolling simply does nothing - the content stays frozen.

## Root Cause Analysis

The issue stems from multiple factors:

1. **ScrollArea Viewport Missing `overflow-y: auto`**
   The Radix `ScrollAreaPrimitive.Viewport` in `src/components/ui/scroll-area.tsx` doesn't explicitly set `overflow-y: auto`, which can cause issues on touch devices.

2. **DialogContent Height Constraints**
   The dialog content uses `max-h-[85vh]` but the internal layout doesn't properly cascade fixed heights to the ScrollArea, so the ScrollArea has no bounded container to overflow within.

3. **Global CSS Override Conflict**
   The global CSS in `src/index.css` forces `overflow-y: scroll !important` on html/body, which can interfere with touch gesture handling inside overlays on mobile.

4. **Missing Touch Scroll Styles**
   Mobile touch scrolling works best with explicit `-webkit-overflow-scrolling: touch` and `overscroll-behavior` properties.

---

## Solution

### File 1: `src/components/ui/scroll-area.tsx`

Add explicit overflow and touch-friendly scrolling to the Viewport component:

**Change (line 11):**
```text
Before:
<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">

After:
<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit] overflow-y-auto overscroll-contain">
```

---

### File 2: `src/components/AddFoodModal.tsx`

Fix the dialog and ScrollArea container structure:

**Change DialogContent (line 103):**
```text
Before:
<DialogContent className="max-w-md max-h-[85vh] flex flex-col">

After:
<DialogContent className="max-w-md max-h-[85vh] flex flex-col overflow-hidden">
```

**Change ScrollArea container (line 143):**
```text
Before:
<ScrollArea className="flex-1 -mx-4 px-4">

After:
<ScrollArea className="flex-1 -mx-4 px-4 min-h-0">
```

---

### File 3: `src/components/ExercisePickerModal.tsx`

Fix the dialog container structure:

**Change DialogContent (line 72):**
```text
Before:
<DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">

After:
<DialogContent className="max-w-2xl h-[80vh] flex flex-col overflow-hidden">
```

This changes `max-h` to fixed `h` so the ScrollArea inside has a definite height to work with.

---

### File 4: `src/index.css`

Add mobile-friendly scroll styles and fix the global override:

**Replace lines 216-218:**
```text
Before:
html:not(.modal-open),
html:not(.modal-open) body {
  overflow-y: scroll !important;
}

After:
/* Mobile-friendly scrolling for modals and scroll areas */
[data-radix-scroll-area-viewport] {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Ensure dialogs don't block touch scrolling */
[data-radix-dialog-content] {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
```

This removes the aggressive `!important` override and instead adds touch-friendly styles specifically to Radix scroll areas and dialogs.

---

### File 5: `src/components/ui/dialog.tsx`

Add `overflow-hidden` to prevent double scrollbars and ensure content stays contained:

**Change DialogContent (line 39):**
```text
Before:
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg ..."

After:
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg overflow-hidden ..."
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/ui/scroll-area.tsx` | Add `overflow-y-auto overscroll-contain` to Viewport |
| `src/components/AddFoodModal.tsx` | Add `overflow-hidden` to DialogContent, add `min-h-0` to ScrollArea |
| `src/components/ExercisePickerModal.tsx` | Change `max-h-[80vh]` to `h-[80vh]` for fixed height |
| `src/index.css` | Replace aggressive override with touch-friendly Radix-specific styles |
| `src/components/ui/dialog.tsx` | Add `overflow-hidden` to DialogContent base styles |

---

## Expected Result

After these changes:
- Touch scrolling will work inside the Add Food and Add Exercise popups on mobile
- The scroll indicator will appear when content overflows
- Swiping inside the popup will scroll the content, not the background page
- Desktop scrolling will continue to work normally
