---

# 5. TODO.md

```markdown
# ✅ Action Plan

## Phase 1: Foundation (Week 1)

- [x] **DB 스키마 설계:** `docs/ai_studio_code.sql`에 전체 스키마 정의 완료 (users, welfare_programs, products, assessment_logs, recommendations, applications, product_welfare_relations)
- [x] **기본 테이블 생성:** `supabase/migrations/create_didim_tables.sql`로 products, assessment_logs, recommendations 테이블 생성 완료
- [x] **전체 스키마 적용:** `docs/ai_studio_code.sql`의 전체 스키마를 Supabase에 마이그레이션 적용 (welfare_programs, applications, product_welfare_relations 등) - 마이그레이션 파일 생성 완료 (`supabase/migrations/20251121201242_apply_full_schema.sql`)
- [x] **Data Seeding:** 각 부처별 고시 리스트(엑셀) 확보 및 `welfare_programs` 테이블에 9개 부처 사업 정보 Import - 초기 데이터 구조 설계 및 스켈레톤 마이그레이션 생성 완료 (`supabase/migrations/20251121201243_seed_welfare_programs.sql`)
- [x] **Auth:** Clerk 통합 완료, `users` 테이블에 `clerk_user_id`, `occupation`, `birth_year` 필드 정의 및 SyncUserProvider 구현

## Phase 2: The Engine (Week 2)

- [x] **Gemini AI 통합:** `actions/submit-assessment.ts`에 Gemini 1.5 Flash 모델 통합 및 분석 로직 구현 완료
- [x] **Assessment UI - 기본 폼:** `components/check-form.tsx`로 기본 체크 폼 구현 (birthYear, occupation, disabilityType, isVeteran)
- [x] **Assessment UI - 도메인별 폼:** `components/check/forms/`에 ADLForm, SensoryForm, MobilityForm, EnvironmentForm 등 구현 완료
- [x] **Assessment UI - 페이지:** `/check` 페이지 구현 완료
- [x] **제품 매칭 로직:** 기본적인 제품 매칭 및 추천 로직 구현 완료 (`submit-assessment.ts`)
- [x] **Matching Logic:** 유저 상태에 따른 `welfare_programs` 쿼리 필터링 구현 (9개 부처별 자격 판별 로직) - `actions/find-welfare-programs.ts` 생성 및 `lib/ministry-logic.ts` 리팩토링 완료
- [x] **Gemini Prompting 최적화:** 9개 사업 분류 로직 프롬프트 튜닝 및 자격 판별 정확도 향상 - `actions/submit-assessment.ts`의 `createPrompt` 함수에 welfare_programs 정보 포함 및 우선순위 로직 반영 완료

## Phase 3: Automation & Forms (Week 3)

- [ ] **n8n Setup:** 의료기기 정보포털 크롤링 워크플로우 생성
- [ ] **Form Service:** Python(FastAPI)으로 간단한 HWP/PDF 필드 채우기 API 구축
- [ ] **AI Writing:** "있어 보이는 행정 용어" 작문 프롬프트 튜닝 및 `applications` 테이블 연동
- [ ] **서류 자동 생성 UI:** 신청서 작성 및 다운로드 기능 구현

## Phase 4: Launch (Week 4)

- [ ] **Beta Test:** 주변 지인(장애인, 노인 보호자) 대상 테스트
- [ ] **Marketing:** "국비지원 신청서, AI가 대신 써드립니다" 문구로 커뮤니티 바이럴
```
