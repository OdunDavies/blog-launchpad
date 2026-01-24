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
    const { goal, dailyCalories, dietType, restrictions, mealTypes, cuisine, gender } = await req.json();

    console.log("Generating diet plan with:", { goal, dailyCalories, dietType, restrictions, mealTypes, cuisine, gender });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build cuisine-specific food database
    const cuisineDatabase = cuisine === 'nigerian' || cuisine === 'west_african' 
      ? `
NIGERIAN & WEST AFRICAN FOOD DATABASE:
PROTEINS:
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

CARBOHYDRATES:
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

SOUPS & STEWS:
- Egusi Soup: 250 cal/serving, 12g protein, 8g carbs, 20g fat
- Okra Soup (ila alasepo): 80 cal/serving, 4g protein, 10g carbs, 3g fat
- Efo Riro (spinach stew): 180 cal/serving, 8g protein, 6g carbs, 14g fat
- Ogbono Soup: 200 cal/serving, 10g protein, 8g carbs, 15g fat
- Afang Soup: 150 cal/serving, 8g protein, 5g carbs, 11g fat
- Edikang Ikong: 160 cal/serving, 10g protein, 6g carbs, 11g fat
- Banga Soup: 280 cal/serving, 8g protein, 10g carbs, 24g fat
- Pepper Soup: 120 cal/serving, 15g protein, 5g carbs, 4g fat

SNACKS & SIDES:
- Chin Chin: 450 cal/100g, 6g protein, 55g carbs, 22g fat
- Puff Puff: 350 cal/100g, 5g protein, 45g carbs, 16g fat
- Roasted Groundnuts: 567 cal/100g, 26g protein, 16g carbs, 49g fat
- Garden Egg (eggplant): 25 cal/100g, 1g protein, 6g carbs, 0.1g fat
- Zobo (hibiscus drink): 40 cal/cup, 0g protein, 10g carbs, 0g fat
- Kunu (millet drink): 80 cal/cup, 2g protein, 16g carbs, 1g fat
`
      : `
INTERNATIONAL FOOD DATABASE:
PROTEINS:
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

CARBOHYDRATES:
- Brown Rice: 123 cal/100g, 2.7g protein, 26g carbs, 1g fat
- Sweet Potato: 86 cal/100g, 1.6g protein, 20g carbs, 0.1g fat
- Quinoa: 120 cal/100g, 4.4g protein, 21g carbs, 1.9g fat
- Oatmeal: 68 cal/100g, 2.4g protein, 12g carbs, 1.4g fat
- Whole Wheat Pasta: 124 cal/100g, 5g protein, 25g carbs, 0.5g fat
- White Rice: 130 cal/100g, 2.7g protein, 28g carbs, 0.3g fat
- Bread (whole grain): 247 cal/100g, 13g protein, 41g carbs, 4g fat
- Potatoes: 77 cal/100g, 2g protein, 17g carbs, 0.1g fat

VEGETABLES & GREENS:
- Broccoli: 34 cal/100g, 2.8g protein, 7g carbs, 0.4g fat
- Spinach: 23 cal/100g, 2.9g protein, 3.6g carbs, 0.4g fat
- Mixed Salad: 20 cal/100g, 1.5g protein, 3g carbs, 0.2g fat
- Bell Peppers: 31 cal/100g, 1g protein, 6g carbs, 0.3g fat
- Asparagus: 20 cal/100g, 2.2g protein, 4g carbs, 0.1g fat

HEALTHY FATS:
- Avocado: 160 cal/100g, 2g protein, 9g carbs, 15g fat
- Olive Oil: 884 cal/100ml, 0g protein, 0g carbs, 100g fat
- Almonds: 579 cal/100g, 21g protein, 22g carbs, 50g fat
- Walnuts: 654 cal/100g, 15g protein, 14g carbs, 65g fat
`;

    // Macro distribution based on goal
    const macroDistribution = {
      muscle_building: { protein: 30, carbs: 40, fats: 30 },
      fat_loss: { protein: 35, carbs: 30, fats: 35 },
      maintenance: { protein: 25, carbs: 45, fats: 30 },
      endurance: { protein: 20, carbs: 55, fats: 25 },
    };

    const macros = macroDistribution[goal as keyof typeof macroDistribution] || macroDistribution.maintenance;

    const systemPrompt = `You are an expert nutritionist creating personalized meal plans. You MUST use the food database provided and respect all dietary restrictions.

${cuisineDatabase}

MACRO TARGETS FOR THIS PLAN:
- Daily Calories: ${dailyCalories} kcal
- Protein: ${macros.protein}% (${Math.round((dailyCalories * macros.protein / 100) / 4)}g)
- Carbohydrates: ${macros.carbs}% (${Math.round((dailyCalories * macros.carbs / 100) / 4)}g)
- Fats: ${macros.fats}% (${Math.round((dailyCalories * macros.fats / 100) / 9)}g)

MEAL DISTRIBUTION RULES:
- Breakfast: 15-20% of daily calories (energizing, lighter meals)
- Morning/Afternoon Snacks: 150-300 calories each (portable, quick)
- Lunch: 25-30% of daily calories (substantial, balanced)
- Dinner: 25-30% of daily calories (substantial, satisfying)
- Pre-Workout: 200-400 calories (easily digestible carbs + moderate protein)
- Post-Workout: 300-500 calories (high protein + fast carbs for recovery)

DIETARY RESTRICTIONS TO AVOID: ${restrictions.length > 0 ? restrictions.join(', ') : 'None'}

DIET TYPE: ${dietType}
${dietType === 'keto' ? '- Keep carbs under 20-50g per day total' : ''}
${dietType === 'high_protein' ? '- Prioritize protein-rich foods in every meal' : ''}
${dietType === 'vegetarian' ? '- No meat or fish, eggs and dairy allowed' : ''}
${dietType === 'vegan' ? '- No animal products at all' : ''}
${dietType === 'low_carb' ? '- Keep carbs moderate, focus on vegetables for carbs' : ''}

MEAL TYPES TO INCLUDE: ${mealTypes.join(', ')}

Create a 7-day meal plan using ONLY foods from the ${cuisine} database. Each meal must have realistic portion sizes and accurate nutritional information.`;

    const userPrompt = `Create a personalized 7-day ${cuisine} meal plan for a ${gender || 'person'} with a ${goal.replace('_', ' ')} goal.

Daily target: ${dailyCalories} calories
Diet approach: ${dietType}
Include these meals each day: ${mealTypes.join(', ')}
${restrictions.length > 0 ? `Avoid: ${restrictions.join(', ')}` : ''}

Generate varied, delicious meals that hit the macro targets while being practical to prepare.`;

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
                  schedule: {
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
                        totalFats: {
                          type: "number",
                          description: "Total fats in grams",
                        },
                        meals: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              mealType: {
                                type: "string",
                                description: "Type of meal",
                              },
                              name: {
                                type: "string",
                                description: "Descriptive name of the meal",
                              },
                              foods: {
                                type: "array",
                                items: { type: "string" },
                                description: "List of foods with portions",
                              },
                              calories: { type: "number" },
                              protein: { type: "number" },
                              carbs: { type: "number" },
                              fats: { type: "number" },
                            },
                            required: ["mealType", "name", "foods", "calories", "protein", "carbs", "fats"],
                          },
                        },
                      },
                      required: ["day", "totalCalories", "totalProtein", "totalCarbs", "totalFats", "meals"],
                    },
                  },
                },
                required: ["schedule"],
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
    console.log("Diet plan generated successfully");

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
