
# Enhanced Diet Generator - Diverse Food Mix & Editing

## Overview
Expand the diet generator with a massive, truly diverse food database mixing Nigerian and international foods, implement proper meal-time proportions (light breakfast, proper snacks with fruits), and add full meal editing capabilities.

---

## Phase 1: Massive Food Database Expansion

### Update Edge Function with 150+ Foods

Expand `supabase/functions/generate-diet/index.ts` with a unified database:

**PROTEINS - Mixed (40+ items)**
```text
=== PROTEINS ===
# International
- Grilled Chicken Breast: 165 cal/100g, 31g P, 0g C, 3.6g F
- Salmon Fillet: 208 cal/100g, 20g P, 0g C, 13g F
- Turkey Breast: 135 cal/100g, 30g P, 0g C, 1g F
- Tuna Steak: 132 cal/100g, 28g P, 0g C, 1g F
- Shrimp: 99 cal/100g, 24g P, 0g C, 0.3g F
- Cod Fillet: 82 cal/100g, 18g P, 0g C, 0.7g F
- Lean Ground Beef: 176 cal/100g, 20g P, 0g C, 10g F
- Pork Tenderloin: 143 cal/100g, 26g P, 0g C, 3.5g F
- Lamb Chops: 250 cal/100g, 25g P, 0g C, 16g F
- Duck Breast: 135 cal/100g, 19g P, 0g C, 6g F
- Greek Yogurt: 97 cal/100g, 9g P, 3.6g C, 5g F
- Cottage Cheese: 98 cal/100g, 11g P, 3.4g C, 4.3g F
- Eggs (2 large): 143 cal, 13g P, 1g C, 10g F
- Whey Protein Shake: 120 cal/scoop, 24g P, 3g C, 1g F

# Nigerian/African
- Suya (grilled spiced beef): 250 cal/100g, 25g P, 5g C, 15g F
- Kilishi (dried beef jerky): 300 cal/100g, 35g P, 8g C, 14g F
- Grilled Tilapia: 128 cal/100g, 26g P, 0g C, 2.5g F
- Catfish Pepper Soup: 160 cal/serving, 24g P, 4g C, 5g F
- Smoked Fish (Eja Sise): 290 cal/100g, 52g P, 0g C, 12g F
- Stockfish: 290 cal/100g, 62g P, 0g C, 2.5g F
- Dried Prawns (Crayfish): 280 cal/100g, 60g P, 2g C, 3g F
- Goat Meat Stew: 143 cal/100g, 27g P, 0g C, 3g F
- Asun (spiced goat): 220 cal/100g, 24g P, 3g C, 12g F
- Chicken Pepper Soup: 180 cal/serving, 22g P, 8g C, 6g F
- Nkwobi (spiced cow foot): 200 cal/serving, 18g P, 5g C, 12g F
- Ponmo (cow skin): 110 cal/100g, 25g P, 0g C, 0.5g F
- Guinea Fowl: 160 cal/100g, 28g P, 0g C, 5g F
- Snail (Igbin): 90 cal/100g, 16g P, 2g C, 1.5g F
```

**CARBOHYDRATES - Mixed (30+ items)**
```text
=== CARBOHYDRATES ===
# International
- Brown Rice: 123 cal/100g, 2.7g P, 26g C, 1g F
- Quinoa: 120 cal/100g, 4.4g P, 21g C, 1.9g F
- Sweet Potato: 86 cal/100g, 1.6g P, 20g C, 0.1g F
- Oatmeal: 68 cal/100g, 2.4g P, 12g C, 1.4g F
- Whole Wheat Bread: 247 cal/100g, 13g P, 41g C, 4g F
- Basmati Rice: 130 cal/100g, 2.7g P, 28g C, 0.3g F
- Whole Wheat Pasta: 124 cal/100g, 5g P, 25g C, 0.5g F
- Couscous: 112 cal/100g, 3.8g P, 23g C, 0.2g F
- Bulgur Wheat: 83 cal/100g, 3g P, 19g C, 0.2g F

# Nigerian/African
- Jollof Rice: 180 cal/100g, 4g P, 32g C, 4g F
- Ofada Rice: 130 cal/100g, 2.5g P, 28g C, 0.5g F
- Fried Rice: 200 cal/100g, 5g P, 30g C, 6g F
- Pounded Yam: 118 cal/100g, 1.5g P, 28g C, 0.1g F
- Amala: 120 cal/100g, 2g P, 28g C, 0.3g F
- Eba (Garri): 160 cal/100g, 0.5g P, 38g C, 0.5g F
- Fufu: 120 cal/100g, 1g P, 28g C, 0.5g F
- Tuwo Shinkafa: 115 cal/100g, 2g P, 25g C, 0.3g F
- Boiled Yam: 118 cal/100g, 1.5g P, 28g C, 0.1g F
- Fried Plantain (Dodo): 150 cal/100g, 1g P, 35g C, 2g F
- Boiled Plantain: 122 cal/100g, 1g P, 32g C, 0.4g F
- Moi Moi: 180 cal/serving, 9g P, 18g C, 8g F
- Akara (3 pieces): 170 cal, 6g P, 15g C, 10g F
- Agidi/Eko: 90 cal/100g, 1g P, 20g C, 0.5g F
- Masa (rice cakes): 150 cal/3 pieces, 3g P, 25g C, 4g F
```

**FRUITS - Extensive (25+ items)**
```text
=== FRUITS ===
# Universal Fruits
- Banana: 89 cal/medium, 1g P, 23g C, 0.3g F
- Apple: 95 cal/medium, 0.5g P, 25g C, 0.3g F
- Orange: 62 cal/medium, 1g P, 15g C, 0.2g F
- Strawberries: 32 cal/100g, 0.7g P, 8g C, 0.3g F
- Blueberries: 57 cal/100g, 0.7g P, 14g C, 0.3g F
- Raspberries: 52 cal/100g, 1.2g P, 12g C, 0.7g F
- Mango: 60 cal/100g, 0.8g P, 15g C, 0.4g F
- Pineapple: 50 cal/100g, 0.5g P, 13g C, 0.1g F
- Watermelon: 30 cal/100g, 0.6g P, 8g C, 0.2g F
- Grapes: 69 cal/100g, 0.7g P, 18g C, 0.2g F
- Kiwi: 61 cal/100g, 1g P, 15g C, 0.5g F
- Grapefruit: 42 cal/100g, 0.8g P, 11g C, 0.1g F
- Pear: 57 cal/medium, 0.4g P, 15g C, 0.1g F
- Cantaloupe: 34 cal/100g, 0.8g P, 8g C, 0.2g F
- Peach: 39 cal/medium, 0.9g P, 10g C, 0.3g F

# African Fruits
- Pawpaw (Papaya): 43 cal/100g, 0.5g P, 11g C, 0.3g F
- African Star Apple (Agbalumo): 67 cal/100g, 1g P, 16g C, 0.4g F
- Soursop: 66 cal/100g, 1g P, 17g C, 0.3g F
- African Pear (Ube): 150 cal/100g, 2g P, 12g C, 10g F
- Guava: 68 cal/100g, 2.5g P, 14g C, 1g F
- African Cherry: 45 cal/100g, 0.8g P, 11g C, 0.3g F
- Coconut (fresh): 354 cal/100g, 3g P, 15g C, 33g F
- Tangerine: 53 cal/medium, 0.8g P, 13g C, 0.3g F
```

**HEALTHY SNACKS (30+ items)**
```text
=== HEALTHY SNACKS ===
# Quick Protein Snacks
- Greek Yogurt with Berries: 120 cal, 12g P, 15g C, 2g F
- Boiled Eggs (2): 140 cal, 12g P, 1g C, 10g F
- Cottage Cheese with Fruit: 150 cal, 14g P, 15g C, 3g F
- Protein Bar: 200 cal, 20g P, 20g C, 6g F
- String Cheese (2 sticks): 160 cal, 14g P, 2g C, 10g F
- Beef Jerky: 116 cal/30g, 10g P, 3g C, 7g F

# Nuts & Seeds
- Almonds (handful): 164 cal/28g, 6g P, 6g C, 14g F
- Cashews (handful): 157 cal/28g, 5g P, 9g C, 12g F
- Walnuts (handful): 185 cal/28g, 4g P, 4g C, 18g F
- Pumpkin Seeds: 151 cal/28g, 7g P, 5g C, 13g F
- Mixed Nuts: 172 cal/28g, 5g P, 6g C, 15g F
- Trail Mix: 180 cal/quarter cup, 5g P, 15g C, 12g F

# Fruit-Based Snacks
- Apple with Peanut Butter: 200 cal, 5g P, 25g C, 10g F
- Banana with Almond Butter: 230 cal, 5g P, 30g C, 12g F
- Mixed Fruit Bowl: 100 cal, 1g P, 25g C, 0.5g F
- Berry Smoothie: 150 cal, 4g P, 28g C, 3g F
- Frozen Grapes: 62 cal/100g, 0.6g P, 16g C, 0.3g F

# Nigerian Snacks
- Kulikuli (groundnut snack): 150 cal/30g, 7g P, 8g C, 11g F
- Tiger Nuts (Aya): 120 cal/30g, 2g P, 15g C, 7g F
- Garden Egg with Palm Oil: 80 cal, 2g P, 8g C, 5g F
- Roasted Groundnuts: 170 cal/30g, 8g P, 5g C, 14g F
- Coconut Chunks: 180 cal/50g, 2g P, 8g C, 17g F
- Dried Mango Slices: 80 cal/30g, 1g P, 20g C, 0g F
- Toasted Cashews: 160 cal/28g, 5g P, 9g C, 13g F

# Light Snacks
- Rice Cakes with Avocado: 100 cal, 2g P, 12g C, 5g F
- Hummus with Veggies: 130 cal, 4g P, 15g C, 6g F
- Edamame: 120 cal/100g, 11g P, 9g C, 5g F
- Dark Chocolate (70%): 170 cal/30g, 2g P, 13g C, 12g F
- Zobo (hibiscus drink): 20 cal/cup, 0g P, 5g C, 0g F
```

**SOUPS & VEGETABLES (25+ items)**
```text
=== NIGERIAN SOUPS ===
- Egusi Soup: 250 cal/serving, 12g P, 8g C, 20g F
- Okra Soup: 80 cal/serving, 4g P, 10g C, 3g F
- Efo Riro: 180 cal/serving, 8g P, 6g C, 14g F
- Ogbono Soup: 200 cal/serving, 10g P, 8g C, 15g F
- Afang Soup: 150 cal/serving, 8g P, 5g C, 11g F
- Edikang Ikong: 160 cal/serving, 10g P, 6g C, 11g F
- Banga Soup: 280 cal/serving, 8g P, 10g C, 24g F
- Pepper Soup: 120 cal/serving, 15g P, 5g C, 4g F
- Oha Soup: 170 cal/serving, 9g P, 7g C, 13g F
- Nsala (White Soup): 200 cal/serving, 12g P, 6g C, 15g F
- Groundnut Soup: 220 cal/serving, 10g P, 12g C, 16g F
- Miyan Kuka: 150 cal/serving, 7g P, 8g C, 10g F

=== VEGETABLES ===
- Broccoli: 34 cal/100g, 2.8g P, 7g C, 0.4g F
- Spinach: 23 cal/100g, 2.9g P, 3.6g C, 0.4g F
- Mixed Salad: 20 cal/100g, 1.5g P, 3g C, 0.2g F
- Ugu (Pumpkin Leaves): 30 cal/100g, 3g P, 4g C, 0.5g F
- Water Leaf: 25 cal/100g, 2g P, 4g C, 0.3g F
- Ewedu: 25 cal/100g, 2g P, 3g C, 0.5g F
- Bitter Leaf: 20 cal/100g, 2g P, 3g C, 0.3g F
- Scent Leaf: 22 cal/100g, 2g P, 3g C, 0.3g F
- Garden Egg: 25 cal/100g, 1g P, 6g C, 0.1g F
- Cucumber: 16 cal/100g, 0.7g P, 4g C, 0.1g F
- Carrots: 41 cal/100g, 0.9g P, 10g C, 0.2g F
```

---

## Phase 2: Proportional Meal-Time Logic

### Add Calorie Distribution Rules

```text
MEAL-TIME CALORIE DISTRIBUTION:

BREAKFAST (6:30-8:00 AM) - 15-20% of daily calories
├── Characteristics: Light, energizing, easy to digest
├── Structure: 1 protein + 1 carb OR fruit + optional light side
├── Examples:
│   ├── Oatmeal + Banana + Boiled Eggs
│   ├── Akara + Pap + Pawpaw
│   ├── Toast + Scrambled Eggs + Orange
│   └── Greek Yogurt + Berries + Almonds

MID-MORNING SNACK (10:00 AM) - 150-200 cal max
├── Characteristics: Fruit-focused, simple, 1-2 items only
├── Examples:
│   ├── Apple + Almonds
│   ├── Banana
│   ├── Mixed Fruit Bowl
│   └── Orange + Tiger Nuts

LUNCH (12:30-1:30 PM) - 25-30% of daily calories
├── Characteristics: Substantial, balanced, main meal energy
├── Structure: Protein + Carb + Vegetable/Soup
├── Examples:
│   ├── Grilled Chicken + Brown Rice + Steamed Veggies
│   ├── Jollof Rice + Grilled Fish + Salad
│   ├── Eba + Egusi Soup + Assorted Meat
│   └── Quinoa Bowl + Salmon + Roasted Vegetables

AFTERNOON SNACK (3:30-4:00 PM) - 150-250 cal max
├── Characteristics: Protein-focused, sustaining, 1-3 items
├── Examples:
│   ├── Greek Yogurt + Berries
│   ├── Kulikuli + Tangerine
│   ├── Boiled Eggs + Cucumber
│   └── Protein Bar

DINNER (7:00-8:00 PM) - 25-35% of daily calories
├── Characteristics: Protein-heavy, moderate carbs, satisfying
├── Structure: Larger protein + moderate carb + vegetables
├── Examples:
│   ├── Grilled Steak + Sweet Potato + Asparagus
│   ├── Catfish Pepper Soup + Boiled Plantain
│   ├── Suya + Salad + Small Rice
│   └── Turkey + Amala + Efo Riro

EVENING SNACK (9:00 PM - optional) - 100-150 cal max
├── Characteristics: Light, protein-based, no heavy carbs
├── Examples:
│   ├── Cottage Cheese
│   ├── Small handful of Almonds
│   ├── Protein Shake (half scoop)
│   └── Boiled Egg
```

### Snack-Specific Constraints

```text
SNACK RULES:
1. Maximum 3 items per snack
2. Each day must have at least 1 fruit-based snack
3. Morning snack: prioritize fruits
4. Afternoon snack: prioritize protein + fruit/nuts
5. Snacks must be "grab-and-go" portable items
6. Avoid heavy/oily snacks
```

---

## Phase 3: Meal Editing Capabilities

### Task 3.1: Add Editing State to DietGenerator

Update `src/components/DietGenerator.tsx`:

**New State:**
```typescript
const [isEditing, setIsEditing] = useState(false);
```

**New Handlers:**
```typescript
// Remove a specific food from a meal
const handleRemoveFood = (dayIndex: number, mealIndex: number, foodIndex: number) => {
  if (!generatedPlan) return;
  
  const updatedPlan = { ...generatedPlan };
  const day = { ...updatedPlan.mealPlan[dayIndex] };
  const meal = { ...day.meals[mealIndex] };
  
  // Remove the food
  const removedFood = meal.foods[foodIndex];
  meal.foods = meal.foods.filter((_, i) => i !== foodIndex);
  
  // Recalculate day totals
  day.totalCalories -= removedFood.calories;
  day.totalProtein -= removedFood.protein;
  day.totalCarbs -= removedFood.carbs;
  day.totalFat -= removedFood.fat;
  
  day.meals[mealIndex] = meal;
  updatedPlan.mealPlan[dayIndex] = day;
  
  setGeneratedPlan(updatedPlan);
  toast.success(`Removed ${removedFood.name}`);
};

// Remove entire meal
const handleRemoveMeal = (dayIndex: number, mealIndex: number) => {
  if (!generatedPlan) return;
  
  const updatedPlan = { ...generatedPlan };
  const day = { ...updatedPlan.mealPlan[dayIndex] };
  const removedMeal = day.meals[mealIndex];
  
  // Subtract meal totals from day
  const mealCals = removedMeal.foods.reduce((s, f) => s + f.calories, 0);
  const mealProtein = removedMeal.foods.reduce((s, f) => s + f.protein, 0);
  const mealCarbs = removedMeal.foods.reduce((s, f) => s + f.carbs, 0);
  const mealFat = removedMeal.foods.reduce((s, f) => s + f.fat, 0);
  
  day.totalCalories -= mealCals;
  day.totalProtein -= mealProtein;
  day.totalCarbs -= mealCarbs;
  day.totalFat -= mealFat;
  
  day.meals = day.meals.filter((_, i) => i !== mealIndex);
  updatedPlan.mealPlan[dayIndex] = day;
  
  setGeneratedPlan(updatedPlan);
  toast.success(`Removed ${removedMeal.name}`);
};
```

**UI Updates:**
- Add "Edit" toggle button in the generated plan header
- Pass `isEditing`, `onRemoveFood`, `onRemoveMeal` to MealCard
- Show deficit/surplus indicator when totals change

### Task 3.2: Enhanced MealCard Component

Update `src/components/MealCard.tsx`:

**New Props:**
```typescript
interface MealCardProps {
  meal: Meal;
  isEditing?: boolean;
  onRemoveFood?: (foodIndex: number) => void;
  onRemoveMeal?: () => void;
}
```

**Enhanced UI:**
- Add "Remove Meal" button when editing
- Show visual indicator for edit mode (border color)
- Animate food removal
- Show warning if meal becomes empty

---

## Implementation Summary

### Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/generate-diet/index.ts` | Expand to 150+ foods, add meal-time rules, fruits, snacks, mixing instructions |
| `src/components/DietGenerator.tsx` | Add editing state, handlers, UI toggle |
| `src/components/MealCard.tsx` | Add onRemoveMeal prop, enhanced edit mode UI |

### Expected Outcomes

1. **Food Variety**: 150+ foods naturally mixing Nigerian & international cuisines
2. **Proper Portions**: Breakfast light (15-20%), snacks 150-300 cal max
3. **Fruits Included**: At least 1-2 fruit snacks per day
4. **Snacks Done Right**: Simple, 1-3 item grab-and-go snacks
5. **Editable Plans**: Remove foods/meals with auto-recalculation
6. **Visual Feedback**: See calorie changes in real-time when editing
