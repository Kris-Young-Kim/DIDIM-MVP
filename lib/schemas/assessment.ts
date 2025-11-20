import { z } from "zod";

// 1. 감각 (Sensory)
export const SensorySchema = z.object({
  visual_impairment: z.enum(["none", "low_vision", "blind"], {
    required_error: "시각 장애 정도를 선택해주세요.",
  }),
  hearing_impairment: z.enum(["none", "mild", "severe", "deaf"], {
    required_error: "청각 장애 정도를 선택해주세요.",
  }),
});

// 2. 이동 및 보행 (Mobility)
export const MobilitySchema = z.object({
  walking_ability: z.enum(
    ["independent", "cane", "walker", "manual_wheelchair", "power_wheelchair", "bedridden"],
    { required_error: "현재 보행 능력을 선택해주세요." }
  ),
  upper_limb_strength: z.enum(["normal", "weak", "paralysis"], {
    required_error: "상지(팔) 근력을 선택해주세요.",
  }),
});

// 3. 일상생활 (ADL)
export const ADLSchema = z.object({
  eating: z.enum(["independent", "partial_help", "dependent"], {
    required_error: "식사 하기 상태를 선택해주세요.",
  }),
  dressing: z.enum(["independent", "partial_help", "dependent"], {
    required_error: "옷 입기 상태를 선택해주세요.",
  }),
  bathing: z.enum(["independent", "partial_help", "dependent"], {
    required_error: "목욕 하기 상태를 선택해주세요.",
  }),
});

// 4. 의사소통 (Communication)
export const CommunicationSchema = z.object({
  verbal_ability: z.enum(["fluent", "slurred", "limited_words", "non_verbal"], {
    required_error: "구어(말하기) 능력을 선택해주세요.",
  }),
  comprehension: z.enum(["full", "partial", "limited"], {
    required_error: "언어 이해력을 선택해주세요.",
  }),
});

// 5. 자세유지 (Positioning)
export const PositioningSchema = z.object({
  sitting_balance: z.enum(["good", "fair", "poor", "none"], {
    required_error: "앉은 자세 유지 능력을 선택해주세요.",
  }),
  has_deformity: z.enum(["no", "spine", "pelvis", "limbs"], {
    required_error: "신체 변형 유무를 선택해주세요.",
  }),
});

// 6. 차량 개조 (Vehicle)
export const VehicleSchema = z.object({
  driving_status: z.enum(["driver", "passenger", "none"], {
    required_error: "운전 여부를 선택해주세요.",
  }),
  vehicle_type: z.enum(["sedan", "suv", "van", "none"], {
    required_error: "보유 차종을 선택해주세요.",
  }),
});

// 7. 컴퓨터 접근 (Computer)
export const ComputerSchema = z.object({
  keyboard_use: z.enum(["independent", "difficult", "impossible"], {
    required_error: "키보드 사용 능력을 선택해주세요.",
  }),
  mouse_use: z.enum(["independent", "difficult", "impossible"], {
    required_error: "마우스 사용 능력을 선택해주세요.",
  }),
});

// 8. 스포츠 및 여가 (Leisure)
export const LeisureSchema = z.object({
  interests: z.array(z.string()).min(1, "관심 있는 활동을 하나 이상 선택해주세요."),
});

// 9. 환경개조 (Environment)
export const EnvironmentModSchema = z.object({
  home_type: z.enum(["apartment", "house", "villa", "other"], {
    required_error: "거주 형태를 선택해주세요.",
  }),
  barriers: z.array(z.string()).optional(), // 문턱, 계단 등
});

// Step 3: 환경 및 목표 (Environment & Goal) - 공통
export const GoalSchema = z.object({
  age: z.number().min(0).max(120, "유효한 나이를 입력해주세요."),
  residence: z.string().min(1, "거주 지역을 입력해주세요."),
  goal_description: z.string().min(10, "목표를 10자 이상 구체적으로 적어주세요."),
});

// 전체 폼 스키마 (Step 2 + Step 3)
// 실제로는 선택된 도메인에 따라 동적으로 구성되지만, 타입 정의를 위해 모든 필드를 포함합니다.
export const AssessmentSchema = z.object({
  // Step 1 (Implicit in selectedDomains)
  selectedDomains: z.array(z.string()),

  // Step 2 (Dynamic)
  sensory: SensorySchema.optional(),
  mobility: MobilitySchema.optional(),
  adl: ADLSchema.optional(),
  communication: CommunicationSchema.optional(),
  positioning: PositioningSchema.optional(),
  vehicle: VehicleSchema.optional(),
  computer: ComputerSchema.optional(),
  leisure: LeisureSchema.optional(),
  environment: EnvironmentModSchema.optional(),

  // Step 3
  common: GoalSchema.optional(), // Step 3에서 입력
});

export type AssessmentData = z.infer<typeof AssessmentSchema>;

