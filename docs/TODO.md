# 📝 Project Didim - 개발 작업 목록 (TODO)

이 문서는 `AP.md`, `PRD.md`, `TRD.md` 등 기획 문서를 바탕으로 **프로젝트 디딤(Didim)**의 개발 단계를 정리한 로드맵입니다.

## ✅ Phase 0: 프로젝트 초기 설정 및 DB 구축
- [ ] **환경 변수 설정 (`.env.local`)**
  - [ ] Clerk (인증), Supabase (DB), Gemini (AI) API 키 설정
- [ ] **데이터베이스 스키마 생성 (Supabase)**
  - [ ] `users` 테이블 생성 (Clerk 연동)
  - [ ] `products` 테이블 생성 (보조기기 정보)
  - [ ] `assessment_logs` 테이블 생성 (평가 기록)
  - [ ] `recommendations` 테이블 생성 (추천 결과)
- [ ] **라이브러리 설치 및 설정**
  - [ ] `@google/generative-ai` (Gemini SDK) 설치
  - [ ] shadcn/ui 기본 컴포넌트 설치 (`Button`, `Card`, `Form`, `Progress` 등)

## 📦 Phase 1: 데이터셋 확보 (Data Construction)
- [ ] **기초 제품 데이터 시딩 (Seeding)**
  - [ ] `products` 테이블에 4대 영역(식사, 이동, 감각, 소통)별 대표 제품 50~60개 등록
  - [ ] 각 제품별 `domain`, `category`, `tags` 정확히 입력 (매칭 로직의 핵심)

## 🎨 Phase 2: UI 구현 및 동적 설문 (Dynamic Form)
- [ ] **레이아웃 및 공통 컴포넌트**
  - [ ] Header (로고, 로그인 상태), Footer 구현
  - [ ] `StepNavigator` (진행 단계 표시바) 구현
- [ ] **[Step 1] 영역 선택 페이지 (`/check`)**
  - [ ] `DomainSelector` 컴포넌트: 아이콘 그리드 형태의 다중 선택 UI
- [ ] **[Step 2] 상세 질문 폼 (조건부 렌더링)**
  - [ ] 선택된 영역에 따라 다른 질문 폼이 나오도록 구현
  - [ ] `ADLForm` (식사, 목욕 등)
  - [ ] `MobilityForm` (이동, 휠체어)
  - [ ] `SensoryForm` (시각, 청각)
  - [ ] `CommForm` (의사소통, PC접근)
- [ ] **[Step 3] 환경 및 목표 입력**
  - [ ] 사용 환경(집, 학교 등) 및 최종 목표 입력 폼

## 🧠 Phase 3: AI 매칭 및 백엔드 로직
- [ ] **Server Action 구현 (`actions/submit-assessment.ts`)**
  - [ ] 설문 데이터 수신 및 Gemini API 호출 구조 잡기
- [ ] **Gemini 프롬프트 엔지니어링**
  - [ ] 보조공학 전문가(ATP) 페르소나 설정
  - [ ] JSON 포맷으로 `target_domain`, `recommended_category`, `search_tags` 반환하도록 지시
- [ ] **매칭 알고리즘 구현**
  - [ ] AI 응답(태그, 카테고리)을 기반으로 Supabase `products` 테이블 검색/필터링 쿼리 작성
- [ ] **결과 저장 로직**
  - [ ] `assessment_logs` 및 `recommendations` 테이블에 분석 결과 저장

## 📊 Phase 4: 결과 리포트 및 마무리
- [ ] **결과 페이지 구현 (`/result/[id]`)**
  - [ ] `SpecialistComment`: AI의 전문가 조언 말풍선 UI
  - [ ] `ProductCard`: 추천 제품 리스트 표시 (태그 강조)
- [ ] **클릭 트래킹 (수익화)**
  - [ ] 제품 구매 링크 클릭 시 `recommendations` 테이블 `is_clicked` 업데이트 (`track-click.ts`)
- [ ] **최종 테스트 및 배포**
  - [ ] 전체 사용자 흐름(Flow) 테스트
  - [ ] Vercel 배포

---
*작성일: 2025-11-20*

