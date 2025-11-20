"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { AssessmentData } from "@/lib/schemas/assessment";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AIAnalysisResult {
  target_domain: string;
  recommended_category: string;
  search_tags: string[];
  reasoning: string;
}

export async function submitAssessment(data: AssessmentData) {
  try {
    const { userId } = await auth(); // Can be null if guest

    // 1. Gemini AI Analysis
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });
    
    const prompt = createPrompt(data);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Gemini Raw Response:", text);

    let aiAnalysis: AIAnalysisResult;
    try {
        aiAnalysis = JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback or cleanup text
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        aiAnalysis = JSON.parse(cleanText);
    }

    // 2. Product Matching (Supabase)
    const supabase = getServiceRoleClient();

    // Strategy: Fetch products in the target domain, then score/filter
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("domain", aiAnalysis.target_domain);

    if (productError) throw new Error(`Product Fetch Error: ${productError.message}`);

    // Simple ranking in memory
    const rankedProducts = products?.map(product => {
      let score = 0;
      // Category match
      if (product.category === aiAnalysis.recommended_category) score += 10;
      // Tag overlap
      const tagOverlap = product.tags?.filter((t: string) => aiAnalysis.search_tags.includes(t)).length || 0;
      score += tagOverlap * 2;
      
      return { ...product, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5); // Top 5

    // 3. Save Logs
    // Need to get internal UUID for user if logged in
    let internalUserId = null;
    if (userId) {
        const { data: userData } = await supabase.from("users").select("id").eq("clerk_id", userId).single();
        internalUserId = userData?.id;
    }

    const { data: logData, error: logError } = await supabase
      .from("assessment_logs")
      .insert({
        user_id: internalUserId,
        input_data: data as any, // JSONB
        gemini_analysis: aiAnalysis as any, // JSONB
      })
      .select()
      .single();

    if (logError) console.error("Log Error:", logError);

    // 4. Save Recommendations
    if (logData && rankedProducts && rankedProducts.length > 0) {
       const recommendations = rankedProducts.map(p => ({
           log_id: logData.id,
           product_id: p.id,
       }));
       
       await supabase.from("recommendations").insert(recommendations);
    }

    return {
        logId: logData?.id,
        analysis: aiAnalysis,
        products: rankedProducts
    };

  } catch (error) {
    console.error("Submit Assessment Error:", error);
    throw error;
  }
}

function createPrompt(data: AssessmentData): string {
  return `
You are an expert Assistive Technology Professional (ATP). 
Analyze the user's assessment data and recommend the most suitable assistive technology category.

Context:
- Domains: sensory (vision/hearing), mobility (walking/wheelchair), adl (eating/bathing), communication, positioning, vehicle, computer, leisure, environment.
- User Data: ${JSON.stringify(data, null, 2)}

Task:
1. Identify the primary 'target_domain' where the user needs the most help based on their answers.
2. Recommend a specific 'recommended_category' (e.g., 'reading_magnifier', 'manual_wheelchair', 'universal_cuff'). Use English keys if possible, or best guess.
3. Suggest 3-5 'search_tags' (Korean) to find relevant products (e.g., '시각장애', '확대기', '휠체어', '식사보조').
4. Provide a brief 'reasoning' (Korean) for your recommendation.

Output JSON format:
{
  "target_domain": "string",
  "recommended_category": "string",
  "search_tags": ["string", ...],
  "reasoning": "string"
}
`;
}

