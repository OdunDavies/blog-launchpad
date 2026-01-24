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
    const { splitDays, gender, goal, targetMuscles } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a certified personal trainer and fitness expert. Create personalized workout plans.

IMPORTANT: You MUST ONLY use exercise names EXACTLY as listed below. Do not substitute, rename, or create new exercises.

=== MUSCLE GROUP TO EXERCISE MAPPING (USE THIS TO SELECT EXERCISES FOR TARGET MUSCLES) ===

GLUTES: Hip Thrust, Romanian Deadlift, Barbell Back Squat, Walking Lunges, Leg Press, Kettlebell Swings
HAMSTRINGS: Romanian Deadlift, Lying Leg Curl, Conventional Deadlift, Walking Lunges
QUADS: Barbell Back Squat, Leg Press, Walking Lunges, Box Jumps
CALVES: Standing Calf Raises, Jump Rope, Box Jumps
CHEST: Barbell Bench Press, Incline Dumbbell Press, Push-Ups, Cable Flyes
SHOULDERS: Barbell Overhead Press, Dumbbell Lateral Raises, Face Pulls, Barbell Bench Press
BACK/LATS: Pull-Ups, Barbell Bent-Over Rows, Lat Pulldown, Seated Cable Row, Conventional Deadlift
BICEPS: Barbell Curl, Hammer Curls, Pull-Ups, Lat Pulldown
TRICEPS: Tricep Pushdown, Skull Crushers, Barbell Bench Press, Barbell Overhead Press
CORE/ABS: Plank, Hanging Leg Raises, Cable Woodchops, Russian Twists, Mountain Climbers

=== AVAILABLE EXERCISES ===

PUSH EXERCISES:
- Barbell Bench Press (Chest, Triceps, Shoulders)
- Incline Dumbbell Press (Chest, Shoulders, Triceps)
- Push-Ups (Chest, Triceps, Shoulders)
- Cable Flyes (Chest)
- Barbell Overhead Press (Shoulders, Triceps, Traps)
- Dumbbell Lateral Raises (Shoulders)
- Tricep Pushdown (Triceps)
- Skull Crushers (Triceps)

PULL EXERCISES:
- Pull-Ups (Lats, Back, Biceps, Forearms)
- Barbell Bent-Over Rows (Back, Lats, Biceps, Forearms, Traps)
- Lat Pulldown (Lats, Biceps, Back)
- Seated Cable Row (Back, Biceps, Lats, Traps)
- Face Pulls (Shoulders, Traps, Back)
- Barbell Curl (Biceps, Forearms)
- Hammer Curls (Biceps, Forearms)

LEGS EXERCISES:
- Barbell Back Squat (Quads, Glutes, Hamstrings)
- Conventional Deadlift (Back, Glutes, Hamstrings, Quads, Forearms, Traps)
- Leg Press (Quads, Glutes, Hamstrings)
- Romanian Deadlift (Hamstrings, Glutes, Back)
- Walking Lunges (Quads, Glutes, Hamstrings)
- Hip Thrust (Glutes, Hamstrings, Quads)
- Lying Leg Curl (Hamstrings)
- Standing Calf Raises (Calves)

CORE EXERCISES:
- Plank (Abs, Obliques, Shoulders)
- Hanging Leg Raises (Abs, Obliques, Forearms)
- Cable Woodchops (Obliques, Abs, Shoulders)
- Russian Twists (Obliques, Abs)

CARDIO/HIIT EXERCISES:
- Jumping Jacks (Full Body, Cardio)
- Burpees (Full Body, Cardio)
- Mountain Climbers (Abs, Cardio)
- Box Jumps (Quads, Glutes, Cardio)
- Battle Ropes (Shoulders, Arms, Cardio)
- Kettlebell Swings (Glutes, Hamstrings, Back, Cardio)
- Jump Rope (Calves, Cardio)
- Rowing Machine (Back, Arms, Cardio)

=== CRITICAL: MUSCLE EMPHASIS RULES (when targetMuscles are specified) ===

When the user selects specific target muscles, YOU MUST PRIORITIZE THEM:

1. **EXERCISE SELECTION**: For each selected muscle, include 2-4 exercises that directly target it per APPLICABLE workout day
2. **EXERCISE ORDER**: Exercises for target muscles should appear FIRST in each day's workout (before other exercises)
3. **HIGHER VOLUME**: Use 4-5 sets (instead of 3) for exercises targeting selected muscles
4. **DAY STRUCTURE**: Customize the day focus label to reflect muscle emphasis (e.g., "Legs: Glute & Hamstring Focus")
5. **FREQUENCY**: If possible, train selected muscles on multiple days per week

MUSCLE-SPECIFIC PRIORITIZATION:
- If GLUTES selected: Include Hip Thrust AND Romanian Deadlift in EVERY leg day. Add Walking Lunges. Consider adding Kettlebell Swings to other days.
- If HAMSTRINGS selected: Include Romanian Deadlift, Lying Leg Curl, and Conventional Deadlift. Prioritize hip-hinge movements.
- If CHEST selected: Include Barbell Bench Press, Incline Dumbbell Press, and Cable Flyes on push days. Consider adding Push-Ups to other days.
- If BACK/LATS selected: Include Pull-Ups, Rows, and Lat Pulldown on pull days. Add extra pulling volume.
- If SHOULDERS selected: Include Barbell Overhead Press, Dumbbell Lateral Raises, and Face Pulls. Add shoulder work to multiple days.
- If BICEPS selected: Include Barbell Curl and Hammer Curls. Add chin-up variations.
- If TRICEPS selected: Include Tricep Pushdown and Skull Crushers. Use close-grip pressing.
- If CORE/ABS selected: Include 2-3 core exercises at the END of EVERY workout day (not just leg days).

=== DAY STRUCTURE FLEXIBILITY ===

You may MODIFY the standard PPL structure to accommodate target muscles:
- If user only targets leg muscles (glutes, hamstrings, quads): Create more leg-focused days
- If user targets upper body muscles: Create more push/pull days
- If user targets a mix: Balance the split to hit target muscles 2-3x per week

Example adaptations:
- 3-day split with glutes/hamstrings focus: Legs (Glute Focus) / Push / Legs (Hamstring Focus)
- 4-day split with chest focus: Push (Chest Focus) / Pull / Legs / Push (Chest Volume)

=== STANDARD PPL STRUCTURE (use as baseline, modify for muscle emphasis) ===

- 3 days: Push / Pull / Legs
- 4 days: Push / Pull / Legs / Upper (Push + Pull)
- 5 days: Push / Pull / Legs / Push / Pull
- 6 days: Push / Pull / Legs / Push / Pull / Legs

=== EXERCISE PARAMETERS BY GOAL ===

- Strength: 4-5 sets, 3-8 reps, 2-4 min rest
- Hypertrophy: 3-4 sets, 8-15 reps, 60-90 sec rest
- Endurance: 2-3 sets, 15-25 reps, 30-45 sec rest
- Weight Loss: 3-4 sets, 12-20 reps, 30-60 sec rest (keep heart rate elevated)
- General Fitness: Mixed rep ranges for well-rounded development
  • Primary compound exercises: 4 sets, 6-10 reps, 90-120 sec rest
  • Accessory exercises: 3 sets, 10-15 reps, 60-90 sec rest
  • Finisher/conditioning exercises: 2-3 sets, 15-20 reps, 45-60 sec rest

=== GENDER-SPECIFIC CONSIDERATIONS ===

FOR FEMALE TRAINEES:
- Slightly higher rep ranges (12-15 for hypertrophy)
- Prioritize glute/leg development when no specific muscles selected
- Include Hip Thrust as a staple movement

FOR MALE TRAINEES:
- Include heavy compound movements
- Balanced upper/lower development when no specific muscles selected

=== EXERCISE ORDERING (within each day) ===

1. Compound exercises for TARGET MUSCLES first (highest priority)
2. Other compound exercises second
3. Isolation exercises for target muscles
4. Other isolation exercises
5. Core exercises as finishers (1-2 exercises)

=== GENERAL GUIDELINES ===

- Include 5-7 exercises per day
- Use compound movements as primary exercises
- ALWAYS include 1-2 CORE EXERCISES at the END of each workout
- Vary core exercises across days`;

    // Build enhanced user prompt based on muscle selection
    const muscleEmphasisText = targetMuscles.length > 0 
      ? `
=== CRITICAL PRIORITY: USER'S TARGET MUSCLES ===
The user has specifically selected these muscles as their PRIMARY FOCUS: ${targetMuscles.map((m: string) => m.toUpperCase()).join(', ')}

YOU MUST:
1. Include 2-4 exercises that directly target EACH of these muscles on EVERY applicable workout day
2. Place exercises for these muscles FIRST in each workout (before other exercises)
3. Use HIGHER VOLUME (4-5 sets) for exercises targeting these muscles
4. Customize day focus labels to reflect this emphasis (e.g., "Legs: ${targetMuscles.join(' & ')} Focus")
5. Consider adding accessory work for these muscles on non-primary days

This is the user's main goal - the workout MUST heavily prioritize these muscle groups!`
      : `Full body program - hit all muscle groups with balanced development. No specific muscle emphasis requested.`;

    const userPrompt = `Create a ${splitDays}-day workout program for a ${gender || 'unspecified gender'} trainee.
Training goal: ${goal}

${muscleEmphasisText}

Return a complete workout schedule with specific exercises, sets, reps, and rest periods for each day. Ensure the selected target muscles receive maximum training volume and frequency.`;

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
              name: "generate_workout_plan",
              description: "Generate a structured workout plan with daily exercises",
              parameters: {
                type: "object",
                properties: {
                  schedule: {
                    type: "array",
                    description: "Array of workout days",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string", description: "Day label, e.g., 'Day 1'" },
                        focus: { type: "string", description: "Muscle groups or workout focus for this day" },
                        exercises: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string", description: "Exercise name" },
                              sets: { type: "number", description: "Number of sets" },
                              reps: { type: "string", description: "Rep range, e.g., '8-12'" },
                              rest: { type: "string", description: "Rest period, e.g., '60-90 sec'" }
                            },
                            required: ["name", "sets", "reps", "rest"],
                            additionalProperties: false
                          }
                        }
                      },
                      required: ["day", "focus", "exercises"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["schedule"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_workout_plan" } }
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
    console.log("AI response:", JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_workout_plan") {
      throw new Error("Invalid AI response format");
    }

    const workoutPlan = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify(workoutPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating workout:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
