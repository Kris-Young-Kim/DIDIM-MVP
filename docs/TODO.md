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

## Phase 3.5: Product Showcase & Data Enhancement (Week 3-4)

- [x] **홈페이지 제품 쇼케이스 추가:** `components/product-showcase.tsx` 생성 및 홈페이지 통합 완료 - 고용노동부 보조공학기기 지원사업 제품 표시
- [x] **부처별 제품 쇼케이스 컴포넌트 생성:**
  - `components/msit-product-showcase.tsx` - 과학기술정보통신부 정보통신보조기기 보급사업
  - `components/mpva-product-showcase.tsx` - 국가보훈부 보철구 지원사업
  - `components/moe-product-showcase.tsx` - 교육부 특수교육대상자 보조공학기기
  - `components/mohw-product-showcase.tsx` - 보건복지부 3개 사업 통합 (장애인보조기기 교부/급여, 교부사업, 노인장기요양 복지용구)
  - `components/moel-workplace-accident-showcase.tsx` - 고용노동부 산업재해보상보험 재활보조기구 보급사업
- [x] **복지 사업 정보 상세화:** 중앙보조기기센터 정보 기반으로 각 부처별 사업 정보 상세 업데이트
  - 지원율 정보 추가 (일반/저소득/차상위 등 세분화)
  - 품목 수 및 카테고리 정보 추가
  - 자격 기준 상세화 (나이 예외, 국가유공자 유형, 소득 수준 등)
  - 지원 대상 그룹 명시 (사업주, 근로자, 공무원 등)
- [x] **데이터베이스 마이그레이션 업데이트:** `supabase/migrations/20251121201243_seed_welfare_programs.sql`에 상세 정보 반영
  - 고용노동부: 지원율 단계별 계산 로직, 차량용/이동보조/컴퓨터접근 등 품목 분류
  - 과학기술정보통신부: 국가유공자 지원, 저소득 지원율, 장애유형별 품목 수
  - 국가보훈부: 14개 국가유공자 유형, 51개 품목 분류
  - 교육부: 학생 대상, 교육청별 상이 지원
  - 보건복지부: 3개 사업별 상세 정보 (건강보험급여, 교부사업, 노인장기요양)
- [x] **제품 쇼케이스 정렬 최적화:** 사업별로 수요가 많은 제품을 최우선에 배치하는 정렬 로직 추가
  - 고용노동부: 휠체어 → 컴퓨터 접근 기기 → 작업용 의자/테이블 순
  - 과학기술정보통신부: 화면독서기 → 화면확대기 → 보청기 순
  - 국가보훈부: 의족 → 의수 → 휠체어 순
  - 교육부: 화면독서기 → 확대기 → 보청기 → AAC 순
  - 보건복지부: 휠체어 → 보청기 → 욕창예방 방석 → 목욕의자 순
  - 고용노동부 산재: 의족 → 의수 → 휠체어 → 보조기 순
  - Mock 데이터 및 DB 데이터 모두 정렬 로직 적용 완료

## Phase 3.6: AI Chatbot Feature (Week 4)

- [x] **AI 챗봇 페이지 생성:** `/chat` 페이지 생성 및 로그인 필수 기능 구현 완료
- [x] **채팅 UI 컴포넌트:** `components/chat-interface.tsx` 생성 - 실시간 메시지 표시, 스크롤, 로딩 상태 관리
- [x] **백엔드 Server Action:** `actions/chat.ts` 생성 - Gemini API 활용, 최신 지원사업 및 제품 정보 제공
  - DB에서 최신 지원사업 정보 조회 (최근 20개)
  - DB에서 최신 제품 정보 조회 (최근 30개)
  - 2025년 기준 최신 정보 명시
  - 정확성 보장: 제공된 정보만 기반으로 답변, 추측 정보 방지
- [x] **n8n 연동 구조 준비:** 환경 변수 `N8N_WEBHOOK_URL` 설정 시 n8n 워크플로우 호출 가능하도록 구조 설계
  - n8n이 없으면 Gemini API 직접 호출 (fallback)
- [x] **Header 통합:** `components/site-header.tsx`에 "AI챗봇" 링크 추가 (로그인 시에만 표시)
- [x] **히어로 섹션 통합:** `components/hero-section.tsx`에 로그인 시 "AI챗봇 상담하기" 버튼 표시

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

## 📊 현재 상태 요약

### 완료된 주요 기능

1. ✅ **인증 및 사용자 관리**: Clerk 통합, Supabase 사용자 동기화
2. ✅ **자격 평가 시스템**: Gemini AI 기반 복지 사업 매칭 엔진
3. ✅ **제품 추천 시스템**: 사용자 프로필 기반 보조기기 추천
4. ✅ **신청서 자동 생성**: AI 기반 행정 용어 신청서 작성 및 PDF 생성
5. ✅ **제품 쇼케이스**: 홈페이지에 부처별 제품 전시 (6개 부처, 9개 사업)
6. ✅ **복지 사업 정보 DB**: 5개 부처 9개 사업 상세 정보 구축
7. ✅ **AI 챗봇**: 로그인 후 사용 가능한 AI 상담 기능 (최신 지원사업 및 제품 정보 제공)
8. ✅ **제품 정렬 최적화**: 사업별 수요가 많은 제품 우선 배치

### 데이터베이스 현황

- **welfare_programs**: 9개 사업 정보 (상세 자격 기준, 지원율, 품목 분류 포함)
- **products**: 보조기기 제품 정보 (n8n 크롤링 대비 준비 완료)
- **assessment_logs**: 사용자 자격 평가 기록
- **applications**: AI 생성 신청서 저장

### UI/UX 현황

- 홈페이지: 부처별 제품 쇼케이스 섹션 (6개 부처), 로그인 시 AI챗봇 버튼 표시
- 자격 평가: `/check` 페이지 (도메인별 폼)
- 결과 페이지: `/result/[id]` (복지 사업 매칭 + 제품 추천 + 신청서 생성)
- 제품 필터링: 카테고리별 동적 필터링 기능
- AI 챗봇: `/chat` 페이지 (로그인 필수, 최신 정보 기반 상담)
- Header: 로그인 시 "AI챗봇" 링크 표시

## Phase 3.7: 접근성 개선 (Week 4-5)

- [x] **Skip Link 구현**: 모든 페이지에 메인 콘텐츠로 건너뛰기 링크 추가
- [x] **Landmark 레이블 추가**: main, nav, footer에 aria-label 추가
- [x] **모바일 네비게이션 추가**: 햄버거 메뉴 구현 및 터치 친화적 UI
- [x] **현재 페이지 표시**: 활성 링크에 aria-current 및 시각적 표시
- [x] **Footer 링크 개선**: 실제 페이지 연결 및 연락처 정보 추가
- [x] **폼 접근성 강화**: 입력 필드 레이블 연결 및 aria-describedby 추가
- [x] **이미지 alt 텍스트 개선**: 모든 제품 이미지에 의미있는 alt 추가
- [x] **채팅 인터페이스 접근성**: aria-live, role, aria-label 추가

### 다음 단계 (선택 사항)

- [ ] n8n 워크플로우로 실제 제품 데이터 수집
- [ ] n8n 워크플로우를 통한 AI 챗봇 응답 처리 (현재는 Gemini API 직접 호출, n8n 연동 구조는 준비 완료)
- [ ] Beta 테스트 진행
- [ ] 마케팅 및 커뮤니티 바이럴
- [ ] WCAG 2.1 AA 준수 검증 (자동화 도구 활용)
- [ ] 키보드 단축키 추가 (선택 사항)
- [ ] 스크린 리더 테스트 (선택 사항)
```
