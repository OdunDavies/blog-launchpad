

# Enhanced Diet Generator - Smart Meal Pairing & Custom Food Addition

## Problem Statement

1. **Illogical Meal Combinations**: The AI generates culturally inappropriate meal pairings like "boiled yam with ogbono soup" for breakfast. Ogbono soup is a heavy, draw-style soup typically eaten for lunch/dinner with swallows (eba, pounded yam, amala), not with boiled yam and certainly not for breakfast.

2. **Missing Add Food Feature**: Users can only remove foods when editing but cannot add their own custom meals or substitute foods.

---

## Solution Overview

### Phase 1: Improve AI Meal Pairing Logic

Update the edge function prompt with explicit **Nigerian meal pairing rules** to teach the AI:

**Swallow + Soup Pairings (Lunch/Dinner ONLY):**
- Eba, Pounded Yam, Amala, Fufu, Tuwo → Pair with: Egusi, Ogbono, Efo Riro, Afang, Edikang Ikong, Banga
- NEVER for breakfast
- Soups are NOT sides - they ARE the protein/vegetable component

**Yam/Plantain Rules:**
- Boiled Yam → Pair with: Egg sauce, Fried eggs, Fish stew, Palm oil sauce
- NOT with draw soups (ogbono, okra) - that's wrong culturally
- Fried Plantain (Dodo) → Goes with: Jollof rice, Fried rice, Beans, Eggs

**Breakfast Appropriate Foods:**
- International: Oatmeal, Eggs, Toast, Greek Yogurt, Smoothies
- Nigerian: Akara + Pap, Moi Moi + Custard, Bread + Eggs, Tea + Bread

**Snack Rules (Already Present but Need Reinforcement):**
- Snacks are NEVER swallow + soup combinations
- Snacks should be simple, portable, 1-3 items max

### Phase 2: Add Custom Food Modal

Create an `AddFoodModal` component that allows users to:

1. **Search from the food database** - Quick-add common foods
2. **Add custom foods** - Enter name, portion, calories, protein, carbs, fat manually
3. **Add to specific meal** - Select which meal to add the food to

**New State in DietGenerator:**
- `showAddFoodModal: boolean`
- `addFoodMealIndex: number` (which meal to add to)

**New Handler:**
- `handleAddFood(food: Food)` - Adds food to the specified meal and recalculates totals

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/generate-diet/index.ts` | Add Nigerian meal pairing rules to the prompt |
| `src/components/DietGenerator.tsx` | Add state and handlers for custom food addition |
| `src/components/MealCard.tsx` | Add "Add Food" button when editing |
| **NEW** `src/components/AddFoodModal.tsx` | Modal for adding custom foods |

---

### Phase 1: Edge Function Prompt Improvements

Add these explicit rules to the system prompt:

```text
=== NIGERIAN MEAL PAIRING RULES (CRITICAL) ===

SWALLOW + SOUP COMBINATIONS (Lunch/Dinner ONLY):
- Swallows: Eba, Pounded Yam, Amala, Fufu, Tuwo Shinkafa, Starch
- Pair ONLY with: Egusi, Ogbono, Efo Riro, Afang, Edikang Ikong, Oha, Banga, Nsala
- The soup IS the protein/vegetable - do NOT add extra protein
- NEVER serve swallow+soup for breakfast

BOILED YAM PAIRINGS:
- Good: Egg sauce, Fried eggs, Fish stew (tomato-based), Pepper sauce
- BAD: Ogbono soup, Egusi soup, Okra soup (these need swallows)

FRIED PLANTAIN (DODO) PAIRINGS:
- Good: Jollof rice, Fried rice, Beans, Scrambled eggs, Stew
- Can be a side dish or standalone snack

RICE PAIRINGS:
- Jollof Rice → With: Grilled/fried chicken, Fish, Plantain, Salad
- Fried Rice → With: Chicken, Beef, Shrimp, Plantain
- White Rice → With: Stews (tomato, chicken, beef), Beans

BREAKFAST APPROPRIATE (Nigerian):
- Akara + Pap (Ogi)
- Moi Moi + Custard or Pap
- Bread + Eggs (scrambled, fried, omelette)
- Bread + Beans
- Yam + Egg sauce or Fried eggs
- Tea + Bread/Toast

BREAKFAST INAPPROPRIATE:
- Swallow + Soup (too heavy, wrong time)
- Jollof Rice (lunch/dinner food)
- Pepper Soup (evening food)

SNACKS MUST BE:
- Simple (1-3 items max)
- Portable and quick
- NOT full meals (no rice, swallow, soup)
- Examples: Fruits, Nuts, Kulikuli, Tiger nuts, Greek yogurt, Boiled eggs
```

### Phase 2: AddFoodModal Component

Create a new modal component with:

**Structure:**
- Two tabs: "Search Foods" and "Custom Food"
- Search Foods tab: Searchable list of common foods from database
- Custom Food tab: Form with inputs for name, portion, calories, protein, carbs, fat

**Common Foods Database (Client-Side Quick Access):**
```typescript
const COMMON_FOODS: Food[] = [
  // Proteins
  { name: 'Grilled Chicken Breast', portion: '100g', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Boiled Eggs (2)', portion: '2 large', calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: 'Grilled Fish', portion: '150g', calories: 180, protein: 30, carbs: 0, fat: 6 },
  // Carbs
  { name: 'Brown Rice', portion: '150g', calories: 185, protein: 4, carbs: 39, fat: 1.5 },
  { name: 'Boiled Yam', portion: '150g', calories: 177, protein: 2, carbs: 42, fat: 0.2 },
  // Fruits
  { name: 'Banana', portion: '1 medium', calories: 89, protein: 1, carbs: 23, fat: 0.3 },
  { name: 'Apple', portion: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  // Snacks
  { name: 'Greek Yogurt', portion: '150g', calories: 145, protein: 13, carbs: 5, fat: 7 },
  { name: 'Almonds', portion: '28g', calories: 164, protein: 6, carbs: 6, fat: 14 },
  // ... 30+ more items
];
```

**Modal Props:**
```typescript
interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: Food) => void;
  mealName: string;
}
```

### Phase 3: DietGenerator Updates

**New State:**
```typescript
const [showAddFoodModal, setShowAddFoodModal] = useState(false);
const [addFoodMealIndex, setAddFoodMealIndex] = useState<number | null>(null);
```

**New Handler:**
```typescript
const handleAddFood = (food: Food) => {
  if (!generatedPlan || addFoodMealIndex === null) return;
  
  const updatedPlan = { ...generatedPlan };
  const day = { ...updatedPlan.mealPlan[selectedDayIndex] };
  const meal = { ...day.meals[addFoodMealIndex] };
  
  // Add the food
  meal.foods = [...meal.foods, food];
  
  // Recalculate day totals
  day.totalCalories += food.calories;
  day.totalProtein += food.protein;
  day.totalCarbs += food.carbs;
  day.totalFat += food.fat;
  
  day.meals[addFoodMealIndex] = meal;
  updatedPlan.mealPlan[selectedDayIndex] = day;
  
  setGeneratedPlan(updatedPlan);
  setShowAddFoodModal(false);
  setAddFoodMealIndex(null);
  toast.success(`Added ${food.name}`);
};
```

### Phase 4: MealCard Updates

Add "Add Food" button when in edit mode:

```tsx
{isEditing && onAddFood && (
  <Button
    variant="outline"
    size="sm"
    className="w-full mt-2"
    onClick={onAddFood}
  >
    <Plus className="w-4 h-4 mr-1" />
    Add Food
  </Button>
)}
```

**New Prop:**
```typescript
onAddFood?: () => void;
```

---

## Files to Create/Modify Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/generate-diet/index.ts` | Modify | Add Nigerian meal pairing rules to prompt |
| `src/components/AddFoodModal.tsx` | Create | Modal for adding custom foods |
| `src/components/DietGenerator.tsx` | Modify | Add state/handlers for custom food addition |
| `src/components/MealCard.tsx` | Modify | Add "Add Food" button in edit mode |
| `src/data/commonFoods.ts` | Create | Client-side food database for quick-add |

---

## Expected Outcomes

1. **Smarter Meal Generation**: AI will create culturally appropriate meal combinations
   - Breakfast: Light, energizing (Akara + Pap, Oatmeal + Eggs)
   - Lunch/Dinner: Proper pairings (Eba + Egusi, Jollof + Chicken)
   - Snacks: Simple, portable (Fruits, Nuts, Kulikuli)

2. **Full Editing Capability**: Users can:
   - Remove foods they don't like (already working)
   - Remove entire meals (already working)
   - Add foods from a searchable database (new)
   - Add custom foods with manual macro entry (new)

3. **Real-Time Recalculation**: All totals update automatically when adding/removing foods

