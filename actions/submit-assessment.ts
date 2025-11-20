"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { AssessmentData } from "@/lib/schemas/assessment";
import { auth } from "@clerk/nextjs/server";

interface AIAnalysisResult {
  target_domain: string;
  recommended_category: string;
  search_tags: string[];
  reasoning: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function submitAssessment(data: AssessmentData) {
  try {
    const { userId } = await auth(); // Can be null if guest

    // 1. Gemini AI Analysis (with graceful fallback)
    let aiAnalysis: AIAnalysisResult = buildFallbackAnalysis(data);
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY가 존재하지 않습니다.");
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = createPrompt(data);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log("Gemini Raw Response:", text);
      aiAnalysis = parseGeminiResponse(text);
    } catch (analysisError) {
      console.error("Gemini Analysis Error:", analysisError);
      aiAnalysis = buildFallbackAnalysis(data);
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

function parseGeminiResponse(text: string): AIAnalysisResult {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    const cleanText = text.replace(/```json?/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
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

const DOMAIN_FALLBACK_META: Record<
  string,
  { label: string; category: string; tags: string[] }
> = {
  sensory: {
    label: "감각(시각/청각)",
    category: "vision_hearing_support",
    tags: ["시각장애", "청각장애", "감각보조"],
  },
  mobility: {
    label: "이동 및 보행",
    category: "wheelchair_or_mobility_aid",
    tags: ["이동보조", "휠체어", "보행보조"],
  },
  adl: {
    label: "일상생활",
    category: "adl_assistive_device",
    tags: ["일상생활", "식사보조", "목욕보조"],
  },
  communication: {
    label: "의사소통",
    category: "aac_device",
    tags: ["의사소통", "AAC", "소통보조"],
  },
  positioning: {
    label: "자세유지",
    category: "positioning_system",
    tags: ["자세유지", "자세보조", "체위변환"],
  },
  vehicle: {
    label: "차량 개조",
    category: "vehicle_modification",
    tags: ["차량개조", "운전보조", "리프트"],
  },
  computer: {
    label: "컴퓨터 접근",
    category: "computer_accessory",
    tags: ["컴퓨터보조", "특수키보드", "보조마우스"],
  },
  leisure: {
    label: "스포츠 및 여가",
    category: "adaptive_leisure_device",
    tags: ["레저보조", "스포츠보조", "여가활동"],
  },
  environment: {
    label: "환경개조",
    category: "environmental_control",
    tags: ["환경개선", "안전손잡이", "경사로"],
  },
};

function buildFallbackAnalysis(data: AssessmentData): AIAnalysisResult {
  const primaryDomain = data.selectedDomains?.[0] ?? "mobility";
  const meta =
    DOMAIN_FALLBACK_META[primaryDomain] ??
    DOMAIN_FALLBACK_META["mobility"];

  return {
    target_domain: primaryDomain,
    recommended_category: meta.category,
    search_tags: meta.tags,
    reasoning: `${meta.label} 영역 응답을 기반으로 기본 추천을 제공합니다. Gemini 분석에 실패하여 기본 규칙으로 산출된 결과입니다.`,
  };
}
`;
}

