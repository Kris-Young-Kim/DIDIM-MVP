# 📝 Project Didim - 개발 작업 목록 (TODO)

이 문서는 `AP.md`, `PRD.md`, `TRD.md` 등 기획 문서를 바탕으로 **프로젝트 디딤(Didim)**의 개발 단계를 정리한 로드맵입니다.

## ✅ Phase 0: 프로젝트 초기 설정 및 DB 구축

- [x] **환경 변수 설정 (`.env.local`)**
  - [x] Clerk (인증), Supabase (DB), Gemini (AI) API 키 설정
- [x] **데이터베이스 스키마 생성 (Supabase)**
  - [x] `users` 테이블 생성 (Clerk 연동)
  - [x] `products` 테이블 생성 (보조기기 정보)
  - [x] `assessment_logs` 테이블 생성 (평가 기록)
  - [x] `recommendations` 테이블 생성 (추천 결과)
- [x] **라이브러리 설치 및 설정**
  - [x] `@google/generative-ai` (Gemini SDK) 설치
  - [x] shadcn/ui 기본 컴포넌트 설치 (`Button`, `Card`, `Form`, `Progress` 등)

## 📦 Phase 1: 데이터 구축 (Data Construction)

- [x] **제품 데이터 시딩 (Seeding)**
  - [x] **9대 영역(감각, 이동 및 보행, 일상생활, 의사소통, 자세유지, 차량 개조, 컴퓨터 접근, 스포츠 및 여가 활동, 환경개조)**별 대표 제품 60개 등록 (보조기기 품목분류 고시 반영)
  - [x] 각 제품별 `domain`, `category`, `tags` 정확히 입력
  - [x] SQL 시드 파일 작성 (`supabase/migrations/seed_products.sql`)
  - [x] DB에 데이터 입력 (Supabase Query)

## 🎨 Phase 2: UI 구현 및 동적 설문 (Dynamic Form)

- [x] **레이아웃 및 공통 컴포넌트**
  - [x] Header (Navbar) 구현
  - [x] Footer 구현
  - [x] `StepNavigator` (진행 단계 표시바) 구현
- [x] **[Step 1] 영역 선택 페이지 (`/check`)**
  - [x] `DomainSelector` 컴포넌트: **9대 영역** 아이콘 그리드 형태의 다중 선택 UI
- [x] **[Step 2] 상세 질문 폼 (조건부 렌더링)**
  - [x] 선택된 영역에 따라 다른 질문 폼이 나오도록 구현
  - [x] `ADLForm` (식사, 목욕, 착탈의 등)
  - [x] `MobilityForm` (보행, 휠체어, 이승 등)
  - [x] `SensoryForm` (시각, 청각)
  - [x] `CommForm` (의사소통, PC접근) (미구현 - Placeholder 처리)
  - [x] 기타 영역 통합 폼 (미구현 - Placeholder 처리)
- [x] **[Step 3] 환경 및 목표 입력**
  - [x] 사용 환경(집, 학교 등) 및 최종 목표 입력 폼
- [x] **웹 접근성 개선 (GNB, LNB, FNB 등)**
  - [x] Skip Navigation 링크 추가 (`layout.tsx`)
  - [x] GNB, FNB, SNB 시멘틱 태그 및 ARIA 라벨 적용

## 🧠 Phase 3: AI 매칭 및 백엔드 로직

- [x] **Server Action 구현 (`actions/submit-assessment.ts`)**
  - [x] 설문 데이터 수신 및 Gemini API 호출 구조 잡기
- [x] **Gemini 프롬프트 엔지니어링**
  - [x] 보조공학 전문가(ATP) 페르소나 설정
  - [x] JSON 포맷으로 `target_domain`, `recommended_category`, `search_tags` 반환하도록 지시
- [x] **매칭 알고리즘 구현**
  - [x] AI 응답(태그, 카테고리)을 기반으로 Supabase `products` 테이블 검색/필터링 쿼리 작성
- [x] **결과 저장 로직**
  - [x] `assessment_logs` 및 `recommendations` 테이블에 분석 결과 저장

## 📊 Phase 4: 결과 리포트 및 마무리

- [x] **결과 페이지 구현 (`/result/[id]`)**
  - [x] `SpecialistComment`: AI의 전문가 조언 말풍선 UI
  - [x] `ProductCard`: 추천 제품 리스트 표시 (태그 강조)
- [x] **클릭 트래킹 (수익화)**
  - [x] 제품 구매 링크 클릭 시 `recommendations` 테이블 `is_clicked` 업데이트 (`track-click.ts`)
- [x] **최종 테스트 및 배포**
  - [x] 전체 사용자 흐름(Flow) 테스트
  - [x] Vercel 배포 (Build successful)

---

_최종 업데이트: 2025-11-20 (Phase 0 완료)_
