

# Enhance AI Prompt with Meal-Type-Specific Food Suggestions

## Problem
The current AI prompt tells the model *when* to eat (timing) and *what foods exist* (databases), but doesn't provide clear guidance on **what types of foods are appropriate for each meal type**. This can result in:
- Snacks that look like full meals
- Breakfast suggestions that are more appropriate for dinner
- Generic meal suggestions that don't feel natural

## Solution
Add explicit **meal-type-specific food recommendations** to the AI prompt that guide the model on what foods/combinations are culturally appropriate for:
- **Breakfast** - lighter, morning-appropriate foods
- **Snacks** - quick, portable, smaller portions
- **Lunch** - moderate, balanced meals
- **Dinner** - typically larger, more substantial
- **Pre/Post-Workout** - performance-focused nutrition

---

## Implementation

### File to Modify

| File | Changes |
|------|---------|
| `supabase/functions/generate-diet/index.ts` | Add meal-type-specific food guidance section to the system prompt |

### New Prompt Section to Add

```text
=== MEAL-TYPE-SPECIFIC FOOD GUIDELINES ===

BREAKFAST (Morning meals):
- Light to moderate portions to start the day
- Easy-to-digest foods
- Include protein for satiety
- Examples: eggs, oatmeal, yogurt, smoothies, toast with protein
- Nigerian: Akamu/Pap, Akara, Moi Moi, Yam with egg sauce, bread with omelette

SNACKS (Between meals):
- Quick, portable, smaller portions (150-300 calories)
- Protein-rich for muscle support
- Easy to prepare or grab-and-go
- Examples: nuts, fruit, protein bars, hard-boiled eggs, cheese
- Nigerian: Roasted groundnuts, Kilishi, boiled eggs, Chin Chin, roasted plantain, Tiger nut milk

LUNCH (Midday meal):
- Balanced and moderate portions
- Good mix of protein, carbs, and vegetables
- Sustaining energy for afternoon
- Examples: rice bowls, salads with protein, sandwiches, pasta dishes
- Nigerian: Jollof rice with chicken, Ofada rice with Ayamase, rice and beans with fish

DINNER (Evening meal):
- Can be larger portions if calorie budget allows
- Complete protein sources
- Traditional full meals with sides
- Examples: grilled proteins with vegetables, stews with grains
- Nigerian: Eba/Amala with soup and assorted meat, Pounded yam with Egusi

PRE-WORKOUT (1-2 hours before training):
- Moderate protein + complex carbs
- Easily digestible
- Avoid heavy fats that slow digestion
- Examples: banana with nut butter, oatmeal, rice cakes
- Nigerian: Boiled yam, Moi Moi, Plantain

POST-WORKOUT (Within 1 hour after training):
- High protein (30-40g) + fast-acting carbs
- Recovery-focused nutrition
- Replenish glycogen stores
- Examples: protein shake with fruit, chicken with rice
- Nigerian: Boiled yam with grilled fish, Rice with chicken
```

### Enhanced Snack Examples by Cuisine

For Nigerian cuisine specifically, add more snack variety:
- Roasted groundnuts (50g)
- Beef Kilishi (dried meat)
- Boiled eggs (2-3)
- Roasted corn
- Plantain chips (small portion)
- Tiger nut milk (Kunun Aya)
- Garden eggs with groundnut paste
- Chin Chin (small portion)
- Moi Moi (single wrap)
- Fresh fruits (oranges, mangoes, pawpaw)

### Changes Summary

1. Add new `=== MEAL-TYPE-SPECIFIC FOOD GUIDELINES ===` section to the system prompt
2. Include examples for each meal type (breakfast, snack, lunch, dinner, pre/post workout)
3. Add cuisine-specific examples within each meal type
4. Update Nigerian cuisine section with explicit snack examples
5. Add guidance on portion sizes appropriate for snacks vs main meals

---

## Expected Outcome

After this update, generated meal plans will have:
- **Breakfast**: Light, morning-appropriate foods (not full dinner-style meals)
- **Snacks**: Quick, portable options with smaller portions (150-300 cal)
- **Lunch**: Balanced midday meals
- **Dinner**: Traditional, complete meals
- **Pre/Post-workout**: Performance-optimized nutrition

---

## Technical Details

The changes will be made to the `systemPrompt` variable in the edge function, adding the new meal-type guidelines section between the existing "MEAL TIMING" and "DIETARY RESTRICTIONS" sections.

