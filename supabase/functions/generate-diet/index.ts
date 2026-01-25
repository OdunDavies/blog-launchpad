import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calorieTarget, dietType, restrictions, mealsPerDay, goal, profile, cuisine } = await req.json();

    console.log("Generating diet plan with:", { calorieTarget, dietType, restrictions, mealsPerDay, goal, cuisine });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // MASSIVE Unified food database - 150+ foods mixing International AND Nigerian/West African
    const unifiedFoodDatabase = `
MASSIVE UNIFIED GLOBAL FITNESS FOOD DATABASE (150+ items):

=== PROTEINS - INTERNATIONAL (20 items) ===
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
- Tofu: 76 cal/100g, 8g P, 2g C, 4.5g F
- Tempeh: 192 cal/100g, 20g P, 8g C, 11g F
- Mackerel: 205 cal/100g, 19g P, 0g C, 14g F
- Sardines: 208 cal/100g, 25g P, 0g C, 11g F
- Halibut: 111 cal/100g, 23g P, 0g C, 2g F
- Beef Steak (lean): 271 cal/100g, 26g P, 0g C, 18g F

=== PROTEINS - NIGERIAN/AFRICAN (20 items) ===
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
- Grilled Croaker Fish: 120 cal/100g, 24g P, 0g C, 2g F
- Smoked Turkey: 145 cal/100g, 28g P, 2g C, 3g F
- Kpomo (soft cow skin): 100 cal/100g, 22g P, 0g C, 1g F
- Isi Ewu (goat head): 230 cal/serving, 20g P, 4g C, 15g F
- Grilled Mackerel (Titus): 200 cal/100g, 20g P, 0g C, 13g F
- Dried Catfish: 310 cal/100g, 55g P, 0g C, 10g F

=== CARBOHYDRATES - INTERNATIONAL (15 items) ===
- Brown Rice: 123 cal/100g, 2.7g P, 26g C, 1g F
- Quinoa: 120 cal/100g, 4.4g P, 21g C, 1.9g F
- Sweet Potato: 86 cal/100g, 1.6g P, 20g C, 0.1g F
- Oatmeal: 68 cal/100g, 2.4g P, 12g C, 1.4g F
- Whole Wheat Bread (2 slices): 160 cal, 8g P, 28g C, 2g F
- Basmati Rice: 130 cal/100g, 2.7g P, 28g C, 0.3g F
- Whole Wheat Pasta: 124 cal/100g, 5g P, 25g C, 0.5g F
- Couscous: 112 cal/100g, 3.8g P, 23g C, 0.2g F
- Bulgur Wheat: 83 cal/100g, 3g P, 19g C, 0.2g F
- White Rice: 130 cal/100g, 2.7g P, 28g C, 0.3g F
- Baked Potato: 93 cal/100g, 2.5g P, 21g C, 0.1g F
- Corn on the Cob: 96 cal/medium, 3g P, 21g C, 1.5g F
- Buckwheat: 92 cal/100g, 3.4g P, 20g C, 0.9g F
- Barley: 123 cal/100g, 2.3g P, 28g C, 0.4g F
- Millet Porridge: 119 cal/100g, 3.5g P, 23g C, 1g F

=== CARBOHYDRATES - NIGERIAN/AFRICAN (20 items) ===
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
- Masa (rice cakes, 3 pieces): 150 cal, 3g P, 25g C, 4g F
- Pap/Ogi (with milk): 120 cal/cup, 4g P, 22g C, 2g F
- Abacha (African Salad): 200 cal/serving, 3g P, 28g C, 9g F
- Ukwa (Breadfruit): 180 cal/100g, 4g P, 35g C, 3g F
- Roasted Corn: 140 cal/medium, 5g P, 29g C, 2g F
- Nigerian Coconut Rice: 220 cal/100g, 4g P, 32g C, 8g F

=== FRUITS - UNIVERSAL (20 items) ===
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
- Plums: 46 cal/medium, 0.7g P, 11g C, 0.3g F
- Cherries: 63 cal/100g, 1g P, 16g C, 0.2g F
- Apricots: 48 cal/100g, 1.4g P, 11g C, 0.4g F
- Honeydew Melon: 36 cal/100g, 0.5g P, 9g C, 0.1g F
- Mixed Berries: 45 cal/100g, 0.8g P, 11g C, 0.3g F

=== FRUITS - AFRICAN (10 items) ===
- Pawpaw (Papaya): 43 cal/100g, 0.5g P, 11g C, 0.3g F
- African Star Apple (Agbalumo): 67 cal/100g, 1g P, 16g C, 0.4g F
- Soursop: 66 cal/100g, 1g P, 17g C, 0.3g F
- African Pear (Ube): 150 cal/100g, 2g P, 12g C, 10g F
- Guava: 68 cal/100g, 2.5g P, 14g C, 1g F
- African Cherry (Agbalumo): 45 cal/100g, 0.8g P, 11g C, 0.3g F
- Fresh Coconut: 354 cal/100g, 3g P, 15g C, 33g F
- Tangerine: 53 cal/medium, 0.8g P, 13g C, 0.3g F
- African Velvet Tamarind (Awin): 115 cal/100g, 2g P, 28g C, 0.5g F
- Garden Egg (raw): 25 cal/100g, 1g P, 6g C, 0.1g F

=== HEALTHY SNACKS - PROTEIN-BASED (12 items) ===
- Greek Yogurt with Berries: 120 cal, 12g P, 15g C, 2g F
- Boiled Eggs (2): 140 cal, 12g P, 1g C, 10g F
- Cottage Cheese with Fruit: 150 cal, 14g P, 15g C, 3g F
- Protein Bar: 200 cal, 20g P, 20g C, 6g F
- String Cheese (2 sticks): 160 cal, 14g P, 2g C, 10g F
- Beef Jerky (30g): 116 cal, 10g P, 3g C, 7g F
- Turkey Roll-Ups: 100 cal, 18g P, 2g C, 2g F
- Hard Boiled Egg Whites (4): 68 cal, 14g P, 1g C, 0g F
- Low-Fat Yogurt Cup: 100 cal, 8g P, 15g C, 1g F
- Smoked Salmon Slice: 80 cal, 14g P, 0g C, 3g F
- Chicken Breast Strip: 90 cal, 18g P, 0g C, 2g F
- Tuna Salad (small): 120 cal, 15g P, 3g C, 5g F

=== HEALTHY SNACKS - NUTS & SEEDS (10 items) ===
- Almonds (handful/28g): 164 cal, 6g P, 6g C, 14g F
- Cashews (handful/28g): 157 cal, 5g P, 9g C, 12g F
- Walnuts (handful/28g): 185 cal, 4g P, 4g C, 18g F
- Pumpkin Seeds (28g): 151 cal, 7g P, 5g C, 13g F
- Mixed Nuts (28g): 172 cal, 5g P, 6g C, 15g F
- Trail Mix (1/4 cup): 180 cal, 5g P, 15g C, 12g F
- Pistachios (28g): 159 cal, 6g P, 8g C, 13g F
- Sunflower Seeds (28g): 165 cal, 6g P, 7g C, 14g F
- Chia Seeds (2 tbsp): 120 cal, 4g P, 10g C, 8g F
- Flax Seeds (2 tbsp): 110 cal, 4g P, 6g C, 9g F

=== HEALTHY SNACKS - FRUIT-BASED (10 items) ===
- Apple with Peanut Butter: 200 cal, 5g P, 25g C, 10g F
- Banana with Almond Butter: 230 cal, 5g P, 30g C, 12g F
- Mixed Fruit Bowl: 100 cal, 1g P, 25g C, 0.5g F
- Berry Smoothie (no sugar): 150 cal, 4g P, 28g C, 3g F
- Frozen Grapes: 62 cal/100g, 0.6g P, 16g C, 0.3g F
- Orange Slices: 62 cal, 1g P, 15g C, 0.2g F
- Melon Cubes: 45 cal, 1g P, 11g C, 0.2g F
- Fresh Pineapple Chunks: 50 cal, 0.5g P, 13g C, 0.1g F
- Sliced Mango: 60 cal, 0.8g P, 15g C, 0.4g F
- Fruit Salad (mixed): 80 cal, 1g P, 20g C, 0.3g F

=== HEALTHY SNACKS - NIGERIAN (12 items) ===
- Kulikuli (groundnut snack, 30g): 150 cal, 7g P, 8g C, 11g F
- Tiger Nuts (Aya, 30g): 120 cal, 2g P, 15g C, 7g F
- Garden Egg with Groundnut: 100 cal, 3g P, 10g C, 6g F
- Roasted Groundnuts (30g): 170 cal, 8g P, 5g C, 14g F
- Coconut Chunks (50g): 180 cal, 2g P, 8g C, 17g F
- Dried Mango Slices (30g): 80 cal, 1g P, 20g C, 0g F
- Toasted Cashews (28g): 160 cal, 5g P, 9g C, 13g F
- Roasted Plantain Chips (30g): 160 cal, 1g P, 22g C, 8g F
- Zobo (Hibiscus, unsweetened): 20 cal/cup, 0g P, 5g C, 0g F
- Kunu (millet drink): 80 cal/cup, 2g P, 16g C, 1g F
- Boiled Corn (1 cob): 90 cal, 3g P, 19g C, 1g F
- Roasted Corn (1 cob): 120 cal, 4g P, 22g C, 2g F

=== HEALTHY SNACKS - LIGHT (8 items) ===
- Rice Cakes with Avocado: 100 cal, 2g P, 12g C, 5g F
- Hummus with Veggies: 130 cal, 4g P, 15g C, 6g F
- Edamame (100g): 120 cal, 11g P, 9g C, 5g F
- Dark Chocolate 70% (30g): 170 cal, 2g P, 13g C, 12g F
- Celery with Peanut Butter: 100 cal, 3g P, 5g C, 8g F
- Carrot Sticks with Hummus: 100 cal, 3g P, 12g C, 5g F
- Cucumber Slices with Tzatziki: 60 cal, 3g P, 5g C, 3g F
- Rice Cake with Cottage Cheese: 80 cal, 6g P, 10g C, 1g F

=== NIGERIAN SOUPS (12 items) ===
- Egusi Soup: 250 cal/serving, 12g P, 8g C, 20g F
- Okra Soup: 80 cal/serving, 4g P, 10g C, 3g F
- Efo Riro: 180 cal/serving, 8g P, 6g C, 14g F
- Ogbono Soup: 200 cal/serving, 10g P, 8g C, 15g F
- Afang Soup: 150 cal/serving, 8g P, 5g C, 11g F
- Edikang Ikong: 160 cal/serving, 10g P, 6g C, 11g F
- Banga Soup: 280 cal/serving, 8g P, 10g C, 24g F
- Pepper Soup (base): 120 cal/serving, 15g P, 5g C, 4g F
- Oha Soup: 170 cal/serving, 9g P, 7g C, 13g F
- Nsala (White Soup): 200 cal/serving, 12g P, 6g C, 15g F
- Groundnut Soup: 220 cal/serving, 10g P, 12g C, 16g F
- Miyan Kuka: 150 cal/serving, 7g P, 8g C, 10g F

=== VEGETABLES (15 items) ===
- Broccoli: 34 cal/100g, 2.8g P, 7g C, 0.4g F
- Spinach: 23 cal/100g, 2.9g P, 3.6g C, 0.4g F
- Mixed Salad: 20 cal/100g, 1.5g P, 3g C, 0.2g F
- Ugu (Pumpkin Leaves): 30 cal/100g, 3g P, 4g C, 0.5g F
- Water Leaf: 25 cal/100g, 2g P, 4g C, 0.3g F
- Ewedu: 25 cal/100g, 2g P, 3g C, 0.5g F
- Bitter Leaf: 20 cal/100g, 2g P, 3g C, 0.3g F
- Scent Leaf: 22 cal/100g, 2g P, 3g C, 0.3g F
- Steamed Vegetables: 50 cal/100g, 2g P, 10g C, 0.5g F
- Roasted Vegetables: 80 cal/100g, 2g P, 12g C, 3g F
- Cucumber: 16 cal/100g, 0.7g P, 4g C, 0.1g F
- Carrots: 41 cal/100g, 0.9g P, 10g C, 0.2g F
- Green Beans: 31 cal/100g, 1.8g P, 7g C, 0.1g F
- Bell Peppers: 31 cal/100g, 1g P, 6g C, 0.3g F
- Asparagus: 20 cal/100g, 2.2g P, 4g C, 0.1g F
`;

    // Map cuisine to mixing instructions - now always 50/50 mix
    const mixingInstructions = `
CUISINE MIXING RULES - CREATE DIVERSE INTERNATIONAL + NIGERIAN/AFRICAN FUSION:
- ALWAYS create a 50/50 mix of International and Nigerian/African foods
- Each day should have meals from BOTH cuisines
- Alternate proteins: Salmon one meal, Suya the next
- Mix carb sources: Quinoa with African proteins, Jollof Rice with grilled chicken
- Include fruits in at least 2 snacks per day
- Use Nigerian soups with international sides and vice versa
- Create unexpected but delicious combinations

${cuisine === 'nigerian' ? 'BIAS: Slightly favor Nigerian foods (60/40 split) but STILL include international options' : ''}
${cuisine === 'west-african' ? 'BIAS: Focus on West African foods (60/40 split) but include international variety' : ''}
${cuisine === 'international' ? 'BALANCE: True 50/50 international and African mix for maximum diversity' : ''}

VARIETY IS KEY:
- Never repeat the same meal within 3 days
- Use different proteins each day
- Alternate between rice types, yam, plantain, oatmeal, quinoa
- Mix cooking styles: grilled, stewed, boiled, roasted, steamed
`;

    // Map goal to macro distribution
    const macroDistribution = {
      'muscle-gain': { protein: 30, carbs: 45, fats: 25 },
      'fat-loss': { protein: 35, carbs: 30, fats: 35 },
      'maintenance': { protein: 25, carbs: 45, fats: 30 },
      'recomposition': { protein: 35, carbs: 35, fats: 30 },
    };

    const macros = macroDistribution[goal as keyof typeof macroDistribution] || macroDistribution.maintenance;

    // Generate meal times and calorie distribution based on mealsPerDay
    const mealConfigs: Record<number, { name: string; time: string; caloriePercent: number; type: string }[]> = {
      3: [
        { name: 'Breakfast', time: '7:00 AM', caloriePercent: 25, type: 'main' },
        { name: 'Lunch', time: '12:30 PM', caloriePercent: 40, type: 'main' },
        { name: 'Dinner', time: '7:00 PM', caloriePercent: 35, type: 'main' },
      ],
      4: [
        { name: 'Breakfast', time: '7:00 AM', caloriePercent: 20, type: 'main' },
        { name: 'Lunch', time: '12:30 PM', caloriePercent: 30, type: 'main' },
        { name: 'Afternoon Snack', time: '4:00 PM', caloriePercent: 15, type: 'snack' },
        { name: 'Dinner', time: '7:30 PM', caloriePercent: 35, type: 'main' },
      ],
      5: [
        { name: 'Breakfast', time: '7:00 AM', caloriePercent: 18, type: 'main' },
        { name: 'Mid-Morning Snack', time: '10:00 AM', caloriePercent: 10, type: 'snack' },
        { name: 'Lunch', time: '1:00 PM', caloriePercent: 28, type: 'main' },
        { name: 'Afternoon Snack', time: '4:00 PM', caloriePercent: 12, type: 'snack' },
        { name: 'Dinner', time: '7:30 PM', caloriePercent: 32, type: 'main' },
      ],
      6: [
        { name: 'Breakfast', time: '6:30 AM', caloriePercent: 15, type: 'main' },
        { name: 'Mid-Morning Snack', time: '9:30 AM', caloriePercent: 10, type: 'snack' },
        { name: 'Lunch', time: '12:30 PM', caloriePercent: 25, type: 'main' },
        { name: 'Afternoon Snack', time: '3:30 PM', caloriePercent: 10, type: 'snack' },
        { name: 'Dinner', time: '6:30 PM', caloriePercent: 30, type: 'main' },
        { name: 'Evening Snack', time: '9:00 PM', caloriePercent: 10, type: 'snack' },
      ],
    };

    const mealConfig = mealConfigs[mealsPerDay] || mealConfigs[3];
    const mealConfigText = mealConfig.map(m => 
      `${m.name} (${m.time}): ${m.caloriePercent}% of daily calories (~${Math.round(calorieTarget * m.caloriePercent / 100)} cal) - ${m.type.toUpperCase()}`
    ).join('\n');

    const systemPrompt = `You are an expert nutritionist creating personalized, culturally diverse meal plans. You have access to a MASSIVE unified food database with 150+ items mixing International AND Nigerian/West African foods.

${unifiedFoodDatabase}

${mixingInstructions}

MACRO TARGETS FOR THIS PLAN:
- Daily Calories: ${calorieTarget} kcal
- Protein: ${macros.protein}% (${Math.round((calorieTarget * macros.protein / 100) / 4)}g)
- Carbohydrates: ${macros.carbs}% (${Math.round((calorieTarget * macros.carbs / 100) / 4)}g)
- Fats: ${macros.fats}% (${Math.round((calorieTarget * macros.fats / 100) / 9)}g)

MEALS PER DAY: ${mealsPerDay}

MEAL-TIME CALORIE DISTRIBUTION (CRITICAL - FOLLOW EXACTLY):
${mealConfigText}

=== MEAL-TIME SPECIFIC RULES ===

BREAKFAST (15-20% of daily calories):
- Light, energizing, easy to digest
- Structure: 1 protein + 1 complex carb OR fruit + optional light side
- Good combos: Eggs + Oatmeal + Banana, Akara + Pap + Pawpaw, Toast + Scrambled Eggs + Orange
- ALWAYS include 1 fruit

SNACKS (10-15% each, 150-250 cal MAX):
- MUST be simple: 1-3 items ONLY
- MUST be grab-and-go portable foods
- Morning snack: PRIORITIZE FRUITS (fruit + nuts combo)
- Afternoon snack: Protein-focused (Greek yogurt, boiled eggs, kulikuli)
- Evening snack (if applicable): Light protein only (cottage cheese, almonds)
- EACH DAY must have at least 1 fruit-based snack
- Examples: Apple + Almonds, Banana, Greek Yogurt + Berries, Kulikuli + Orange, Tiger Nuts

LUNCH (25-30% of daily calories):
- Most substantial meal of the day
- Structure: Protein + Carb + Vegetable/Soup
- Mix cuisines: Jollof Rice + Grilled Fish + Salad, Quinoa + Suya + Steamed Veggies
- Include colorful vegetables

DINNER (25-35% of daily calories):
- Protein-heavy, moderate carbs
- Structure: Larger protein portion + moderate carb + vegetables
- Can be heavier if eating before 8pm
- Examples: Grilled Steak + Sweet Potato + Asparagus, Eba + Egusi + Assorted Meat, Salmon + Brown Rice + Roasted Vegetables

=== NIGERIAN MEAL PAIRING RULES (CRITICAL - MUST FOLLOW) ===

SWALLOW + SOUP COMBINATIONS (LUNCH/DINNER ONLY - NEVER BREAKFAST):
- Swallows: Eba, Pounded Yam, Amala, Fufu, Tuwo Shinkafa, Starch
- Pair ONLY with Nigerian soups: Egusi, Ogbono, Efo Riro, Afang, Edikang Ikong, Oha, Banga, Nsala
- The soup IS the protein/vegetable component - do NOT add extra protein when using soup
- NEVER serve swallow+soup for breakfast - this is WRONG

BOILED YAM PAIRINGS (IMPORTANT):
- GOOD pairings: Egg sauce, Fried eggs, Fish stew (tomato-based), Pepper sauce, Palm oil sauce
- BAD pairings: Ogbono soup, Egusi soup, Okra soup, Efo Riro (these NEED swallows like Eba/Pounded Yam)
- Boiled Yam + Ogbono is CULTURALLY INCORRECT - NEVER do this

FRIED PLANTAIN (DODO) PAIRINGS:
- Good: Jollof rice, Fried rice, Beans, Scrambled eggs, Stew, as side dish
- Can also be standalone snack

RICE PAIRINGS:
- Jollof Rice → With: Grilled/fried chicken, Fish, Plantain, Salad, Coleslaw
- Fried Rice → With: Chicken, Beef, Shrimp, Plantain
- White Rice → With: Stews (tomato, chicken, beef), Beans
- Rice dishes are for LUNCH/DINNER only, not breakfast

BREAKFAST APPROPRIATE (Nigerian):
- Akara + Pap (Ogi) + fruit
- Moi Moi + Custard or Pap
- Bread + Eggs (scrambled, fried, omelette)
- Bread + Beans
- Yam + Egg sauce or Fried eggs (NOT with draw soups!)
- Tea + Bread/Toast
- Oatmeal + Banana + Eggs

BREAKFAST INAPPROPRIATE (NEVER USE FOR BREAKFAST):
- Swallow + Soup (too heavy, culturally wrong time)
- Jollof Rice, Fried Rice (lunch/dinner foods)
- Pepper Soup (evening food)
- Boiled Yam + Ogbono/Egusi/Efo Riro (WRONG pairing)

=== SNACK CONSTRAINTS (VERY IMPORTANT) ===
1. Maximum 3 items per snack - NEVER MORE
2. Each day MUST have at least 1 fruit-based snack
3. Snacks should NOT include heavy main-meal foods like rice, pasta, eba, pounded yam, soups
4. Keep snacks simple and portable
5. Include fruits: Banana, Apple, Orange, Mango, Pawpaw, Watermelon, Berries
6. Nigerian snack options: Kulikuli, Tiger Nuts, Roasted Groundnuts, Boiled Corn, Coconut Chunks
7. Snacks are NEVER swallow + soup combinations - those are main meals only

DIETARY RESTRICTIONS TO AVOID: \${restrictions.length > 0 ? restrictions.join(', ') : 'None'}

DIET TYPE: ${dietType}
${dietType === 'low-carb' ? '- Keep carbs under 100g/day. Focus on proteins and healthy fats.' : ''}
${dietType === 'high-protein' ? '- Prioritize protein in every meal: meat, fish, eggs, dairy, legumes' : ''}
${dietType === 'vegetarian' ? '- No meat or fish. Use: Eggs, Tofu, Greek Yogurt, Beans, Moi Moi, Akara' : ''}
${dietType === 'vegan' ? '- No animal products. Use: Tofu, Tempeh, Beans, Moi Moi, Akara, Plantain' : ''}
${dietType === 'mediterranean' ? '- Focus on olive oil, fish, whole grains, vegetables, legumes, nuts' : ''}
${dietType === 'balanced' ? '- Balanced mix of proteins, carbs, and fats from whole food sources' : ''}

Create a 7-day meal plan. Each food item must include its portion size and individual macros.`;

    const userPrompt = `Create a personalized 7-day meal plan for a ${profile?.gender || 'person'} with a ${goal.replace('-', ' ')} goal.

Mix of cuisines: ${cuisine === 'nigerian' ? 'Nigerian-focused with international variety' : cuisine === 'west-african' ? 'West African-focused with international variety' : 'True 50/50 international and Nigerian/African mix'}
Daily target: ${calorieTarget} calories
Diet approach: ${dietType}
Meals per day: ${mealsPerDay}
${restrictions.length > 0 ? `Avoid: ${restrictions.join(', ')}` : ''}

REMEMBER:
- Breakfast should be LIGHT (15-20% calories)
- Snacks should be SIMPLE (1-3 items, 150-250 cal max)
- Include FRUITS in snacks (at least 1 fruit snack per day)
- Mix Nigerian AND international foods for variety
- Never repeat the same main dish within 3 days

Generate varied, delicious meals that hit the macro targets.`;

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_diet_plan",
              description: "Generate a structured 7-day diet plan with meals and nutritional information",
              parameters: {
                type: "object",
                properties: {
                  mealPlan: {
                    type: "array",
                    description: "Array of 7 day plans",
                    items: {
                      type: "object",
                      properties: {
                        day: {
                          type: "string",
                          description: "Day name (e.g., 'Day 1 - Monday')",
                        },
                        totalCalories: {
                          type: "number",
                          description: "Total calories for the day",
                        },
                        totalProtein: {
                          type: "number",
                          description: "Total protein in grams",
                        },
                        totalCarbs: {
                          type: "number",
                          description: "Total carbs in grams",
                        },
                        totalFat: {
                          type: "number",
                          description: "Total fat in grams",
                        },
                        meals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: {
                                type: "string",
                                description: "Name of the meal (e.g., 'Breakfast', 'Lunch')",
                              },
                              time: {
                                type: "string",
                                description: "Time of the meal (e.g., '7:00 AM')",
                              },
                              foods: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    name: {
                                      type: "string",
                                      description: "Name of the food item",
                                    },
                                    portion: {
                                      type: "string",
                                      description: "Portion size (e.g., '100g', '1 cup', '2 pieces')",
                                    },
                                    calories: {
                                      type: "number",
                                      description: "Calories for this portion",
                                    },
                                    protein: {
                                      type: "number",
                                      description: "Protein in grams",
                                    },
                                    carbs: {
                                      type: "number",
                                      description: "Carbs in grams",
                                    },
                                    fat: {
                                      type: "number",
                                      description: "Fat in grams",
                                    },
                                  },
                                  required: ["name", "portion", "calories", "protein", "carbs", "fat"],
                                },
                                description: "List of food items in this meal",
                              },
                            },
                            required: ["name", "time", "foods"],
                          },
                        },
                      },
                      required: ["day", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "meals"],
                    },
                  },
                },
                required: ["mealPlan"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_diet_plan" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_diet_plan") {
      console.error("Invalid AI response structure:", JSON.stringify(data));
      throw new Error("Invalid response from AI");
    }

    const dietPlan = JSON.parse(toolCall.function.arguments);
    console.log("Diet plan generated successfully with", dietPlan.mealPlan?.length, "days");

    return new Response(JSON.stringify(dietPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
