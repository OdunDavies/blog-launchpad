import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting OG image generation...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    // Initialize Supabase client with service role for storage access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate OG image using AI
    console.log("Calling AI gateway to generate OG image...");
    
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: `Create a professional fitness app promotional banner (1200x630 pixels, 16:9 aspect ratio) for "MuscleAtlas". 

Design requirements:
- Dark gradient background (deep charcoal black to dark gray) with subtle texture or grid pattern
- "MuscleAtlas" as the main title in large, bold, modern typography (white or light gray)
- Tagline below: "Free Exercise Library & AI Workout Generator" in smaller text
- Include 3 feature badges/icons arranged horizontally: "100+ Exercises", "AI Workout Plans", "Diet Planner"
- Athletic/fitness visual elements: abstract dumbbells, barbell silhouettes, or muscle anatomy outlines (subtle, not overpowering)
- Clean, minimalist, professional tech-forward design
- Color accent: Use subtle red/orange accents sparingly to highlight key elements
- Modern gradient overlays
- No photographs of real people
- Ultra high resolution, sharp and crisp for social media sharing`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received, extracting image...");

    // Extract the base64 image from the response
    const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.error("No image in AI response:", JSON.stringify(aiData).slice(0, 500));
      throw new Error("No image generated from AI");
    }

    // Convert base64 to binary
    const base64Match = imageData.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (!base64Match) {
      throw new Error("Invalid image data format");
    }

    const imageType = base64Match[1];
    const base64Data = base64Match[2];
    
    // Decode base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log(`Image decoded: ${bytes.length} bytes, type: ${imageType}`);

    // Upload to Supabase Storage
    const fileName = `og-image.${imageType === 'jpeg' || imageType === 'jpg' ? 'jpg' : 'png'}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('og-images')
      .upload(fileName, bytes, {
        contentType: `image/${imageType}`,
        upsert: true // Overwrite if exists
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    console.log("Image uploaded successfully:", uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('og-images')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log("Public URL:", publicUrl);

    return new Response(JSON.stringify({ 
      success: true,
      url: publicUrl,
      message: "OG image generated and uploaded successfully!"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
