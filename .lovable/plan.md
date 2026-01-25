
# Fix Mobile Pop-up Overflow Issues

## Problem Summary

Pop-ups (dialogs) stretch beyond the screen edges on mobile devices because:
1. They use `w-full max-w-lg` without horizontal margins on mobile
2. They lack proper mobile-specific height constraints
3. Some modals use fixed height values (like `h-[80vh]`) that don't account for mobile viewport quirks

## Root Cause Analysis

Looking at the current dialog implementations:

**dialog.tsx (base component):**
```css
w-full max-w-lg ... p-6
```
- No horizontal margins means dialog touches screen edges
- No maximum height means content can overflow vertically
- Fixed `p-6` padding takes up too much space on small screens

**AddFoodModal.tsx:**
```css
max-w-md max-h-[85vh]
```
- Missing horizontal margin/inset
- Large padding consumes valuable mobile space

**ExercisePickerModal.tsx:**
```css
max-w-2xl h-[80vh]
```
- Fixed height can cause issues with mobile dynamic viewport
- No responsive width adjustments

## Solution

### Strategy
Use mobile-first responsive classes to:
1. Add horizontal margins on mobile (using `inset-x-4` or margins)
2. Use safe viewport height (`dvh` or fallback with margins)
3. Reduce padding on mobile devices
4. Convert Dialog to Drawer on mobile for better UX (following existing pattern in StartWorkoutModal)

---

## File Changes

### 1. `src/components/ui/dialog.tsx`

Update DialogContent base styles to be mobile-responsive:

**Line 39 - Update className:**
```text
Before:
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg overflow-hidden duration-200 ..."

After:
"fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg overflow-hidden max-h-[calc(100dvh-2rem)] duration-200 ..."
```

Key changes:
- `w-[calc(100%-2rem)]` - 16px margin on each side for mobile
- `p-4 sm:p-6` - Reduced padding on mobile
- `max-h-[calc(100dvh-2rem)]` - Prevent vertical overflow using dynamic viewport height

---

### 2. `src/components/ui/alert-dialog.tsx`

Update AlertDialogContent to match dialog mobile constraints:

**Line 37 - Update className:**
```text
Before:
"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 ..."

After:
"fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg overflow-hidden max-h-[calc(100dvh-2rem)] duration-200 ..."
```

---

### 3. `src/components/AddFoodModal.tsx`

Convert to use Drawer on mobile (like StartWorkoutModal does):

**Add imports and hook:**
```typescript
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
```

**Use hook in component:**
```typescript
const isMobile = useIsMobile();
```

**Render Drawer on mobile, Dialog on desktop:**
- Extract content into a shared component
- Return Drawer for mobile, Dialog for desktop

---

### 4. `src/components/ExercisePickerModal.tsx`

Convert to use Drawer on mobile:

**Add imports and hook:**
```typescript
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
```

**Update DialogContent:**
```text
Before:
<DialogContent className="max-w-2xl h-[80vh] flex flex-col overflow-hidden">

After (for desktop):
<DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
```

**Render Drawer on mobile:**
```typescript
if (isMobile) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Add Exercise{dayFocus && ` to ${dayFocus}`}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 flex flex-col flex-1 min-h-0">
          {/* Search, filter, and exercise list content */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

---

### 5. `src/components/ui/drawer.tsx`

Add safe area and overflow handling to DrawerContent:

**Line 34 - Update className:**
```text
Before:
"fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background"

After:
"fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[90dvh] flex-col rounded-t-[10px] border bg-background overflow-hidden"
```

This ensures drawers don't exceed viewport height on any device.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/ui/dialog.tsx` | Add mobile width margins, responsive padding, max-height constraint |
| `src/components/ui/alert-dialog.tsx` | Same mobile-responsive constraints as dialog |
| `src/components/AddFoodModal.tsx` | Convert to Drawer on mobile using `useIsMobile` hook |
| `src/components/ExercisePickerModal.tsx` | Convert to Drawer on mobile using `useIsMobile` hook |
| `src/components/ui/drawer.tsx` | Add `max-h-[90dvh]` and `overflow-hidden` to prevent overflow |

---

## Expected Results

After these changes:
- Dialogs will have 16px margins on mobile screens (won't touch edges)
- Maximum height will be constrained to viewport minus safe margins
- Padding will be reduced on mobile for more content space
- Add Food and Add Exercise modals will use bottom sheet (Drawer) on mobile for better touch UX
- Vertical overflow will be handled properly with internal scrolling
