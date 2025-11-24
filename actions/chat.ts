"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

interface ChatResponse {
  message: string;
}

/**
 * n8n 워크플로우를 통한 AI 챗봇 응답 (향후 확장용)
 * 환경 변수 N8N_WEBHOOK_URL이 설정되어 있으면 n8n을 통해 처리
 */
async function callN8NWorkflow(userMessage: string, context: any): Promise<string | null> {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nWebhookUrl) {
    return null; // n8n이 설정되지 않았으면 null 반환
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage,
        context,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("N8N workflow error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.message || data.response || null;
  } catch (error) {
    console.error("N8N workflow call error:", error);
    return null;
  }
}

/**
 * AI 챗봇 메시지 처리
 * 최신 지원사업 정보와 제품 정보를 제공
 * 
 * 처리 순서:
 * 1. n8n 워크플로우가 설정되어 있으면 n8n을 통해 처리 (향후 확장)
 * 2. n8n이 없으면 직접 Gemini API 호출
 */
export async function sendChatMessage(userMessage: string): Promise<ChatResponse> {
  console.group("[Server Action] sendChatMessage Start");
  console.log("User message:", userMessage);

  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("로그인이 필요합니다.");
    }

    // 1. 최신 지원사업 정보 조회
    let programs = null;
    let products = null;
    
    try {
      const supabase = getServiceRoleClient();
      const { data: programsData, error: programsError } = await supabase
        .from("welfare_programs")
        .select("id, ministry, program_name, subsidy_limit, subsidy_rate, target_criteria, description")
        .order("created_at", { ascending: false })
        .limit(20);

      if (programsError) {
        console.error("Programs fetch error:", programsError);
      } else {
        programs = programsData;
      }

      // 2. 최신 제품 정보 조회
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, description, category, market_price, tags, domain")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (productsError) {
        console.error("Products fetch error:", productsError);
      } else {
        products = productsData;
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // DB 연결 실패 시에도 계속 진행 (빈 데이터로)
      programs = [];
      products = [];
    }

    // 3. Gemini API로 답변 생성
    const programsInfo = programs
      ?.map((p) => {
        const criteria = typeof p.target_criteria === "object" 
          ? JSON.stringify(p.target_criteria, null, 2)
          : p.target_criteria;
        return `- ${p.ministry} ${p.program_name}
  지원 한도: ${p.subsidy_limit ? `${(p.subsidy_limit / 10000).toLocaleString()}만원` : "상이"}
  지원율: ${p.subsidy_rate ? JSON.stringify(p.subsidy_rate) : "상이"}
  대상: ${criteria || "상세 정보는 해당 부처에 문의"}
  설명: ${p.description || "없음"}`;
      })
      .join("\n\n") || "지원사업 정보를 불러올 수 없습니다.";

    const productsInfo = products
      ?.map((p) => {
        const tags = Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "";
        return `- ${p.name}
  카테고리: ${p.category || "없음"}
  가격: ${p.market_price ? `${(p.market_price / 10000).toLocaleString()}만원` : "가격 문의"}
  태그: ${tags}
  설명: ${p.description || "없음"}`;
      })
      .join("\n\n") || "제품 정보를 불러올 수 없습니다.";

    // n8n 워크플로우 시도 (향후 확장)
    const n8nResponse = await callN8NWorkflow(userMessage, {
      programs: programs || [],
      products: products || [],
    });

    if (n8nResponse) {
      console.log("N8N Response:", n8nResponse);
      console.groupEnd();
      return {
        message: n8nResponse,
      };
    }

    // n8n이 없으면 직접 Gemini API 호출
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      throw new Error("AI 서비스 설정 오류가 발생했습니다. 관리자에게 문의해주세요.");
    }

    const prompt = `당신은 한국의 보조기기 지원사업 전문 상담사 "디딤 챗봇"입니다. 사용자의 질문에 대해 정확하고 최신 정보를 제공해야 합니다.

## 현재 등록된 지원사업 정보 (2025년 기준)

${programsInfo}

## 현재 등록된 제품 정보

${productsInfo}

## 답변 가이드

1. **정확성**: 위에 제공된 정보만을 기반으로 답변하세요. 추측하거나 불확실한 정보는 제공하지 마세요.
2. **최신성**: 2025년 기준 최신 정보임을 명시하세요.
3. **구체성**: 지원 한도, 지원율, 대상 조건 등을 구체적으로 제시하세요.
4. **친절함**: 사용자가 이해하기 쉽게 친절하고 명확하게 설명하세요.
5. **추가 안내**: 더 자세한 정보가 필요한 경우 해당 부처나 기관에 문의하도록 안내하세요.
6. **답변 형식**: 자연스러운 대화 형식으로 답변하되, 불필요한 마크다운 형식이나 특수 문자는 사용하지 마세요.

## 사용자 질문

${userMessage}

위 질문에 대해 정확하고 도움이 되는 답변을 자연스러운 한국어로 제공해주세요.`;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // 응답 검증
      if (!text || text.trim().length === 0) {
        console.error("Gemini returned empty response");
        throw new Error("AI가 응답을 생성하지 못했습니다. 다시 시도해주세요.");
      }

      // 응답 길이 제한 (너무 긴 응답 방지)
      const cleanedText = text.trim().slice(0, 5000);

      console.log("Gemini Response:", cleanedText);
      console.groupEnd();

      return {
        message: cleanedText,
      };
    } catch (geminiError) {
      console.error("Gemini API Error:", geminiError);
      
      // Gemini API 에러를 사용자 친화적인 메시지로 변환
      if (geminiError instanceof Error) {
        if (geminiError.message.includes("API_KEY")) {
          throw new Error("AI 서비스 인증 오류가 발생했습니다. 관리자에게 문의해주세요.");
        }
        if (geminiError.message.includes("quota") || geminiError.message.includes("limit")) {
          throw new Error("AI 서비스 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.");
        }
      }
      
      throw new Error("AI 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  } catch (error) {
    console.groupEnd();
    console.error("[Server Action] sendChatMessage Error:", error);

    // 이미 사용자 친화적인 에러 메시지인 경우 그대로 전달
    if (error instanceof Error && error.message.includes("문의") || error.message.includes("시도")) {
      throw error;
    }

    // 알 수 없는 에러는 일반적인 메시지로 변환
    if (error instanceof Error) {
      // 개발 환경에서는 상세 에러 표시, 프로덕션에서는 일반 메시지
      if (process.env.NODE_ENV === "development") {
        throw new Error(`에러: ${error.message}`);
      }
      throw new Error("메시지 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    throw new Error("메시지 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
}

