/* =========================================================
   Welfare Programs 초기 데이터 구조
   - lib/ministry-logic.ts의 로직을 DB 구조로 변환
   - 보건복지부 고시 제2023-257호 보조기기 분류체계 참고
   ========================================================= */

-- 9개 부처별 보조기기 지원사업 정보 스켈레톤
-- target_criteria JSONB 구조:
-- {
--   "occupation": ["worker", "job_seeker"],  // 직업 조건
--   "disability_types": ["physical", "visual"],  // 장애 유형
--   "age_range": {"min": 18, "max": 65},  // 나이 범위
--   "is_veteran": false,  // 국가유공자 여부
--   "ltc_grade": null,  // 장기요양등급 (null이면 불필요)
--   "seasonality": {"months": [5, 6]}  // 신청 시기 (null이면 상시)
-- }

-- 1. 보건복지부 - 장애인 보조기기 교부/급여 (국민건강보험/의료급여)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '보건복지부',
    '장애인 보조기기 교부/급여',
    '{
        "occupation": null,
        "disability_types": ["physical", "visual", "hearing", "developmental"],
        "age_range": null,
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "income_level": null,
        "subsidy_rate": {
            "health_insurance": 0.9,
            "health_insurance_near_poor": 1.0,
            "medical_benefit": 1.0
        },
        "product_count": {
            "total": 90,
            "categories": 9
        },
        "product_categories": [
            "팔의지",
            "다리의지",
            "팔보조기",
            "척추보조기",
            "골반보조기",
            "다리보조기",
            "교정용 신발류",
            "그 밖의 보조기기",
            "소모품"
        ],
        "priority": 5
    }'::jsonb,
    NULL,  -- 품목별 지급기준금액 (기준액, 고시금액, 실구입금액 중 최저금액)
    NULL
) ON CONFLICT DO NOTHING;

-- 1-1. 보건복지부 - 장애인보조기기 교부사업 (저소득 장애인 대상)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '보건복지부',
    '장애인보조기기 교부사업',
    '{
        "occupation": null,
        "disability_types": ["physical", "visual", "hearing", "developmental", "intellectual", "autism", "language", "cardiac", "respiratory"],
        "age_range": null,
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "income_level": ["basic_livelihood", "near_poor"],
        "priority": 5
    }'::jsonb,
    2000000,  -- 연간 200만원 (1인당 최대 3품목)
    NULL
) ON CONFLICT DO NOTHING;

-- 2. 보건복지부 - 노인장기요양 복지용구
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '보건복지부',
    '노인장기요양 복지용구',
    '{
        "occupation": null,
        "disability_types": ["elderly"],
        "age_range": {"min": 65},
        "age_exception": {
            "min": null,
            "conditions": ["dementia", "cerebrovascular_disease", "parkinson"]
        },
        "is_veteran": false,
        "ltc_grade": {"min": 1, "max": 5},
        "seasonality": null,
        "subsidy_rate": {
            "general": 0.85,
            "reduced_6": 0.94,
            "reduced_9": 0.91,
            "basic_livelihood": 1.0
        },
        "product_count": {
            "purchase": 10,
            "rental": 6,
            "purchase_or_rental": 2
        },
        "product_categories": {
            "purchase": [
                "이동변기",
                "목욕의자",
                "성인용보행기",
                "안전손잡이",
                "간이변기",
                "지팡이",
                "욕창예방방석",
                "자세변환용구",
                "요실금팬티",
                "미끄럼방지용품"
            ],
            "rental": [
                "수동휠체어",
                "전동침대",
                "수동침대",
                "이동욕조",
                "목욕리프트",
                "배회감지기"
            ],
            "purchase_or_rental": [
                "욕창예방매트리스",
                "경사로"
            ]
        },
        "priority": 4
    }'::jsonb,
    1600000,  -- 연 160만원 (구입과 대여 합산)
    NULL
) ON CONFLICT DO NOTHING;

-- 3. 고용노동부 - 보조공학기기 지원사업 (근로자)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '고용노동부',
    '보조공학기기 지원사업',
    '{
        "occupation": ["worker"],
        "disability_types": ["physical", "visual", "hearing", "developmental", "cerebral", "cardiac", "respiratory"],
        "age_range": {"min": 18, "max": 65},
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "target_groups": [
            "employer",
            "disabled_employer",
            "disabled_worker",
            "disabled_public_servant"
        ],
        "subsidy_rate": {
            "under_1300000": 0.9,
            "over_1300000": "(1300000 * 0.9) + ((price - 1300000) * 0.95)",
            "custom_made": "same_as_above",
            "modified_product": "base_product_rate + full_modification_cost"
        },
        "product_count": {
            "physical_cerebral": 30,
            "visual": 15,
            "hearing_language": 5,
            "mixed": 3
        },
        "product_categories": {
            "vehicle": [
                "속도제어용 차량 액세서리",
                "조향장치 조작용 차량 액세서리",
                "부가기능 조작용 차량 액세서리",
                "탑승자-좌석 고정 시스템",
                "차량 내 착석용 좌석",
                "휠체어 사용자 차량 승하차 이동용",
                "휠체어 적재용",
                "휠체어 고정용",
                "차대 차체 및 개조",
                "기타 차량용 액세서리"
            ],
            "mobility": [
                "수동 조향식 작업용 전동 휠체어",
                "전동 조향식 작업용 전동 휠체어",
                "수동 휠체어용 추진 장치",
                "물건 보관 및 운반용 휠체어 부착장치",
                "피벗 구동 장치",
                "휠체어 등받이",
                "등 지지대",
                "머리 및 목 지지대",
                "다리 및 발 지지대",
                "몸통 및 골반 지지대",
                "휴대용경사로"
            ],
            "computer": [
                "키보드",
                "컴퓨터포인팅용 시스템",
                "조작용 스틱",
                "손작업용 팔 지지대",
                "로봇형 조작기기",
                "수동 집게",
                "위치 고정 시스템",
                "작업용 테이블",
                "작업 및 사무용 의자",
                "작업용 스툴 및 입식 의자"
            ],
            "visual": [
                "확대용 돋보기",
                "이미지확대 시스템",
                "화면확대 소프트웨어",
                "텍스트 음성 변환(TTS)",
                "DAISY 플레이어 및 전자책 리더",
                "수동 점자 기록 장비",
                "점자정보단말기",
                "시계",
                "촉각 디스플레이",
                "프린터",
                "출력 장치용 소프트웨어",
                "방향 및 위치인식용 보조기기",
                "작업대",
                "사무 및 업무용 기기"
            ],
            "hearing": [
                "소리 증폭기",
                "보청기용 음향 중계시스템",
                "헤드폰, 이어폰 및 헤드셋",
                "다기능 의사소통 시스템"
            ],
            "communication": [
                "대화용 장치",
                "대면 의사소통 소프트웨어",
                "신호장치",
                "음성 및 말하기용 기기"
            ],
            "other": [
                "전동식 산업 운송 장비",
                "수동식 리프팅 운반차",
                "작업용 개인 보호 장비",
                "위치 확인 및 추적 시스템",
                "OCR 장치 및 OCR 소프트웨어",
                "시각 디스플레이"
            ]
        },
        "priority": 1
    }'::jsonb,
    15000000,  -- 1,500만원 (중증 2,000만원)
    NULL
) ON CONFLICT DO NOTHING;

-- 4. 고용노동부 - 훈련보조공학기기 지원 (구직자)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '고용노동부',
    '훈련보조공학기기 지원',
    '{
        "occupation": ["job_seeker"],
        "disability_types": ["physical", "visual", "hearing", "developmental"],
        "age_range": {"min": 18, "max": 65},
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "priority": 2
    }'::jsonb,
    10000000,  -- 1,000만원
    NULL
) ON CONFLICT DO NOTHING;

-- 5. 교육부 - 특수교육대상자 보조공학기기
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '교육부',
    '특수교육대상자 보조공학기기',
    '{
        "occupation": ["student"],
        "disability_types": ["physical", "visual", "hearing", "developmental"],
        "age_range": {"min": 6, "max": 18},
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "priority": 3
    }'::jsonb,
    NULL,  -- 교육청별 상이
    NULL
) ON CONFLICT DO NOTHING;

-- 6. 과학기술정보통신부 - 정보통신보조기기 보급사업
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '과학기술정보통신부',
    '정보통신보조기기 보급사업',
    '{
        "occupation": ["none"],
        "disability_types": ["physical", "visual", "hearing", "developmental", "intellectual", "autism", "language"],
        "age_range": null,
        "is_veteran": true,
        "veteran_grade": {"min": 1, "max": 7},
        "ltc_grade": null,
        "seasonality": {"months": [5, 6]},
        "income_level": null,
        "subsidy_rate": {
            "general": 0.8,
            "low_income": {
                "under_1500000": 0.9,
                "over_1500000": "900000 + ((price - 1000000) * 0.95)"
            }
        },
        "product_count": {
            "visual": 66,
            "physical_cerebral": 22,
            "hearing_language": 37
        },
        "priority": 6
    }'::jsonb,
    NULL,  -- 제품 가격의 80% (일반), 저소득 90% 또는 90만원 + ((가격-100만원)*95%)
    NULL
) ON CONFLICT DO NOTHING;

-- 7. 국가보훈부 - 보철구 지원사업
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '국가보훈부',
    '보철구 지원사업',
    '{
        "occupation": null,
        "disability_types": null,
        "age_range": null,
        "is_veteran": true,
        "veteran_types": [
            "전상군경",
            "공상군경",
            "4·19혁명부상자",
            "공상공무원",
            "국가사회발전특별공로상이자",
            "6·18자유상이자",
            "전투종사군무원",
            "재해부상군경",
            "재해부상공무원",
            "특수임무부상자",
            "애국지사",
            "5·18민주화운동부상자",
            "고엽제후유의증환자",
            "전상_공상_제대군인"
        ],
        "ltc_grade": null,
        "seasonality": null,
        "subsidy_rate": {
            "general": 1.0
        },
        "product_count": {
            "total": 51
        },
        "product_categories": [
            "어깨관절의지",
            "위팔의지",
            "팔꿈치관절의지",
            "아래팔의지",
            "엉덩이관절의지",
            "넓적다리의지",
            "무릎관절의지",
            "종아리의지",
            "손목관절의지",
            "손의지",
            "손가락의지",
            "발의지",
            "발가락의지",
            "전자의수",
            "팩시밀리",
            "이동식전동리프트",
            "샤워형휠체어",
            "팔보조기",
            "다리보조기",
            "척추보조기",
            "맞춤형 교정용 신발",
            "철크럿치",
            "목발",
            "지팡이",
            "흰지팡이",
            "시각장애인용 안경",
            "차량 지붕형 휠체어 보관함",
            "인공요장",
            "수동휠체어",
            "독서확대기",
            "욕창매트리스",
            "자세보조용구",
            "다리의지 실리콘커버",
            "보청기",
            "시각장애인용 시계",
            "저시력보조안경",
            "의이",
            "트랜스퍼보드",
            "의안",
            "의치",
            "비데",
            "욕창예방방석",
            "전동휠체어",
            "시각장애인용 컴퓨터",
            "광학문자판독기",
            "점자정보단말기",
            "홍채렌즈",
            "전동침대",
            "종아리 의지 실리콘 슬리브",
            "휠체어 동력보조장치",
            "개인용 음성 증폭기"
        ],
        "priority": 1
    }'::jsonb,
    NULL,  -- 품목별 지원 기준액 내 전액 지원
    NULL
) ON CONFLICT DO NOTHING;

-- 8. 고용노동부 - 산업재해보상보험 재활보조기구 보급사업 (산재근로자)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '고용노동부',
    '산업재해보상보험 재활보조기구 보급사업',
    '{
        "occupation": ["worker"],
        "disability_types": ["physical", "visual", "hearing"],
        "age_range": null,
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
        "is_workplace_accident": true,
        "priority": 1
    }'::jsonb,
    NULL,  -- 품목별 상한액 범위 내 실구입가의 90% (의료급여 100%)
    NULL
) ON CONFLICT DO NOTHING;

-- 8. 기타 부처 (추후 추가 예정)
-- INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
-- VALUES (
--     '기타부처',
--     '사업명',
--     '{}'::jsonb,
--     NULL,
--     NULL
-- ) ON CONFLICT DO NOTHING;

-- 인덱스 확인 (이미 생성되어 있어야 함)
-- CREATE INDEX IF NOT EXISTS "idx_welfare_target" ON "welfare_programs" USING GIN ("target_criteria");

