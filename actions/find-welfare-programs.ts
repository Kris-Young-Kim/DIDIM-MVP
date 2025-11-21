"use server";

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { UserProfile } from "@/lib/ministry-logic";

/**
 * 사용자 프로필에 맞는 복지 사업을 DB에서 동적으로 조회
 * 
 * @param profile - 사용자 프로필 정보
 * @returns 자격이 있는 복지 사업 목록 (우선순위 순)
 */
export async function findEligiblePrograms(profile: UserProfile) {
  console.group("[Server Action] findEligiblePrograms Start");
  console.log("User Profile:", JSON.stringify(profile, null, 2));

  try {
    const supabase = getServiceRoleClient();
    const currentYear = new Date().getFullYear();
    const age = currentYear - profile.birthYear;
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // 모든 welfare_programs 조회
    const { data: allPrograms, error } = await supabase
      .from("welfare_programs")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching welfare programs:", error);
      throw new Error(`복지 사업 정보를 불러오는데 실패했습니다: ${error.message}`);
    }

    if (!allPrograms || allPrograms.length === 0) {
      console.warn("No welfare programs found in database");
      return [];
    }

    console.log(`Found ${allPrograms.length} welfare programs`);

    // 각 프로그램의 target_criteria를 평가하여 자격이 있는 프로그램 필터링
    const eligiblePrograms = allPrograms
      .map((program) => {
        const criteria = program.target_criteria as {
          occupation?: string[] | null;
          disability_types?: string[] | null;
          age_range?: { min?: number; max?: number } | null;
          is_veteran?: boolean | null;
          ltc_grade?: { min?: number } | null;
          seasonality?: { months?: number[] } | null;
          priority?: number;
        };

        let score = 0;
        let isEligible = true;

        // 1. 국가유공자 체크 (최우선)
        if (criteria.is_veteran !== null && criteria.is_veteran !== undefined) {
          if (criteria.is_veteran && !profile.isVeteran) {
            isEligible = false;
          } else if (criteria.is_veteran && profile.isVeteran) {
            score += 1000; // 최우선 점수
          }
        }

        // 2. 직업 조건 체크
        if (criteria.occupation && criteria.occupation.length > 0) {
          if (!criteria.occupation.includes(profile.occupation)) {
            isEligible = false;
          } else {
            score += 100; // 직업 매칭 점수
          }
        }

        // 3. 장애 유형 체크
        if (criteria.disability_types && criteria.disability_types.length > 0) {
          if (
            profile.disabilityType === "none" &&
            !criteria.disability_types.includes("none")
          ) {
            // 장애가 없는데 장애가 필요한 사업이면 제외
            if (!criteria.disability_types.includes("elderly")) {
              isEligible = false;
            }
          } else if (
            profile.disabilityType !== "none" &&
            profile.disabilityType !== "elderly" &&
            !criteria.disability_types.includes(profile.disabilityType)
          ) {
            isEligible = false;
          } else if (
            profile.disabilityType === "elderly" &&
            !criteria.disability_types.includes("elderly")
          ) {
            isEligible = false;
          } else {
            score += 50; // 장애 유형 매칭 점수
          }
        }

        // 4. 나이 범위 체크
        if (criteria.age_range) {
          if (criteria.age_range.min && age < criteria.age_range.min) {
            isEligible = false;
          }
          if (criteria.age_range.max && age > criteria.age_range.max) {
            isEligible = false;
          }
          if (isEligible) {
            score += 30; // 나이 범위 매칭 점수
          }
        }

        // 5. 장기요양등급 체크
        if (criteria.ltc_grade && criteria.ltc_grade.min) {
          if (!profile.ltcGrade || profile.ltcGrade < criteria.ltc_grade.min) {
            isEligible = false;
          } else {
            score += 40; // 장기요양등급 매칭 점수
          }
        }

        // 6. 시즌성 체크 (5~6월)
        if (criteria.seasonality && criteria.seasonality.months) {
          if (!criteria.seasonality.months.includes(currentMonth)) {
            isEligible = false;
          } else {
            score += 20; // 시즌 매칭 점수
          }
        }

        // 7. 우선순위 점수 추가
        if (criteria.priority) {
          score += (10 - criteria.priority) * 10; // 낮은 숫자가 높은 우선순위
        }

        return {
          program,
          isEligible,
          score,
        };
      })
      .filter((item) => item.isEligible)
      .sort((a, b) => b.score - a.score) // 점수 높은 순으로 정렬
      .map((item) => item.program);

    console.log(`Found ${eligiblePrograms.length} eligible programs`);
    console.log(
      "Eligible programs:",
      eligiblePrograms.map((p) => ({
        id: p.id,
        ministry: p.ministry,
        program_name: p.program_name,
      }))
    );

    console.groupEnd();
    return eligiblePrograms;
  } catch (error) {
    console.groupEnd();
    console.error("[Server Action] findEligiblePrograms Error:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("복지 사업 조회 중 오류가 발생했습니다.");
  }
}

/**
 * 가장 적합한 복지 사업 1개를 찾아서 ProgramResult 형식으로 반환
 * 
 * @param profile - 사용자 프로필 정보
 * @returns 가장 적합한 복지 사업 정보
 */
export async function findBestProgramFromDB(profile: UserProfile) {
  const eligiblePrograms = await findEligiblePrograms(profile);

  if (eligiblePrograms.length === 0) {
    // 자격이 있는 사업이 없으면 일반 구매 반환
    return {
      id: "general",
      ministry: "일반 구매",
      programName: "정부 지원 대상 아님",
      description:
        "현재 조건으로는 정부 지원 대상에 해당하지 않습니다. 가성비 좋은 일반 제품을 추천해드립니다.",
      subsidyLimit: "0원",
      selfPaymentRate: "100%",
      color: "bg-gray-500",
      programId: null,
    };
  }

  const bestProgram = eligiblePrograms[0];

  // 부처별 색상 매핑
  const ministryColors: Record<string, string> = {
    국가보훈부: "bg-indigo-500",
    고용노동부: "bg-blue-600",
    교육부: "bg-green-500",
    과학기술정보통신부: "bg-purple-500",
    보건복지부: "bg-teal-500",
  };

  const color =
    ministryColors[bestProgram.ministry] || "bg-gray-500";

  // 자부담율 계산 (간단한 로직)
  let selfPaymentRate = "10%";
  if (bestProgram.ministry === "국가보훈부") {
    selfPaymentRate = "0%";
  } else if (bestProgram.ministry === "고용노동부") {
    selfPaymentRate = "0% ~ 10%";
  } else if (bestProgram.ministry === "교육부") {
    selfPaymentRate = "0%";
  } else if (bestProgram.ministry === "과학기술정보통신부") {
    selfPaymentRate = "20%";
  } else if (
    bestProgram.program_name.includes("노인장기요양")
  ) {
    selfPaymentRate = "15% (일반)";
  }

  return {
    id: bestProgram.ministry.toLowerCase().replace(/부$/, ""),
    ministry: bestProgram.ministry,
    programName: bestProgram.program_name,
    description: `${bestProgram.ministry} ${bestProgram.program_name} 대상자입니다.`,
    subsidyLimit: bestProgram.subsidy_limit
      ? `${(bestProgram.subsidy_limit / 10000).toLocaleString()}만원`
      : "품목별 상이",
    selfPaymentRate,
    color,
    programId: bestProgram.id,
  };
}

