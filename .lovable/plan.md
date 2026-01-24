

# Add Nigerian Cuisine Support to Diet Generator

## Overview
Add a new cuisine preference option to the diet generator wizard that allows users to select Nigerian food as their primary cuisine, with high-protein Nigerian dishes and ingredients.

---

## Nigerian High-Protein Foods to Include

### Protein Sources
| Food | Portion | Calories | Protein | Carbs | Fat |
|------|---------|----------|---------|-------|-----|
| Grilled Chicken Suya | 150g | 280 | 42g | 2g | 12g |
| Fried Fish (Tilapia) | 150g | 220 | 38g | 2g | 7g |
| Goat Meat (Asun) | 100g | 165 | 28g | 0g | 6g |
| Beef (Kilishi) | 50g | 130 | 22g | 3g | 4g |
| Grilled Croaker Fish | 150g | 200 | 36g | 0g | 5g |
| Stockfish (Panla) | 100g | 110 | 24g | 0g | 1g |
| Smoked Catfish | 100g | 180 | 30g | 0g | 6g |
| Eggs (Boiled) | 2 large | 140 | 12g | 1g | 10g |
| Kpomo (Cow Skin) | 100g | 100 | 15g | 0g | 4g |
| Snails (Igbin) | 100g | 90 | 16g | 2g | 1g |

### Nigerian Carb Sources
| Food | Portion | Calories | Protein | Carbs | Fat |
|------|---------|----------|---------|-------|-----|
| Ofada Rice | 150g cooked | 180 | 4g | 38g | 1g |
| Yam (Boiled) | 150g | 170 | 2g | 40g | 0g |
| Plantain (Boiled/Grilled) | 1 medium | 180 | 2g | 46g | 0g |
| Brown Beans (Ewa) | 150g cooked | 200 | 14g | 34g | 1g |
| Moi Moi (Steamed Bean Cake) | 1 wrap | 180 | 11g | 20g | 6g |
| Amala (Yam Flour) | 150g | 160 | 2g | 38g | 0g |
| Fufu (Cassava) | 150g | 190 | 1g | 46g | 0g |
| Akara (Bean Fritters) | 4 pieces | 200 | 10g | 18g | 10g |
| Garri (Eba) | 150g | 200 | 1g | 48g | 0g |

### Nigerian Soups & Stews (Protein-Rich)
| Food | Portion | Calories | Protein | Carbs | Fat |
|------|---------|----------|---------|-------|-----|
| Egusi Soup | 200g | 280 | 18g | 8g | 20g |
| Efo Riro (Spinach Stew) | 200g | 200 | 15g | 6g | 14g |
| Ogbono Soup | 200g | 240 | 16g | 10g | 16g |
| Pepper Soup (Fish/Goat) | 300ml | 180 | 22g | 4g | 8g |
| Ayamase (Ofada Stew) | 100g | 220 | 12g | 4g | 18g |
| Edikang Ikong | 200g | 180 | 16g | 8g | 10g |
| Ofe Nsala (White Soup) | 200g | 200 | 20g | 6g | 10g |
| Banga Soup | 200g | 260 | 14g | 8g | 20g |

### Vegetables & Sides
| Food | Portion | Calories | Protein | Carbs | Fat |
|------|---------|----------|---------|-------|-----|
| Ugwu (Pumpkin Leaves) | 100g | 30 | 4g | 4g | 0g |
| Bitter Leaf (Onugbu) | 100g | 25 | 3g | 4g | 0g |
| Garden Egg | 100g | 25 | 1g | 5g | 0g |
| Okra | 100g | 33 | 2g | 7g | 0g |

---

## Implementation Plan

### 1. Add New Wizard Step: Cuisine Preference

Create a new step between "Meals" and "Review" that allows users to select their preferred cuisine style.

**New File: `src/components/diet-wizard/StepCuisine.tsx`**

Cuisine options:
- **International Mix** (default): Varied global foods
- **Nigerian**: Traditional Nigerian dishes with high protein
- **West African**: Broader West African cuisine
- *(Future: More cuisines can be added)*

### 2. Update Wizard Flow

| Current Steps | New Steps |
|---------------|-----------|
| 1. Goal | 1. Goal |
| 2. Profile | 2. Profile |
| 3. Calories | 3. Calories |
| 4. Diet Type | 4. Diet Type |
| 5. Restrictions | 5. Restrictions |
| 6. Meals | 6. Meals |
| 7. Review | 7. Cuisine |
| | 8. Review |

### 3. Update Edge Function

Modify `supabase/functions/generate-diet/index.ts` to:
- Accept a new `cuisine` parameter
- Add Nigerian food database to the AI prompt
- Include cooking instructions for Nigerian dishes
- Ensure protein emphasis across all meals

### 4. Update Type Definitions

Add cuisine preference to the `DietPlan` type in `src/types/diet.ts`.

---

## UI Design for Cuisine Step

```text
┌─────────────────────────────────────────┐
│         🍽️                              │
│   Choose your cuisine preference        │
│   Select foods you're familiar with     │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │ ○ 🌍 International Mix          │    │
│  │   Varied global cuisines        │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ● 🇳🇬 Nigerian                   │    │
│  │   Traditional Nigerian dishes   │    │
│  │   with high protein focus       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ○ 🌾 West African               │    │
│  │   Regional West African foods   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/diet.ts` | Add `cuisine` field to DietPlan type |
| `src/components/diet-wizard/StepCuisine.tsx` | **NEW** - Cuisine selection component |
| `src/components/DietGenerator.tsx` | Add cuisine state, update wizard steps |
| `supabase/functions/generate-diet/index.ts` | Add Nigerian food database and cuisine handling |
| `src/utils/downloadDietPdf.ts` | Display cuisine type in PDF |

---

## Sample Nigerian Meal Day

**Example: Muscle Gain - 2800 kcal Nigerian Plan**

| Meal | Foods | Macros |
|------|-------|--------|
| **Breakfast (7 AM)** | Moi Moi (2 wraps), Boiled Eggs (3), Akamu (Pap) with milk | 450 cal, 32g P |
| **Snack (10 AM)** | Roasted Groundnuts (50g), 1 Banana | 280 cal, 12g P |
| **Lunch (1 PM)** | Ofada Rice (200g), Ayamase Stew, Grilled Chicken (150g), Plantain | 680 cal, 45g P |
| **Pre-Workout (4 PM)** | Boiled Yam (100g), Egg Sauce (2 eggs) | 320 cal, 16g P |
| **Dinner (7 PM)** | Amala, Ewedu + Gbegiri, Goat Meat (150g), Fish | 650 cal, 48g P |
| **Night Snack (9 PM)** | Tiger Nut Milk (Kunun Aya) with Protein | 320 cal, 28g P |

**Daily Total: ~2700 kcal, 181g protein**

---

## Benefits

1. **Cultural relevance** - Users get familiar foods they enjoy
2. **High protein** - Nigerian cuisine naturally includes protein-rich options
3. **Sustainable adherence** - People stick to diets with foods they love
4. **Accurate nutrition** - AI has Nigerian food data for proper macro counting
5. **Extensible** - Framework allows adding more cuisines later

