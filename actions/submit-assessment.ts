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
  console.group("[Server Action] submitAssessment Start");
  console.log("Input data:", JSON.stringify(data, null, 2));
  
  try {
    const { userId } = await auth(); // Can be null if guest
    console.log("User ID:", userId);

    // 1. Gemini AI Analysis (with graceful fallback)
    let aiAnalysis: AIAnalysisResult = buildFallbackAnalysis(data);
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not found, using fallback analysis");
        aiAnalysis = buildFallbackAnalysis(data);
      } else {
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
        console.log("Parsed Analysis:", aiAnalysis);
      }
    } catch (analysisError) {
      console.error("Gemini Analysis Error:", analysisError);
      console.log("Using fallback analysis");
      aiAnalysis = buildFallbackAnalysis(data);
    }

    // 2. Product Matching (Supabase)
    let supabase;
    try {
      // 환경 변수 확인
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.");
      }
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.");
      }
      
      supabase = getServiceRoleClient();
      console.log("Supabase client initialized successfully");
    } catch (supabaseError) {
      console.error("Supabase Client Error:", supabaseError);
      throw new Error(
        supabaseError instanceof Error 
          ? `데이터베이스 연결 실패: ${supabaseError.message}` 
          : "데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    }

    // Strategy: Fetch products in the target domain, then score/filter
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("domain", aiAnalysis.target_domain);

    if (productError) {
      console.error("Product Fetch Error:", productError);
      // Products fetch 실패해도 계속 진행 (빈 배열로)
    }

    // Simple ranking in memory
    const rankedProducts = (products || []).map(product => {
      let score = 0;
      // Category match
      if (product.category === aiAnalysis.recommended_category) score += 10;
      // Tag overlap
      const tagOverlap = product.tags?.filter((t: string) => aiAnalysis.search_tags.includes(t)).length || 0;
      score += tagOverlap * 2;
      
      return { ...product, score };
    }).sort((a, b) => b.score - a.score).slice(0, 5); // Top 5

    console.log("Ranked Products:", rankedProducts.length);

    // 3. Save Logs
    // Need to get internal UUID for user if logged in
    let internalUserId = null;
    if (userId) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_user_id", userId)
          .single();
        
        if (userError) {
          console.warn("User lookup error (non-critical):", userError);
        } else {
          internalUserId = userData?.id;
        }
      } catch (userLookupError) {
        console.warn("User lookup failed (non-critical):", userLookupError);
      }
    }

    console.log("Attempting to insert assessment log...");
    console.log("User ID:", internalUserId);
    console.log("Input data size:", JSON.stringify(data).length);
    console.log("Analysis data size:", JSON.stringify(aiAnalysis).length);

    const insertPayload = {
      user_id: internalUserId,
      input_data: data as any, // JSONB
      gemini_analysis: aiAnalysis as any, // JSONB
    };

    console.log("Insert payload keys:", Object.keys(insertPayload));

    const { data: logData, error: logError } = await supabase
      .from("assessment_logs")
      .insert(insertPayload)
      .select()
      .single();

    if (logError) {
      console.error("Log Insert Error Details:");
      console.error("Error Code:", logError.code);
      console.error("Error Message:", logError.message);
      console.error("Error Details:", logError.details);
      console.error("Error Hint:", logError.hint);
      console.error("Full Error:", JSON.stringify(logError, null, 2));
      throw new Error(
        `데이터 저장 실패: ${logError.message || logError.code || "알 수 없는 오류"}`
      );
    }

    if (!logData) {
      console.error("Log Insert returned no data");
      throw new Error("분석 결과를 저장하는 중 오류가 발생했습니다. 데이터가 반환되지 않았습니다.");
    }

    console.log("Log saved with ID:", logData.id);

    // 4. Save Recommendations (non-critical, continue even if fails)
    if (rankedProducts && rankedProducts.length > 0) {
      try {
        const recommendations = rankedProducts.map(p => ({
          log_id: logData.id,
          product_id: p.id,
        }));
        
        const { error: recError } = await supabase
          .from("recommendations")
          .insert(recommendations);
        
        if (recError) {
          console.warn("Recommendations insert error (non-critical):", recError);
        } else {
          console.log("Recommendations saved:", recommendations.length);
        }
      } catch (recError) {
        console.warn("Recommendations save failed (non-critical):", recError);
      }
    }

    const result = {
      logId: logData.id,
      analysis: aiAnalysis,
      products: rankedProducts || []
    };

    console.log("Submit Assessment Success:", result);
    console.groupEnd();
    
    return result;

  } catch (error) {
    console.groupEnd();
    console.error("[Server Action] Submit Assessment Error:", error);
    
    // 사용자 친화적인 에러 메시지로 변환
    if (error instanceof Error) {
      // 이미 명시적인 메시지가 있으면 그대로 사용
      if (error.message.includes("데이터베이스") || 
          error.message.includes("저장") ||
          error.message.includes("연결")) {
        throw error;
      }
      // 그 외에는 일반적인 메시지
      throw new Error(`분석 처리 중 오류가 발생했습니다: ${error.message}`);
    }
    
    throw new Error("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
`;
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
