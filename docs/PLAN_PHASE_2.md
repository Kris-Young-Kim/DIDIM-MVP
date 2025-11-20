# Phase 2: UI 구현 및 동적 설문 개발 계획

이 문서는 `docs/TODO.md`의 Phase 2 작업을 구체화한 실행 계획입니다. 사용자가 선택한 영역에 따라 맞춤형 질문을 제공하는 **동적 설문 시스템**을 구축합니다.

## 1. 개요
- **목표**: 사용자의 장애 상황과 욕구를 파악하기 위한 3단계 설문 UI 구현
- **페이지**: `/check` (설문 메인 페이지)
- **주요 기술**: React Hook Form, Zod (유효성 검사), Shadcn UI, Lucide React Icons

## 2. 단계별 구현 상세

### ✅ Step 1: 레이아웃 및 공통 컴포넌트
가장 먼저 설문의 뼈대가 되는 레이아웃과 내비게이션을 잡습니다.

- [ ] **공통 레이아웃 구성**
  - `Navbar` (기존 컴포넌트 재사용)
  - `Footer`: 저작권 및 간단한 링크 정보 표시
  - `StepNavigator`: 현재 진행 단계(1→2→3)를 시각적으로 보여주는 Progress Bar 및 Step Indicator

### ✅ Step 2: [Step 1] 영역 선택 (Domain Selection)
사용자가 어떤 보조기기가 필요한지 대분류를 선택하는 단계입니다.

- [ ] **`/check/page.tsx` 생성**
  - Client Component로 상태 관리 (`step`, `selectedDomains`, `formData`) 구현
- [ ] **`DomainSelector` 컴포넌트**
  - 9대 영역(감각, 이동, 일상생활 등)을 아이콘과 함께 그리드 카드로 표시
  - 다중 선택 가능하도록 구현 (Toggle 방식)
  - `Next` 버튼 활성화 조건: 최소 1개 이상의 영역 선택 시

### ✅ Step 3: [Step 2] 동적 질문 폼 (Dynamic Forms)
선택한 영역에 맞는 상세 질문을 렌더링합니다. Zod Schema를 활용해 확장성 있게 설계합니다.

- [ ] **Zod Schema 정의**
  - 각 영역별 필수 질문 정의 (예: 이동 -> 실내/실외, 자가운전 여부 등)
- [ ] **조건부 렌더링 컨테이너 (`DynamicFormContainer`)**
  - `selectedDomains` 배열을 순회하며 해당 영역의 폼 컴포넌트 렌더링
- [ ] **개별 폼 컴포넌트 구현**
  - `SensoryForm`: 시각/청각 관련 상세 질문
  - `MobilityForm`: 보행 능력, 휠체어 사용 여부 등
  - `DailyLifeForm` (ADL): 식사, 목욕, 착탈의 등
  - `CommunicationForm`: 의사소통 방식, 기기 사용 경험 등
  - *기타 영역은 공통 폼으로 처리하거나 필요 시 추가*

### ✅ Step 4: [Step 3] 환경 및 목표 (Environment & Goal)
사용자의 물리적 환경과 보조기기 사용 목적을 파악합니다.

- [ ] **`EnvironmentForm` 구현**
  - 주 사용 장소 (가정, 학교, 직장, 야외 등)
  - 예산 범위 (선택 사항)
  - 최종 목표 (서술형 텍스트 에어리어: "스스로 식사를 하고 싶어요")
- [ ] **최종 제출 (Submit)**
  - 모든 데이터를 모아서 콘솔에 출력 (Phase 3에서 API 연동)

## 3. 작업 순서
1. `Footer` 및 `StepNavigator` 구현
2. `/check` 페이지 뼈대 및 상태 관리(Zustand 또는 React State) 설정
3. `DomainSelector` UI 및 로직 구현
4. 각 영역별 폼 컴포넌트(`*Form.tsx`) 구현 및 조건부 렌더링 연결
5. `EnvironmentForm` 구현 및 최종 데이터 취합 테스트

