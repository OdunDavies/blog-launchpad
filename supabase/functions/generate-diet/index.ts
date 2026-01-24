import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calorieTarget, dietType, restrictions, mealsPerDay, goal, profile, cuisine } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating diet plan:", { calorieTarget, dietType, restrictions, mealsPerDay, goal, profile, cuisine });

    // Build goal-specific instructions
    const goalInstructions = getGoalInstructions(goal);
    const profileContext = getProfileContext(profile);
    const cuisineInstructions = getCuisineInstructions(cuisine);

    const systemPrompt = `You are a certified nutritionist and meal planning expert specializing in body composition and muscle building. Create personalized 7-day meal plans optimized for the user's specific fitness goal.

=== USER CONTEXT ===
${profileContext}

=== GOAL-SPECIFIC STRATEGY ===
${goalInstructions}

=== CUISINE PREFERENCE ===
${cuisineInstructions}

=== MACRO DISTRIBUTION BY DIET TYPE ===

BALANCED: 30% protein, 40% carbs, 30% fat
HIGH-PROTEIN: 40% protein, 35% carbs, 25% fat
LOW-CARB: 35% protein, 20% carbs, 45% fat
MEDITERRANEAN: 25% protein, 45% carbs, 30% fat (olive oil, fish, whole grains)
VEGETARIAN: 25% protein, 50% carbs, 25% fat (no meat)
VEGAN: 20% protein, 55% carbs, 25% fat (plant-based only)

=== MEAL TIMING FOR MUSCLE GROWTH ===

OPTIMAL TIMING:
- Pre-workout meal: 2-3 hours before training (moderate protein + complex carbs)
- Post-workout meal: Within 1-2 hours after training (high protein + fast carbs)
- Protein distribution: Spread 25-40g protein across each meal for optimal MPS (muscle protein synthesis)

MEAL SCHEDULES:
3 MEALS: Breakfast (7-8 AM), Lunch (12-1 PM), Dinner (6-7 PM)
4 MEALS: Breakfast (7 AM), Lunch (12 PM), Snack (3 PM), Dinner (7 PM)
5 MEALS: Breakfast (7 AM), Snack (10 AM), Lunch (12:30 PM), Snack (4 PM), Dinner (7 PM)
6 MEALS: Breakfast (7 AM), Snack (9:30 AM), Lunch (12 PM), Snack (3 PM), Dinner (6 PM), Snack (8:30 PM)

=== MEAL-TYPE-SPECIFIC FOOD GUIDELINES ===

BREAKFAST (Morning meals - Light to moderate portions):
- Easy-to-digest, energizing foods to start the day
- Include protein for satiety (15-30g)
- International: eggs (scrambled, omelette, boiled), oatmeal with protein, Greek yogurt with granola, smoothies with protein powder, whole grain toast with eggs, pancakes with protein
- Nigerian: Akamu/Pap with milk, Akara (bean fritters), Moi Moi, Yam with egg sauce, Bread with omelette, Boiled yam/plantain with fish
- West African: Koose (bean cakes), Hausa Koko (millet porridge), Tom Brown porridge with groundnuts

SNACKS (Between meals - Quick, portable, 150-300 calories):
- Protein-rich for muscle support (10-20g protein)
- Easy to prepare or grab-and-go
- Smaller portions - NOT full meals
- International: handful of nuts (30-50g), fresh fruit, protein bars, hard-boiled eggs (2-3), cheese cubes, rice cakes with nut butter, beef jerky, protein shake
- Nigerian: Roasted groundnuts (50g), Beef Kilishi (dried meat), Boiled eggs (2-3), Roasted corn, Plantain chips (small portion), Tiger nut milk (Kunun Aya), Garden eggs with groundnut paste, Chin Chin (small portion), Single Moi Moi wrap, Fresh fruits (oranges, mangoes, pawpaw)
- West African: Kofi (fried plantain chips), Roasted cashews, Kelewele (spiced fried plantain - small portion), Tigernuts

LUNCH (Midday meal - Balanced and moderate portions):
- Good mix of protein, carbs, and vegetables
- Sustaining energy for afternoon (400-700 calories typically)
- International: rice bowls with grilled protein, salads with chicken/fish, sandwiches with lean protein, pasta dishes with meat sauce, grain bowls with vegetables
- Nigerian: Jollof rice with grilled chicken, Ofada rice with Ayamase, Rice and beans (Ewa) with fish, Fried rice with chicken, White rice with vegetable stew and fish
- West African: Thieboudienne, Waakye with fish, Banku with tilapia

DINNER (Evening meal - Can be larger, traditional portions):
- Complete protein sources (30-50g protein)
- Traditional full meals with sides
- Larger portions if calorie budget allows
- International: grilled steak/chicken with vegetables and potatoes, fish with rice and salad, stir-fry with protein and rice, stews with grains
- Nigerian: Eba/Amala/Pounded Yam with soup (Egusi, Efo Riro, Ogbono) and assorted meat/fish, Fufu with Ofe Nsala and goat meat, Tuwo with Miyan Kuka
- West African: Fufu with groundnut soup, Konkonte with palm nut soup, Omotuo with palm nut soup

PRE-WORKOUT (1-2 hours before training):
- Moderate protein (15-25g) + complex carbs
- Easily digestible - avoid heavy fats that slow digestion
- International: banana with nut butter, oatmeal with protein, rice cakes with honey, toast with eggs
- Nigerian: Boiled yam (small portion), Moi Moi (1 wrap), Boiled plantain, Akamu/Pap with milk
- West African: Kooko with bread, Boiled plantain with groundnuts

POST-WORKOUT (Within 1 hour after training):
- High protein (30-40g) + fast-acting carbs for recovery
- Replenish glycogen stores
- International: protein shake with banana, chicken with white rice, eggs with toast, Greek yogurt with fruit
- Nigerian: Boiled yam with grilled fish/chicken, White rice with chicken, Ofada rice with egg sauce and fish
- West African: Rice balls with groundnut soup, Jollof rice with grilled tilapia

IMPORTANT: Match the meal type to appropriate foods. Snacks should be SMALL and QUICK, not full meals. Breakfast should be lighter than dinner.

=== DIETARY RESTRICTIONS HANDLING ===

GLUTEN-FREE: Avoid wheat, barley, rye. Use rice, quinoa, potatoes.
DAIRY-FREE: No milk, cheese, yogurt. Use plant-based alternatives.
NUT-FREE: No tree nuts or peanuts. Use seeds instead.
SHELLFISH-FREE: No shrimp, crab, lobster. Use other fish or meat.
EGG-FREE: No eggs. Use tofu scramble, chia eggs.
SOY-FREE: No tofu, tempeh, soy sauce. Use other proteins.
HALAL: Use halal-certified meat. No pork or alcohol.
KOSHER: Follow kosher rules. No pork, shellfish.

=== VARIETY & QUALITY RULES ===

1. Each day should have different main dishes
2. Vary protein sources across days (don't repeat same protein 2 days in a row)
3. Include 2-3 servings of vegetables per day minimum
4. Balance colorful foods for micronutrient variety
5. Adjust portion sizes to hit calorie targets
6. Prioritize whole foods over processed options
7. Include fiber-rich foods for satiety (25-35g daily)

=== OUTPUT REQUIREMENTS ===

1. Generate a 7-day meal plan
2. Each day must have the specified number of meals
3. Total daily calories should be within 50 kcal of target
4. Respect all dietary restrictions
5. Include realistic portion sizes
6. Vary meals across days
7. Include pre/post workout nutrition when relevant`;

    const restrictionsText = restrictions.length > 0 
      ? `Dietary Restrictions: ${restrictions.join(', ')}`
      : 'No dietary restrictions';

    const cuisineText = cuisine === 'nigerian' 
      ? 'Use ONLY Nigerian foods and dishes. This is critical - every meal must feature authentic Nigerian cuisine.'
      : cuisine === 'west-african'
      ? 'Use primarily West African foods and dishes from the region.'
      : 'Use a variety of international cuisines.';

    const userPrompt = `Create a 7-day meal plan with these requirements:

Daily Calorie Target: ${calorieTarget} kcal
Diet Type: ${dietType}
Meals Per Day: ${mealsPerDay}
${restrictionsText}
${goal ? `Primary Goal: ${goal}` : ''}
${profile ? `Training Frequency: ${profile.trainingDays} days per week` : ''}
Cuisine: ${cuisineText}

Generate a complete weekly meal plan with specific foods, portions, and accurate nutritional information for each meal. Make sure daily totals are close to the calorie target.

${goal === 'muscle-gain' ? 'Focus on high-leucine protein sources and strategic carb timing around workouts.' : ''}
${goal === 'fat-loss' ? 'Prioritize protein and fiber for satiety while maintaining the calorie deficit.' : ''}
${goal === 'recomposition' ? 'Emphasize protein timing and include both strength and recovery nutrition.' : ''}`;

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
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_diet_plan",
              description: "Generate a structured 7-day meal plan with detailed nutritional information optimized for body composition goals",
              parameters: {
                type: "object",
                properties: {
                  mealPlan: {
                    type: "array",
                    description: "Array of 7 days with meal plans",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string", description: "Day label, e.g., 'Day 1' or 'Monday'" },
                        totalCalories: { type: "number", description: "Total calories for the day" },
                        totalProtein: { type: "number", description: "Total protein in grams" },
                        totalCarbs: { type: "number", description: "Total carbs in grams" },
                        totalFat: { type: "number", description: "Total fat in grams" },
                        meals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string", description: "Meal name, e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'" },
                              time: { type: "string", description: "Suggested meal time, e.g., '7:00 AM'" },
                              foods: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    name: { type: "string", description: "Food item name" },
                                    portion: { type: "string", description: "Portion size, e.g., '150g', '1 cup', '2 slices'" },
                                    calories: { type: "number", description: "Calories for this portion" },
                                    protein: { type: "number", description: "Protein in grams" },
                                    carbs: { type: "number", description: "Carbs in grams" },
                                    fat: { type: "number", description: "Fat in grams" }
                                  },
                                  required: ["name", "portion", "calories", "protein", "carbs", "fat"],
                                  additionalProperties: false
                                }
                              }
                            },
                            required: ["name", "time", "foods"],
                            additionalProperties: false
                          }
                        }
                      },
                      required: ["day", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "meals"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["mealPlan"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_diet_plan" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_diet_plan") {
      throw new Error("Invalid AI response format");
    }

    const dietPlan = JSON.parse(toolCall.function.arguments);
    console.log("Diet plan generated successfully");
    
    return new Response(JSON.stringify(dietPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating diet plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getGoalInstructions(goal: string): string {
  switch (goal) {
    case 'muscle-gain':
      return `MUSCLE GAIN STRATEGY:
- Caloric surplus of 300-500 kcal above TDEE
- Protein target: 2.0-2.2g per kg body weight (prioritize leucine-rich sources)
- Carbs: Higher intake (45-50% of calories) to fuel training and recovery
- Strategic carb timing: More carbs around workouts
- Post-workout meal should contain 40g+ protein + fast-acting carbs
- Pre-sleep protein (casein or cottage cheese) for overnight muscle protein synthesis
- Include creatine-rich foods (red meat, fish)`;

    case 'fat-loss':
      return `FAT LOSS STRATEGY:
- Caloric deficit of 400-500 kcal below TDEE
- Protein target: 2.2-2.5g per kg body weight (preserve muscle mass)
- Higher fiber intake (30-40g) for satiety
- Prioritize protein and vegetables at every meal
- Limit refined carbs and added sugars
- Include thermogenic foods (green tea, peppers, lean proteins)
- Front-load calories earlier in the day
- Volume eating with low-calorie, high-fiber vegetables`;

    case 'recomposition':
      return `BODY RECOMPOSITION STRATEGY:
- Slight caloric deficit (100-200 kcal below TDEE) or maintenance
- Very high protein: 2.2-2.4g per kg body weight
- Carb cycling: Higher carbs on training days, lower on rest days
- Prioritize nutrient timing around workouts
- Focus on protein quality and leucine content
- Include both strength-building and recovery-focused meals
- Adequate sleep nutrition (casein before bed)`;

    case 'maintenance':
    default:
      return `MAINTENANCE STRATEGY:
- Calories at TDEE level
- Balanced macronutrient distribution
- Protein target: 1.6-2.0g per kg body weight
- Focus on whole foods and micronutrient density
- Consistent meal timing for metabolic health
- Include variety for long-term sustainability`;
  }
}

function getProfileContext(profile: any): string {
  if (!profile) return 'No profile data provided.';

  const weightKg = profile.weightUnit === 'lbs' 
    ? (profile.weight * 0.453592).toFixed(1) 
    : profile.weight;

  return `User Profile:
- Gender: ${profile.gender}
- Age: ${profile.age} years
- Weight: ${weightKg} kg
- Activity Level: ${profile.activityLevel}
- Training Days: ${profile.trainingDays} days per week

Based on this profile, adjust portion sizes and protein targets accordingly.
Protein recommendation: ${(parseFloat(weightKg) * 2).toFixed(0)}g minimum per day for muscle building goals.`;
}

function getCuisineInstructions(cuisine: string): string {
  switch (cuisine) {
    case 'nigerian':
      return `NIGERIAN CUISINE - USE THESE FOODS EXCLUSIVELY:

=== HIGH-PROTEIN NIGERIAN FOODS ===

PROTEIN SOURCES (prioritize these):
- Grilled Chicken Suya (150g): 280 cal, 42g protein, 2g carbs, 12g fat
- Fried Fish (Tilapia, 150g): 220 cal, 38g protein, 2g carbs, 7g fat
- Goat Meat / Asun (100g): 165 cal, 28g protein, 0g carbs, 6g fat
- Beef Kilishi (50g): 130 cal, 22g protein, 3g carbs, 4g fat
- Grilled Croaker Fish (150g): 200 cal, 36g protein, 0g carbs, 5g fat
- Stockfish / Panla (100g): 110 cal, 24g protein, 0g carbs, 1g fat
- Smoked Catfish (100g): 180 cal, 30g protein, 0g carbs, 6g fat
- Eggs / Boiled Eggs (2 large): 140 cal, 12g protein, 1g carbs, 10g fat
- Kpomo / Cow Skin (100g): 100 cal, 15g protein, 0g carbs, 4g fat
- Snails / Igbin (100g): 90 cal, 16g protein, 2g carbs, 1g fat
- Dried Shrimp / Crayfish (30g): 70 cal, 14g protein, 1g carbs, 1g fat

NIGERIAN CARB SOURCES:
- Ofada Rice (150g cooked): 180 cal, 4g protein, 38g carbs, 1g fat
- Boiled Yam (150g): 170 cal, 2g protein, 40g carbs, 0g fat
- Boiled/Grilled Plantain (1 medium): 180 cal, 2g protein, 46g carbs, 0g fat
- Brown Beans / Ewa (150g cooked): 200 cal, 14g protein, 34g carbs, 1g fat
- Moi Moi (1 wrap): 180 cal, 11g protein, 20g carbs, 6g fat
- Amala / Yam Flour (150g): 160 cal, 2g protein, 38g carbs, 0g fat
- Fufu / Cassava (150g): 190 cal, 1g protein, 46g carbs, 0g fat
- Akara / Bean Fritters (4 pieces): 200 cal, 10g protein, 18g carbs, 10g fat
- Garri / Eba (150g): 200 cal, 1g protein, 48g carbs, 0g fat
- Jollof Rice (200g): 320 cal, 6g protein, 52g carbs, 10g fat
- Fried Rice (200g): 340 cal, 8g protein, 48g carbs, 12g fat
- White Rice (150g cooked): 190 cal, 4g protein, 42g carbs, 0g fat
- Akamu/Pap/Ogi (1 cup with milk): 180 cal, 6g protein, 32g carbs, 4g fat

NIGERIAN SOUPS & STEWS (high protein):
- Egusi Soup (200g): 280 cal, 18g protein, 8g carbs, 20g fat
- Efo Riro / Spinach Stew (200g): 200 cal, 15g protein, 6g carbs, 14g fat
- Ogbono Soup (200g): 240 cal, 16g protein, 10g carbs, 16g fat
- Pepper Soup - Fish/Goat (300ml): 180 cal, 22g protein, 4g carbs, 8g fat
- Ayamase / Ofada Stew (100g): 220 cal, 12g protein, 4g carbs, 18g fat
- Edikang Ikong (200g): 180 cal, 16g protein, 8g carbs, 10g fat
- Ofe Nsala / White Soup (200g): 200 cal, 20g protein, 6g carbs, 10g fat
- Banga Soup (200g): 260 cal, 14g protein, 8g carbs, 20g fat
- Ewedu + Gbegiri (200g): 150 cal, 10g protein, 12g carbs, 8g fat
- Okra Soup (200g): 120 cal, 12g protein, 10g carbs, 6g fat

VEGETABLES & SIDES:
- Ugwu / Pumpkin Leaves (100g): 30 cal, 4g protein, 4g carbs, 0g fat
- Bitter Leaf / Onugbu (100g): 25 cal, 3g protein, 4g carbs, 0g fat
- Garden Egg (100g): 25 cal, 1g protein, 5g carbs, 0g fat
- Okra (100g): 33 cal, 2g protein, 7g carbs, 0g fat
- Vegetable Salad (150g): 40 cal, 2g protein, 8g carbs, 0g fat

SNACKS & DRINKS:
- Roasted Groundnuts (50g): 280 cal, 13g protein, 8g carbs, 24g fat
- Tiger Nut Milk / Kunun Aya (300ml): 200 cal, 4g protein, 30g carbs, 8g fat
- Chin Chin (50g): 230 cal, 3g protein, 28g carbs, 12g fat
- Plantain Chips (50g): 260 cal, 1g protein, 32g carbs, 14g fat
- Roasted Corn (1 cob): 90 cal, 3g protein, 19g carbs, 1g fat
- Zobo Drink (300ml, unsweetened): 20 cal, 0g protein, 5g carbs, 0g fat

MEAL COMBINATION EXAMPLES:
- Breakfast: Akamu with milk + Akara + Boiled Eggs
- Breakfast: Yam with Egg Sauce
- Lunch: Ofada Rice with Ayamase + Grilled Fish
- Lunch: Jollof Rice + Fried Plantain + Grilled Chicken
- Dinner: Amala with Ewedu/Gbegiri + Goat Meat + Stockfish
- Dinner: Eba with Egusi Soup + Assorted Meat
- Snack: Moi Moi + Pap
- Post-workout: Boiled Yam + Grilled Fish

IMPORTANT: Every meal must feature authentic Nigerian dishes. No Western foods.`;

    case 'west-african':
      return `WEST AFRICAN CUISINE - Use foods from Nigeria, Ghana, Senegal, and the region:

PROTEIN SOURCES:
- Grilled meats (suya, kebabs, grilled fish)
- Fish stews and soups
- Groundnut/peanut-based protein dishes
- Bean dishes (black-eyed peas, brown beans)
- Smoked and dried fish

CARB SOURCES:
- Jollof rice (Nigerian, Ghanaian, Senegalese styles)
- Fufu varieties (cassava, yam, plantain)
- Banku and Kenkey (Ghanaian)
- Thieboudienne (Senegalese)
- Fried and boiled plantains
- Yam dishes

SOUPS & STEWS:
- Groundnut soup
- Palava sauce
- Light soup
- Pepper soup varieties
- Okra-based soups
- Kontomire stew

Include diverse West African dishes while meeting protein and calorie targets.`;

    case 'international':
    default:
      return `INTERNATIONAL CUISINE - Use a variety of global foods:

=== MUSCLE-BUILDING FOOD PRIORITIES ===

HIGH LEUCINE PROTEINS (prioritize for muscle growth):
- Chicken Breast (grilled, 150g): 250 cal, 47g protein, 0g carbs, 5g fat
- Salmon Fillet (baked, 150g): 280 cal, 39g protein, 0g carbs, 13g fat
- Lean Ground Beef (100g): 170 cal, 26g protein, 0g carbs, 7g fat
- Eggs (2 large): 140 cal, 12g protein, 1g carbs, 10g fat
- Greek Yogurt (200g): 130 cal, 20g protein, 8g carbs, 2g fat
- Whey Protein (1 scoop, 30g): 120 cal, 24g protein, 2g carbs, 1g fat
- Cottage Cheese (150g): 110 cal, 14g protein, 5g carbs, 4g fat
- Tuna (canned, 100g): 100 cal, 23g protein, 0g carbs, 1g fat

PLANT-BASED PROTEINS:
- Tofu (150g): 120 cal, 15g protein, 3g carbs, 7g fat
- Lentils (cooked, 150g): 170 cal, 13g protein, 30g carbs, 1g fat
- Black Beans (cooked, 150g): 200 cal, 13g protein, 36g carbs, 1g fat
- Tempeh (100g): 190 cal, 19g protein, 9g carbs, 11g fat
- Edamame (150g): 190 cal, 17g protein, 14g carbs, 8g fat

QUALITY CARBS:
- Brown Rice (cooked, 150g): 170 cal, 4g protein, 36g carbs, 1g fat
- Quinoa (cooked, 150g): 180 cal, 6g protein, 32g carbs, 3g fat
- Sweet Potato (medium, 150g): 130 cal, 2g protein, 30g carbs, 0g fat
- Oatmeal (dry, 50g): 190 cal, 7g protein, 34g carbs, 3g fat
- Whole Wheat Bread (2 slices): 160 cal, 8g protein, 30g carbs, 2g fat
- Pasta (cooked, 150g): 210 cal, 8g protein, 42g carbs, 1g fat
- White Rice (post-workout, 150g): 190 cal, 4g protein, 42g carbs, 0g fat

HEALTHY FATS:
- Avocado (half): 160 cal, 2g protein, 9g carbs, 15g fat
- Olive Oil (1 tbsp): 120 cal, 0g protein, 0g carbs, 14g fat
- Almonds (30g): 170 cal, 6g protein, 6g carbs, 15g fat
- Peanut Butter (2 tbsp): 190 cal, 8g protein, 6g carbs, 16g fat
- Walnuts (30g): 185 cal, 4g protein, 4g carbs, 18g fat

VEGETABLES:
- Broccoli (150g): 50 cal, 4g protein, 10g carbs, 0g fat
- Spinach (100g): 23 cal, 3g protein, 4g carbs, 0g fat
- Mixed Salad (200g): 30 cal, 2g protein, 6g carbs, 0g fat
- Bell Peppers (150g): 45 cal, 1g protein, 10g carbs, 0g fat`;
  }
}
