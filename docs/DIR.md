
---

# 2. DIR.md

```markdown
# 📂 Directory Structure for Project Didim

Next.js 15 (App Router) 기반의 폴더 구조입니다. 포괄적인 보조기기 매칭을 위해 `components/check` 내부가 모듈화되어 있습니다.

```text
/
├── app/
│   ├── layout.tsx              # 전역 레이아웃 (ClerkProvider, Font, Analytics)
│   ├── page.tsx                # 랜딩 페이지 (유니버설 디자인 컨셉)
│   ├── (auth)/                 # Clerk 인증 페이지 그룹
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── check/                  # [핵심] 디딤 체크 (평가) 페이지
│   │   └── page.tsx            # Step 관리 및 폼 조합 로직
│   ├── result/                 # 결과 리포트 페이지
│   │   └── [id]/page.tsx       # 평가 ID 기반 결과 뷰
│   └── api/                    # (선택사항) Edge Functions
│
├── components/
│   ├── ui/                     # shadcn/ui 컴포넌트 (Button, Card, Progress...)
│   ├── landing/                # 랜딩 페이지용 컴포넌트
│   │   ├── HeroSection.tsx
│   │   └── FeatureCards.tsx
│   ├── check/                  # 평가 관련 컴포넌트
│   │   ├── StepNavigator.tsx   # 진행 단계 표시바
│   │   ├── DomainSelector.tsx  # Step 1: 영역 선택 (아이콘 그리드)
│   │   └── forms/              # Step 2: 영역별 상세 질문 폼
│   │       ├── ADLForm.tsx     # 식사, 목욕 등
│   │       ├── MobilityForm.tsx# 이동 관련
│   │       ├── SensoryForm.tsx # 시각, 청각
│   │       └── CommForm.tsx    # 의사소통, 컴퓨터
│   ├── result/                 # 결과 페이지용 컴포넌트
│   │   ├── SpecialistComment.tsx # AI 조언 말풍선
│   │   └── ProductCard.tsx     # 태그 강조형 제품 카드
│   └── common/                 # 공통 컴포넌트 (Header, Footer)
│
├── lib/
│   ├── supabase.ts             # Supabase Client 설정
│   ├── gemini.ts               # Google Generative AI 설정 및 프롬프트
│   ├── constants.ts            # 영역(Domain), 카테고리 상수 정의
│   └── utils.ts                # 유틸리티 함수 (clsx, tailwind-merge)
│
├── actions/
│   ├── submit-assessment.ts    # [Server Action] 평가 제출, AI 호출, DB 저장 메인 로직
│   └── track-click.ts          # 클릭 트래킹 로직
│
├── types/
│   └── index.ts                # DB 테이블 타입 및 설문 데이터 인터페이스 정의
│
├── public/                     # 정적 이미지, 아이콘
├── .env.local                  # 환경 변수 (API Keys)
├── middleware.ts               # Clerk 미들웨어
└── tailwind.config.ts          # Tailwind 설정