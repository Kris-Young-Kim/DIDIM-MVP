"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

interface GenerateApplicationParams {
  programId: number; // welfare_programs.id
  assessmentLogId?: string; // assessment_logs.id (선택적, 제품 추천 정보 포함)
}

interface GeneratedContent {
  necessity: string; // 기기 필요성
  utilization_plan: string; // 활용 계획
  expected_effect: string; // 기대 효과
  full_text: string; // 전체 텍스트 (PDF에 사용)
}

/**
 * 복지 사업 신청서를 위한 "기기 필요성 및 활용 계획서"를 AI로 자동 작성
 * 
 * @param params - programId (필수), assessmentLogId (선택)
 * @returns 생성된 application의 ID
 */
export async function generateApplication(params: GenerateApplicationParams) {
  console.group("[Server Action] generateApplication Start");
  console.log("Params:", JSON.stringify(params, null, 2));

  try {
    // 1. 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("로그인이 필요합니다.");
    }

    const supabase = getServiceRoleClient();

    // 2. 사용자 정보 조회 (users 테이블)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, nickname, birth_year, occupation, disability_info, is_veteran, ltc_grade")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (userError || !user) {
      console.error("User fetch error:", userError);
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    console.log("User data:", user);

    // 3. 복지 사업 정보 조회
    const { data: program, error: programError } = await supabase
      .from("welfare_programs")
      .select("id, ministry, program_name, subsidy_limit")
      .eq("id", params.programId)
      .single();

    if (programError || !program) {
      console.error("Program fetch error:", programError);
      throw new Error("복지 사업 정보를 찾을 수 없습니다.");
    }

    console.log("Program data:", program);

    // 4. 추천 제품 정보 조회 (선택적)
    let productInfo = null;
    if (params.assessmentLogId) {
      const { data: assessmentLog } = await supabase
        .from("assessment_logs")
        .select("gemini_analysis, recommended_products")
        .eq("id", params.assessmentLogId)
        .single();

      if (assessmentLog) {
        productInfo = {
          analysis: assessmentLog.gemini_analysis,
          products: assessmentLog.recommended_products,
        };
      }
    }

    // 5. Gemini로 행정 용어 작문
    const generatedContent = await generateApplicationContent({
      user,
      program,
      productInfo,
    });

    console.log("Generated content:", generatedContent);

    // 6. applications 테이블에 저장
    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        program_id: program.id,
        generated_content: generatedContent,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Application insert error:", insertError);
      throw new Error(`신청서 저장 실패: ${insertError.message}`);
    }

    console.log("Application created:", application.id);
    console.groupEnd();

    return {
      applicationId: application.id,
      generatedContent,
    };
  } catch (error) {
    console.groupEnd();
    console.error("[Server Action] generateApplication Error:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("신청서 생성 중 오류가 발생했습니다.");
  }
}

/**
 * Gemini AI를 사용하여 행정 용어로 신청서 내용 생성
 */
async function generateApplicationContent(params: {
  user: {
    nickname: string | null;
    birth_year: number | null;
    occupation: string | null;
    disability_info: any;
    is_veteran: boolean | null;
    ltc_grade: number | null;
  };
  program: {
    ministry: string;
    program_name: string;
    subsidy_limit: number | null;
  };
  productInfo: {
    analysis: any;
    products: any;
  } | null;
}): Promise<GeneratedContent> {
  const { user, program, productInfo } = params;

  const currentYear = new Date().getFullYear();
  const age = user.birth_year ? currentYear - user.birth_year : null;

  // 사용자 정보 요약
  const userSummary = {
    이름: user.nickname || "신청자",
    나이: age ? `${age}세` : "미상",
    직업: user.occupation === "worker" ? "근로자" 
      : user.occupation === "student" ? "학생"
      : user.occupation === "job_seeker" ? "구직자"
      : "기타",
    장애유형: user.disability_info?.type || "미상",
    국가유공자: user.is_veteran ? "예" : "아니오",
    장기요양등급: user.ltc_grade ? `${user.ltc_grade}등급` : "해당없음",
  };

  // 추천 제품 정보 요약
  let productSummary = "없음";
  if (productInfo?.products && Array.isArray(productInfo.products) && productInfo.products.length > 0) {
    productSummary = productInfo.products
      .slice(0, 3)
      .map((p: any) => p.name || p.product_name || "제품명 없음")
      .join(", ");
  }

  const prompt = `
당신은 대한민국 정부 부처의 복지 사업 신청서 작성을 전문으로 하는 행정 문서 작성 전문가입니다.

## 신청자 정보
${JSON.stringify(userSummary, null, 2)}

## 지원 사업 정보
- 부처: ${program.ministry}
- 사업명: ${program.program_name}
- 지원 한도: ${program.subsidy_limit ? `${(program.subsidy_limit / 10000).toLocaleString()}만원` : "품목별 상이"}

## 추천 보조기기
${productSummary}

## 작성 요청
위 정보를 바탕으로 "${program.program_name}" 신청을 위한 **"기기 필요성 및 활용 계획서"**를 작성해주세요.

### 작성 가이드
1. **행정 용어 사용**: 공문체, 정중하고 격식 있는 어조
2. **구체성**: 추상적 표현보다는 구체적인 상황과 필요성 제시
3. **논리성**: 장애 상황 → 일상생활 어려움 → 보조기기 필요성 → 활용 계획 순으로 논리적 구성
4. **실용성**: 실제 사용 시나리오를 구체적으로 기술

### 출력 형식 (JSON)
{
  "necessity": "기기 필요성 (3-5문단, 각 문단 2-3문장)",
  "utilization_plan": "활용 계획 (2-3문단, 구체적인 사용 시나리오)",
  "expected_effect": "기대 효과 (2-3문단, 일상생활 개선 효과)",
  "full_text": "전체 텍스트 (위 3개 항목을 자연스럽게 연결한 완성된 문서)"
}

### 예시 톤앤매너
- "본인은 [장애유형]으로 인해 [구체적 어려움]을 겪고 있습니다."
- "상기 보조기기를 활용하여 [구체적 활용 방법]을 계획하고 있습니다."
- "이를 통해 [기대 효과]를 기대할 수 있을 것으로 판단됩니다."

반드시 JSON 형식으로만 응답하세요.
`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    // JSON 파싱
    let parsed: GeneratedContent;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback: 기본 템플릿 사용
      parsed = createFallbackContent(userSummary, program, productSummary);
    }

    // 필수 필드 검증
    if (!parsed.necessity || !parsed.utilization_plan || !parsed.expected_effect) {
      console.warn("Missing required fields, using fallback");
      parsed = createFallbackContent(userSummary, program, productSummary);
    }

    // full_text가 없으면 생성
    if (!parsed.full_text) {
      parsed.full_text = `${parsed.necessity}\n\n${parsed.utilization_plan}\n\n${parsed.expected_effect}`;
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback: 기본 템플릿 사용
    return createFallbackContent(userSummary, program, productSummary);
  }
}

/**
 * Fallback: Gemini 실패 시 기본 템플릿 생성
 */
function createFallbackContent(
  userSummary: any,
  program: { ministry: string; program_name: string },
  productSummary: string
): GeneratedContent {
  return {
    necessity: `본인은 ${userSummary.장애유형}으로 인해 일상생활에서 여러 어려움을 겪고 있습니다. ${program.program_name}을 통해 필요한 보조기기를 지원받고자 합니다.`,
    utilization_plan: `지원받은 보조기기를 활용하여 일상생활의 불편함을 해소하고, 독립적인 생활을 영위할 수 있도록 계획하고 있습니다.`,
    expected_effect: `보조기기 활용을 통해 생활의 질이 향상되고, 사회 활동 참여가 원활해질 것으로 기대됩니다.`,
    full_text: `본인은 ${userSummary.장애유형}으로 인해 일상생활에서 여러 어려움을 겪고 있습니다. ${program.program_name}을 통해 필요한 보조기기를 지원받고자 합니다.

지원받은 보조기기를 활용하여 일상생활의 불편함을 해소하고, 독립적인 생활을 영위할 수 있도록 계획하고 있습니다.

보조기기 활용을 통해 생활의 질이 향상되고, 사회 활동 참여가 원활해질 것으로 기대됩니다.`,
  };
}

