import { findBestProgramFromDB } from "@/actions/find-welfare-programs";

export type UserProfile = {
  birthYear: number
  occupation: string // 'worker', 'job_seeker', 'student', 'none'
  disabilityType: string // 'physical', 'visual', 'hearing', 'developmental', 'elderly', 'none'
  isVeteran: boolean
  ltcGrade?: number | null
}

export type ProgramResult = {
  id: string
  ministry: string
  programName: string
  description: string
  subsidyLimit: string
  selfPaymentRate: string
  color: string // Tailwind color class for badge
  programId?: number | null // DB의 welfare_programs.id
}

/**
 * 사용자 프로필에 맞는 최적의 복지 사업을 찾습니다.
 * 
 * @deprecated 이 함수는 하드코딩된 로직을 사용합니다. 
 * 새로운 구현은 `findBestProgramFromDB`를 사용하세요.
 * 
 * @param profile - 사용자 프로필 정보
 * @returns 가장 적합한 복지 사업 정보
 */
export function findBestProgram(profile: UserProfile): ProgramResult {
  // 하위 호환성을 위해 기존 로직 유지
  // 하지만 실제로는 DB 기반 함수를 사용하는 것을 권장
  const currentYear = new Date().getFullYear()
  const age = currentYear - profile.birthYear
  const currentMonth = new Date().getMonth() + 1 // 1-12

  // 1. Priority: Veteran (국가유공자)
  if (profile.isVeteran) {
    return {
      id: "mpva",
      ministry: "국가보훈부",
      programName: "보철구 지원사업",
      description: "국가유공자 상이처에 맞는 보철구를 국비로 지원합니다.",
      subsidyLimit: "품목별 상이 (전액 지원)",
      selfPaymentRate: "0%",
      color: "bg-indigo-500",
    }
  }

  // 2. Non-Disabled (or Elderly only)
  if (profile.disabilityType === "none" || profile.disabilityType === "elderly") {
    if (age >= 65 || profile.disabilityType === "elderly") {
      return {
        id: "mohw_ltc",
        ministry: "보건복지부",
        programName: "노인장기요양 복지용구",
        description: "일상생활에 필요한 복지용구를 연간 한도 내에서 구입/대여 지원합니다.",
        subsidyLimit: "연 160만원",
        selfPaymentRate: "15% (일반)",
        color: "bg-orange-500",
      }
    } else {
      return {
        id: "general",
        ministry: "일반 구매",
        programName: "정부 지원 대상 아님",
        description: "현재 조건으로는 정부 지원 대상에 해당하지 않습니다. 가성비 좋은 일반 제품을 추천해드립니다.",
        subsidyLimit: "0원",
        selfPaymentRate: "100%",
        color: "bg-gray-500",
      }
    }
  }

  // 3. Disabled - Occupation Logic
  switch (profile.occupation) {
    case "worker":
      return {
        id: "moel",
        ministry: "고용노동부",
        programName: "보조공학기기 지원사업",
        description: "장애인 근로자의 직무 수행을 돕는 기기를 지원합니다. 한도가 가장 높습니다.",
        subsidyLimit: "1,500만원 (중증 2,000만원)",
        selfPaymentRate: "0% ~ 10%",
        color: "bg-blue-600",
      }
    case "job_seeker":
      return {
        id: "moel_job",
        ministry: "고용노동부",
        programName: "훈련보조공학기기 지원",
        description: "직업 훈련 및 구직 활동에 필요한 기기를 지원합니다.",
        subsidyLimit: "1,000만원",
        selfPaymentRate: "0%",
        color: "bg-blue-500",
      }
    case "student":
      return {
        id: "moe",
        ministry: "교육부",
        programName: "특수교육대상자 보조공학기기",
        description: "학교 생활 및 학습에 필요한 기기를 지원합니다.",
        subsidyLimit: "교육청별 상이",
        selfPaymentRate: "0%",
        color: "bg-green-500",
      }
    default: // 'none'
      // Check Seasonality (May-June is usually MSIT season)
      if (currentMonth >= 5 && currentMonth <= 6) {
        return {
          id: "msit",
          ministry: "과학기술정보통신부",
          programName: "정보통신보조기기 보급사업",
          description: "정보 접근성을 높이는 기기를 지원합니다. (매년 5~6월 신청)",
          subsidyLimit: "제품 가격의 80%",
          selfPaymentRate: "20%",
          color: "bg-purple-500",
        }
      } else {
        return {
          id: "mohw",
          ministry: "보건복지부",
          programName: "장애인 보조기기 교부/급여",
          description: "장애 유형에 맞는 필수 보조기기를 지원합니다.",
          subsidyLimit: "품목별 고시가",
          selfPaymentRate: "10% (차상위 0%)",
          color: "bg-teal-500",
        }
      }
  }
}

/**
 * DB에서 사용자 프로필에 맞는 최적의 복지 사업을 찾습니다.
 * 
 * @param profile - 사용자 프로필 정보
 * @returns 가장 적합한 복지 사업 정보
 */
export async function findBestProgramAsync(profile: UserProfile): Promise<ProgramResult> {
  return await findBestProgramFromDB(profile);
}
