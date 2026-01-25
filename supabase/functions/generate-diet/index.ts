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

    // Unified food database combining International AND Nigerian/West African foods
    const unifiedFoodDatabase = `
UNIFIED GLOBAL FITNESS FOOD DATABASE:

=== PROTEINS (INTERNATIONAL) ===
- Grilled Chicken Breast: 165 cal/100g, 31g protein, 0g carbs, 3.6g fat
- Salmon Fillet: 208 cal/100g, 20g protein, 0g carbs, 13g fat
- Lean Ground Beef: 176 cal/100g, 20g protein, 0g carbs, 10g fat
- Greek Yogurt: 97 cal/100g, 9g protein, 3.6g carbs, 5g fat
- Eggs (2 large): 143 cal, 13g protein, 1g carbs, 10g fat
- Cottage Cheese: 98 cal/100g, 11g protein, 3.4g carbs, 4.3g fat
- Turkey Breast: 135 cal/100g, 30g protein, 0g carbs, 1g fat
- Tuna: 132 cal/100g, 28g protein, 0g carbs, 1g fat
- Tofu: 76 cal/100g, 8g protein, 2g carbs, 4.5g fat
- Tempeh: 192 cal/100g, 20g protein, 8g carbs, 11g fat
- Shrimp: 99 cal/100g, 24g protein, 0g carbs, 0.3g fat
- Cod: 82 cal/100g, 18g protein, 0g carbs, 0.7g fat

=== PROTEINS (NIGERIAN/WEST AFRICAN) ===
- Suya (spiced grilled beef): 250 cal/100g, 25g protein, 5g carbs, 15g fat
- Kilishi (dried spiced beef): 300 cal/100g, 35g protein, 8g carbs, 14g fat
- Stockfish (dried cod): 290 cal/100g, 62g protein, 0g carbs, 2.5g fat
- Goat Meat (stewed): 143 cal/100g, 27g protein, 0g carbs, 3g fat
- Grilled Tilapia: 128 cal/100g, 26g protein, 0g carbs, 2.5g fat
- Dried Fish (eja kika): 320 cal/100g, 60g protein, 0g carbs, 8g fat
- Chicken Pepper Soup: 180 cal/serving, 22g protein, 8g carbs, 6g fat
- Nkwobi (spiced cow foot): 200 cal/serving, 18g protein, 5g carbs, 12g fat
- Asun (spiced goat meat): 220 cal/100g, 24g protein, 3g carbs, 12g fat
- Ponmo (cow skin): 110 cal/100g, 25g protein, 0g carbs, 0.5g fat

=== CARBOHYDRATES (INTERNATIONAL) ===
- Brown Rice: 123 cal/100g, 2.7g protein, 26g carbs, 1g fat
- Sweet Potato: 86 cal/100g, 1.6g protein, 20g carbs, 0.1g fat
- Quinoa: 120 cal/100g, 4.4g protein, 21g carbs, 1.9g fat
- Oatmeal: 68 cal/100g, 2.4g protein, 12g carbs, 1.4g fat
- Whole Wheat Pasta: 124 cal/100g, 5g protein, 25g carbs, 0.5g fat
- White Rice: 130 cal/100g, 2.7g protein, 28g carbs, 0.3g fat
- Bread (whole grain): 247 cal/100g, 13g protein, 41g carbs, 4g fat
- Potatoes: 77 cal/100g, 2g protein, 17g carbs, 0.1g fat

=== CARBOHYDRATES (NIGERIAN/WEST AFRICAN) ===
- Ofada Rice: 130 cal/100g, 2.5g protein, 28g carbs, 0.5g fat
- Jollof Rice: 180 cal/100g, 4g protein, 32g carbs, 4g fat
- Pounded Yam: 118 cal/100g, 1.5g protein, 28g carbs, 0.1g fat
- Eba (garri): 160 cal/100g, 0.5g protein, 38g carbs, 0.5g fat
- Amala (yam flour): 120 cal/100g, 2g protein, 28g carbs, 0.3g fat
- Plantain (fried dodo): 150 cal/100g, 1g protein, 35g carbs, 2g fat
- Moi Moi: 180 cal/serving, 9g protein, 18g carbs, 8g fat
- Akara (bean cakes): 170 cal/3 pieces, 6g protein, 15g carbs, 10g fat
- Tuwo Shinkafa: 115 cal/100g, 2g protein, 25g carbs, 0.3g fat
- Fufu: 120 cal/100g, 1g protein, 28g carbs, 0.5g fat

=== SOUPS & STEWS (NIGERIAN/WEST AFRICAN) ===
- Egusi Soup: 250 cal/serving, 12g protein, 8g carbs, 20g fat
- Okra Soup (ila alasepo): 80 cal/serving, 4g protein, 10g carbs, 3g fat
- Efo Riro (spinach stew): 180 cal/serving, 8g protein, 6g carbs, 14g fat
- Ogbono Soup: 200 cal/serving, 10g protein, 8g carbs, 15g fat
- Afang Soup: 150 cal/serving, 8g protein, 5g carbs, 11g fat
- Edikang Ikong: 160 cal/serving, 10g protein, 6g carbs, 11g fat
- Banga Soup: 280 cal/serving, 8g protein, 10g carbs, 24g fat
- Pepper Soup: 120 cal/serving, 15g protein, 5g carbs, 4g fat
- Groundnut Soup: 220 cal/serving, 10g protein, 12g carbs, 16g fat

=== VEGETABLES & GREENS ===
- Broccoli: 34 cal/100g, 2.8g protein, 7g carbs, 0.4g fat
- Spinach: 23 cal/100g, 2.9g protein, 3.6g carbs, 0.4g fat
- Mixed Salad: 20 cal/100g, 1.5g protein, 3g carbs, 0.2g fat
- Bell Peppers: 31 cal/100g, 1g protein, 6g carbs, 0.3g fat
- Asparagus: 20 cal/100g, 2.2g protein, 4g carbs, 0.1g fat
- Garden Egg (eggplant): 25 cal/100g, 1g protein, 6g carbs, 0.1g fat
- Ugu (fluted pumpkin leaves): 30 cal/100g, 3g protein, 4g carbs, 0.5g fat
- Water Leaf: 25 cal/100g, 2g protein, 4g carbs, 0.3g fat

=== HEALTHY FATS ===
- Avocado: 160 cal/100g, 2g protein, 9g carbs, 15g fat
- Olive Oil: 884 cal/100ml, 0g protein, 0g carbs, 100g fat
- Almonds: 579 cal/100g, 21g protein, 22g carbs, 50g fat
- Walnuts: 654 cal/100g, 15g protein, 14g carbs, 65g fat
- Roasted Groundnuts: 567 cal/100g, 26g protein, 16g carbs, 49g fat
- Palm Oil (red): 884 cal/100ml, 0g protein, 0g carbs, 100g fat (use sparingly)

=== SNACKS & BEVERAGES ===
- Zobo (hibiscus drink, unsweetened): 20 cal/cup, 0g protein, 5g carbs, 0g fat
- Kunu (millet drink): 80 cal/cup, 2g protein, 16g carbs, 1g fat
- Tiger Nuts: 400 cal/100g, 5g protein, 45g carbs, 24g fat
- Chin Chin (limit - treat): 450 cal/100g, 6g protein, 55g carbs, 22g fat
- Protein Shake: 120 cal/scoop, 24g protein, 3g carbs, 1g fat
- Green Smoothie: 100 cal/cup, 2g protein, 22g carbs, 0.5g fat
`;

    // Map cuisine to mixing instructions
    const cuisineInstructions = {
      'nigerian': `
CUISINE PRIORITY: NIGERIAN FOCUS
- Use primarily Nigerian foods (~80% of meals)
- Feature Nigerian proteins: Suya, Kilishi, Stockfish, Goat Meat, Grilled Fish
- Use Nigerian carbs: Ofada Rice, Jollof Rice, Pounded Yam, Eba, Amala, Plantain
- Include Nigerian soups: Egusi, Okra, Efo Riro, Ogbono, Pepper Soup
- Snacks: Akara, Moi Moi, Zobo, Kunu
`,
      'west-african': `
CUISINE PRIORITY: WEST AFRICAN FOCUS
- Use primarily West African foods (~75% of meals)
- Feature proteins: Suya, Grilled Fish, Goat Meat, Chicken Pepper Soup
- Include variety of swallows and soups
- Mix Nigerian with other West African variations
- Include traditional snacks and beverages
`,
      'international': `
CUISINE PRIORITY: INTERNATIONAL MIX
- Create a diverse 50/50 mix of International and African cuisines
- Alternate cuisine styles across meals and days for maximum variety
- Mix proteins creatively: Salmon one day, Suya the next
- Pair International carbs (Quinoa, Brown Rice) with African proteins and vice versa
- Include both Western salads and African soups for vegetables
- Ensure each day has at least one meal from each cuisine tradition
`
    };

    const mixingInstructions = cuisineInstructions[cuisine as keyof typeof cuisineInstructions] || cuisineInstructions.international;

    // Map goal to macro distribution
    const macroDistribution = {
      'muscle-gain': { protein: 30, carbs: 45, fats: 25 },
      'fat-loss': { protein: 35, carbs: 30, fats: 35 },
      'maintenance': { protein: 25, carbs: 45, fats: 30 },
      'recomposition': { protein: 35, carbs: 35, fats: 30 },
    };

    const macros = macroDistribution[goal as keyof typeof macroDistribution] || macroDistribution.maintenance;

    // Generate meal times based on mealsPerDay
    const mealSchedules: Record<number, string[]> = {
      3: ['Breakfast (7:00 AM)', 'Lunch (12:30 PM)', 'Dinner (7:00 PM)'],
      4: ['Breakfast (7:00 AM)', 'Lunch (12:30 PM)', 'Snack (4:00 PM)', 'Dinner (7:30 PM)'],
      5: ['Breakfast (7:00 AM)', 'Mid-Morning Snack (10:00 AM)', 'Lunch (1:00 PM)', 'Afternoon Snack (4:00 PM)', 'Dinner (7:30 PM)'],
      6: ['Breakfast (6:30 AM)', 'Mid-Morning Snack (9:30 AM)', 'Lunch (12:30 PM)', 'Afternoon Snack (3:30 PM)', 'Dinner (6:30 PM)', 'Evening Snack (9:00 PM)'],
    };

    const mealTimes = mealSchedules[mealsPerDay] || mealSchedules[3];

    const systemPrompt = `You are an expert nutritionist creating personalized meal plans. You have access to a UNIFIED food database containing both International AND Nigerian/West African foods. Create varied, culturally diverse meal plans.

${unifiedFoodDatabase}

${mixingInstructions}

MACRO TARGETS FOR THIS PLAN:
- Daily Calories: ${calorieTarget} kcal
- Protein: ${macros.protein}% (${Math.round((calorieTarget * macros.protein / 100) / 4)}g)
- Carbohydrates: ${macros.carbs}% (${Math.round((calorieTarget * macros.carbs / 100) / 4)}g)
- Fats: ${macros.fats}% (${Math.round((calorieTarget * macros.fats / 100) / 9)}g)

MEALS PER DAY: ${mealsPerDay}
MEAL TIMES: ${mealTimes.join(', ')}

MEAL DISTRIBUTION RULES:
- Distribute calories evenly across ${mealsPerDay} meals
- Main meals (Breakfast, Lunch, Dinner) should be larger
- Snacks should be 150-300 calories each

DIETARY RESTRICTIONS TO AVOID: ${restrictions.length > 0 ? restrictions.join(', ') : 'None'}

DIET TYPE: ${dietType}
${dietType === 'low-carb' ? '- Keep carbs moderate (under 100g/day). Focus on proteins and healthy fats.' : ''}
${dietType === 'high-protein' ? '- Prioritize protein-rich foods in every meal: meat, fish, eggs, dairy, legumes' : ''}
${dietType === 'vegetarian' ? '- No meat or fish. Use: Eggs, Tofu, Greek Yogurt, Beans, Moi Moi, Akara, Cheese' : ''}
${dietType === 'vegan' ? '- No animal products. Use: Tofu, Tempeh, Beans, Moi Moi, Akara, Plantain, Vegetables' : ''}
${dietType === 'mediterranean' ? '- Focus on olive oil, fish, whole grains, vegetables, legumes, nuts' : ''}
${dietType === 'balanced' ? '- Balanced mix of proteins, carbs, and fats from whole food sources' : ''}

VARIETY REQUIREMENTS:
- Each day must have different main dishes
- Don't repeat the same meal on consecutive days
- Mix cooking styles: grilled, stewed, boiled, baked
- Include a variety of proteins, carbs, and vegetables across the week

Create a 7-day meal plan. Each food item must include its portion size and individual macros.`;

    const userPrompt = `Create a personalized 7-day meal plan for a ${profile?.gender || 'person'} with a ${goal.replace('-', ' ')} goal.

Cuisine preference: ${cuisine === 'nigerian' ? 'Nigerian foods' : cuisine === 'west-african' ? 'West African foods' : 'International mix'}
Daily target: ${calorieTarget} calories
Diet approach: ${dietType}
Meals per day: ${mealsPerDay}
${restrictions.length > 0 ? `Avoid: ${restrictions.join(', ')}` : ''}

Generate varied, delicious meals that hit the macro targets. Each meal should list individual food items with their portions and nutrition info.`;

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
