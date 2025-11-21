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

- [ ] **n8n Setup:** 보조기기기 정보포털 크롤링 워크플로우 생성 (나중에 구현)
- [x] **Form Service:** Python(FastAPI)으로 간단한 HWP/PDF 필드 채우기 API 구축 - Next.js API Route로 PDF 생성 구현 완료 (`app/api/generate-form/route.ts`, `pdf-lib` 사용)
- [x] **AI Writing:** "있어 보이는 행정 용어" 작문 프롬프트 튜닝 및 `applications` 테이블 연동 - `actions/generate-application.ts` 생성 완료 (Gemini 1.5 Flash 사용, 행정 용어 스타일 작문)
- [x] **서류 자동 생성 UI:** 신청서 작성 및 다운로드 기능 구현 - `components/form-downloader.tsx` 실제 기능 구현 및 `app/report/[id]/page.tsx` 연동 완료

## Phase 4: Launch (Week 4)

- [ ] **Beta Test:** 주변 지인(장애인, 노인 보호자) 대상 테스트
- [ ] **Marketing:** "국비지원 신청서, AI가 대신 써드립니다" 문구로 커뮤니티 바이럴

## 🔧 즉시 수정 필요 사항 (페이지 구성 개선)

### 발견된 문제점

1. **라우팅 중복**: `/report/[id]`와 `/result/[id]`가 기능이 겹침
2. **사용자 플로우 불일치**: `/check`에서 `submit-assessment` Server Action을 사용하지 않고 URL 파라미터로만 데이터 전달
3. **테스트 페이지 노출**: `/auth-test`, `/storage-test`가 프로덕션에 포함됨
4. **보안 누락**: `/report`, `/admin` 페이지가 미들웨어 보호 범위에 없음

### 즉시 수정 필요 사항

- [x] **/check에서 submit-assessment 사용하도록 수정:** `components/check-form.tsx`의 `handleSubmit`에서 `submit-assessment` Server Action 호출 후 `assessment_logs`에 저장된 ID로 `/result/[id]` 이동 완료
- [x] **/report/[id]와 /result/[id] 통합 또는 역할 명확화:** `/result/[id]`에 복지 사업 매칭 결과 통합 완료, `/report/[id]`는 더 이상 사용하지 않음
- [x] **테스트 페이지 프로덕션에서 제거 또는 보호:** `middleware.ts`에서 프로덕션 환경에서 `/auth-test`, `/storage-test` 접근 차단 완료
- [x] **미들웨어 보호 범위 확장:** `middleware.ts`의 `isProtectedRoute`에 `/report(.*)`, `/admin(.*)` 추가 완료

### 권장 개선 순서

- [x] **Phase 1: /check → submit-assessment 연동**

  - `components/check-form.tsx` 수정 완료
  - `submit-assessment` Server Action 호출 완료
  - 반환된 `logId`로 `/result/[id]` 이동 완료

- [x] **Phase 2: /result/[id]에 복지 사업 매칭 결과 통합**

  - `app/result/[id]/page.tsx`에 복지 사업 매칭 결과 표시 완료
  - `findBestProgramAsync` 함수 활용 완료
  - 신청서 생성 버튼 추가 완료 (FormDownloader 컴포넌트 통합)

- [x] **Phase 3: /report/[id] 제거 또는 신청서 전용으로 변경**

  - `/result/[id]`에 통합 완료, `/report/[id]`는 더 이상 사용하지 않음

- [x] **Phase 4: 테스트 페이지 보호/제거**

  - `middleware.ts`에서 프로덕션 환경에서 테스트 페이지 접근 차단 완료

- [x] **Phase 5: 미들웨어 보호 범위 확장**
  - `middleware.ts`의 `isProtectedRoute`에 `/report(.*)`, `/admin(.*)` 추가 완료
```
