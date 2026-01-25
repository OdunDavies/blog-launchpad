

# Enhanced Diet Generator Plan

## Overview
Enhance the AI diet generator to combine international and Nigerian foods, add significantly more food variety, implement proper meal-time proportions (light breakfast, proper snacks, include fruits), and enable meal plan editing capabilities.

---

## Key Enhancements

| Area | Current | Enhanced |
|------|---------|----------|
| Food Database | ~50 items | 150+ items with international + Nigerian mix |
| Meal Timing | Equal distribution | Proportional (Breakfast 15-20%, Snacks 150-300 cal) |
| Fruits | Missing | Full fruit section in database |
| Snacks | Generic | Dedicated healthy snacks category |
| Editing | View only | Remove foods, swap meals, regenerate individual meals |

---

## Phase 1: Expand the Food Database

### Task 1.1: Update Edge Function with Massive Food Database

Expand `supabase/functions/generate-diet/index.ts` with:

**New Protein Options (30+ items):**
- International: Chicken thighs, Pork tenderloin, Duck breast, Lamb chops, Halibut, Mackerel, Sardines, Crab, Lobster, Venison, Bison, Whey protein, Casein, Bone broth
- Nigerian: Smoked fish (eja sise), Fresh catfish, Snail (igbin), Crayfish, Periwinkle, Turkey (cooked), Guinea fowl, Ofada rice and ofada stew, Palm wine chicken

**New Carbohydrate Options (25+ items):**
- International: Basmati rice, Wild rice, Couscous, Bulgur wheat, Barley, Buckwheat, Millet, Rye bread, Bagel, English muffin, Corn tortilla, Pita bread
- Nigerian: Abacha (African salad), Ukwa (breadfruit), Agidi/Eko, Masa (rice cakes), Tuwo masara (corn tuwo), Igbemo (roasted corn)

**Fruits Section (20+ items):**
- Universal: Banana, Apple, Orange, Berries (strawberry, blueberry, raspberry), Mango, Pineapple, Grapes, Watermelon, Kiwi, Grapefruit, Pear, Peach, Plums, Cantaloupe
- African: Pawpaw (papaya), African cherry (agbalumo), African star apple, Soursop, Coconut, Guava, African pear (ube), Tangerine

**Healthy Snacks Section (25+ items):**
- Nuts & Seeds: Almonds, Walnuts, Cashews, Pistachios, Pumpkin seeds, Sunflower seeds, Chia seeds, Flax seeds
- Quick Snacks: Rice cakes, Hummus with veggies, Edamame, String cheese, Trail mix, Dark chocolate (70%+), Beef jerky
- Nigerian Snacks: Kulikuli (groundnut snack), Garden egg with palm oil, Roasted corn, Coconut chips, Dried mango, Toasted cashews

**Vegetables (15+ items):**
- Add: Kale, Cauliflower, Zucchini, Cucumber, Carrots, Green beans, Brussels sprouts, Cabbage, Ewedu leaves, Bitter leaf, Scent leaf

---

## Phase 2: Implement Meal-Time Proportional Logic

### Task 2.1: Update Meal Distribution in Edge Function

Add specific calorie distribution rules to the AI prompt:

```text
MEAL TIME CALORIE DISTRIBUTION:
- Breakfast (6:00-8:00 AM): 15-20% of daily calories (light, energizing)
  - Focus: Protein + complex carbs + fruit
  - Examples: Eggs + oatmeal + banana, Akara + pap + pawpaw
  
- Mid-Morning Snack (10:00 AM): 10% or 150-200 cal max
  - Focus: Fruit OR nuts OR yogurt
  - Keep simple: 1-2 items only
  
- Lunch (12:00-1:30 PM): 25-30% of daily calories (substantial)
  - Focus: Balanced meal with protein, carbs, vegetables
  - Main meal of the day for many
  
- Afternoon Snack (3:00-4:00 PM): 10% or 150-250 cal max
  - Focus: Protein snack OR fruit + nuts
  - Keep simple: 1-2 items only
  
- Dinner (6:30-8:00 PM): 25-35% of daily calories
  - Focus: Protein-heavy, moderate carbs
  - Lighter than lunch if eating late
  
- Evening Snack (9:00 PM - optional): 5-10% or 100-150 cal max
  - Focus: Protein (casein) OR light snack
  - Avoid heavy carbs before bed
```

**Snack-Specific Rules:**
- Snacks should have 1-3 items maximum
- Snacks should be grab-and-go foods
- Include fruits in at least 2 snacks per day
- Morning snack: Fruit-focused
- Afternoon snack: Protein/nut-focused

---

## Phase 3: Enable Meal Plan Editing

### Task 3.1: Add Editing State to DietGenerator

Update `src/components/DietGenerator.tsx`:

```typescript
// New state for editing
const [isEditing, setIsEditing] = useState(false);

// Function to remove a food item
const handleRemoveFood = (dayIndex: number, mealIndex: number, foodIndex: number) => {
  if (!generatedPlan) return;
  
  const updatedPlan = { ...generatedPlan };
  const day = { ...updatedPlan.mealPlan[dayIndex] };
  const meal = { ...day.meals[mealIndex] };
  
  // Remove the food
  meal.foods = meal.foods.filter((_, i) => i !== foodIndex);
  
  // Recalculate meal totals
  day.meals[mealIndex] = meal;
  
  // Recalculate day totals
  day.totalCalories = day.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.calories, 0), 0);
  day.totalProtein = day.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.protein, 0), 0);
  day.totalCarbs = day.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.carbs, 0), 0);
  day.totalFat = day.meals.reduce((sum, m) => sum + m.foods.reduce((s, f) => s + f.fat, 0), 0);
  
  updatedPlan.mealPlan[dayIndex] = day;
  setGeneratedPlan(updatedPlan);
};

// Function to remove entire meal
const handleRemoveMeal = (dayIndex: number, mealIndex: number) => {
  // Similar logic to remove entire meal
};

// Toggle edit mode
<Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
  <Pencil className="w-4 h-4" />
  {isEditing ? 'Done' : 'Edit'}
</Button>
```

### Task 3.2: Update MealCard for Editing

Enhance `src/components/MealCard.tsx`:

- Pass `isEditing` and `onRemoveFood` props (already supported)
- Add visual feedback when in edit mode
- Add delete button for each food item when editing
- Add option to remove entire meal

### Task 3.3: Create AddFoodModal Component

New component `src/components/AddFoodModal.tsx`:

- Search through available foods
- Quick-add common foods
- Custom food entry (name, portion, calories, macros)
- Filter by category (proteins, carbs, fruits, snacks)
- Add to specific meal

### Task 3.4: Update DietGenerator UI for Editing

Add to the generated plan view:
- "Edit Plan" toggle button in header
- When editing:
  - Each food shows X button to remove
  - Each meal shows "Add Food" button
  - Show calorie deficit/surplus indicator when items removed

---

## Phase 4: Improve Result Display

### Task 4.1: Add Recalculation on Edit

When foods are removed:
- Automatically recalculate daily totals
- Show warning if day falls below minimum calories (1200)
- Update NutritionSummary in real-time
- Show "+Add Food" placeholder if meal becomes empty

### Task 4.2: Add Visual Feedback

- Highlight meals that are significantly under/over target
- Badge showing "X calories under target" when edited
- Undo last deletion option

---

## Implementation Details

### Expanded Food Database Structure

```text
=== FRUITS (25+ items) ===
- Banana: 89 cal/medium, 1g protein, 23g carbs, 0.3g fat
- Apple: 95 cal/medium, 0.5g protein, 25g carbs, 0.3g fat
- Orange: 62 cal/medium, 1g protein, 15g carbs, 0.2g fat
- Strawberries: 32 cal/100g, 0.7g protein, 8g carbs, 0.3g fat
- Blueberries: 57 cal/100g, 0.7g protein, 14g carbs, 0.3g fat
- Mango: 60 cal/100g, 0.8g protein, 15g carbs, 0.4g fat
- Pineapple: 50 cal/100g, 0.5g protein, 13g carbs, 0.1g fat
- Watermelon: 30 cal/100g, 0.6g protein, 8g carbs, 0.2g fat
- Pawpaw (Papaya): 43 cal/100g, 0.5g protein, 11g carbs, 0.3g fat
- African Star Apple (Agbalumo): 67 cal/100g, 1g protein, 16g carbs, 0.4g fat
- Guava: 68 cal/100g, 2.5g protein, 14g carbs, 1g fat
- African Pear (Ube): 150 cal/100g, 2g protein, 12g carbs, 10g fat
- Grapes: 69 cal/100g, 0.7g protein, 18g carbs, 0.2g fat
- Kiwi: 61 cal/100g, 1g protein, 15g carbs, 0.5g fat
- Grapefruit: 42 cal/100g, 0.8g protein, 11g carbs, 0.1g fat

=== HEALTHY SNACKS (20+ items) ===
- Greek Yogurt with Berries: 120 cal, 12g protein, 15g carbs, 2g fat
- Almonds (1oz/28g): 164 cal, 6g protein, 6g carbs, 14g fat
- Apple with Peanut Butter: 200 cal, 5g protein, 25g carbs, 10g fat
- Hummus with Carrots: 130 cal, 4g protein, 15g carbs, 6g fat
- Protein Bar: 200 cal, 20g protein, 20g carbs, 6g fat
- Rice Cakes with Avocado: 100 cal, 2g protein, 12g carbs, 5g fat
- Trail Mix (1/4 cup): 180 cal, 5g protein, 15g carbs, 12g fat
- Cottage Cheese with Fruit: 150 cal, 14g protein, 15g carbs, 3g fat
- Boiled Eggs (2): 140 cal, 12g protein, 1g carbs, 10g fat
- Kulikuli (groundnut snack): 150 cal/30g, 7g protein, 8g carbs, 11g fat
- Garden Egg with Palm Oil: 80 cal, 2g protein, 8g carbs, 5g fat
- Roasted Plantain Chips: 180 cal/30g, 1g protein, 25g carbs, 9g fat
- Coconut Chunks: 180 cal/50g, 2g protein, 8g carbs, 17g fat
- Tiger Nuts: 120 cal/30g, 2g protein, 15g carbs, 7g fat
- Mixed Fruit Bowl: 100 cal, 1g protein, 25g carbs, 0.5g fat
```

### Meal-Time Specific Prompts

```text
BREAKFAST RULES (15-20% calories):
- Always include 1 protein source
- Include 1 complex carb OR fruit
- Keep portions moderate
- Good combos: Eggs + toast + fruit, Oatmeal + nuts + berries, Akara + pap + pawpaw

SNACK RULES (10% calories, 150-300 cal max):
- Maximum 3 items
- At least 1 snack per day must be fruit-based
- Keep it simple and portable
- Examples: Apple + almonds, Greek yogurt, Banana + peanut butter, Kulikuli + orange

LUNCH RULES (25-30% calories):
- Most substantial meal
- Include protein + carb + vegetable
- Nigerian options: Rice + stew + protein + salad
- International: Chicken + quinoa + roasted veggies

DINNER RULES (25-30% calories):
- Protein-focused
- Moderate carbs
- Include vegetables
- Lighter if eating late (after 8pm)
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/generate-diet/index.ts` | Expand food database, add meal-time rules, fruits, snacks |
| `src/components/DietGenerator.tsx` | Add editing state, remove food/meal handlers, edit toggle |
| `src/components/MealCard.tsx` | Enhance edit mode UI, add remove meal option |

## Files to Create

| File | Description |
|------|-------------|
| `src/components/AddFoodModal.tsx` | Modal for adding foods to meals |

---

## Implementation Order

1. Expand the food database in the edge function (proteins, carbs, fruits, snacks)
2. Add meal-time proportional calorie distribution rules
3. Add editing state and handlers to DietGenerator
4. Update MealCard to show edit controls
5. Create AddFoodModal for adding foods
6. Add real-time recalculation when editing
7. Deploy edge function and test

---

## Expected Outcome

After implementation:
- AI generates plans with 150+ food variety
- International and Nigerian foods naturally mixed
- Breakfast is light (15-20% calories)
- Snacks are proper snacks (150-300 cal, simple items)
- Fruits appear in snacks and breakfast
- Users can remove foods they don't like
- Users can add substitute foods
- Daily totals update automatically when editing

