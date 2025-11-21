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

-- 1. 보건복지부 - 장애인 보조기기 교부/급여
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
        "priority": 5
    }'::jsonb,
    NULL,  -- 품목별 고시가
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
        "is_veteran": false,
        "ltc_grade": {"min": 1},
        "seasonality": null,
        "priority": 4
    }'::jsonb,
    1600000,  -- 연 160만원
    NULL
) ON CONFLICT DO NOTHING;

-- 3. 고용노동부 - 보조공학기기 지원사업 (근로자)
INSERT INTO "welfare_programs" ("ministry", "program_name", "target_criteria", "subsidy_limit", "form_template_path")
VALUES (
    '고용노동부',
    '보조공학기기 지원사업',
    '{
        "occupation": ["worker"],
        "disability_types": ["physical", "visual", "hearing", "developmental"],
        "age_range": {"min": 18, "max": 65},
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": null,
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
        "disability_types": ["physical", "visual", "hearing", "developmental"],
        "age_range": null,
        "is_veteran": false,
        "ltc_grade": null,
        "seasonality": {"months": [5, 6]},
        "priority": 6
    }'::jsonb,
    NULL,  -- 제품 가격의 80%
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
        "ltc_grade": null,
        "seasonality": null,
        "priority": 1
    }'::jsonb,
    NULL,  -- 품목별 상이 (전액 지원)
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

