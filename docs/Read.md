
---

# 3. README.md

```markdown
# ♿️ Didim (디딤) - 유니버설 보조기기 매칭 플랫폼

> **"누구에게나 장벽 없는 일상을."**  
> 디딤은 사용자의 신체 기능, 감각, 환경을 분석하여 일상생활(ADL), 이동, 의사소통에 필요한 최적의 보조기기를 AI로 매칭해주는 서비스입니다.

## 🌟 프로젝트 개요

- **목표:** 단순 이동 보조를 넘어 식사, 목욕, 컴퓨터 접근, 의사소통 등 삶의 전 영역을 지원하는 도구 추천.
- **대상:** 노화로 기능이 저하된 어르신, 신체/감각 장애인, 일시적 부상자 등 "도구가 필요한 모든 사람".
- **핵심 기술:** 
  - 전문가(ATP)의 임상 추론 로직을 모방한 **Google Gemini AI**.
  - 영역별 맞춤형 설문 시스템 (Conditional Form).

## 🛠 기술 스택 (Tech Stack)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Clerk
- **AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Styling:** Tailwind CSS + shadcn/ui

## 🚀 주요 기능

1.  **포괄적 진단 (Assessment):** 
    - 이동, 일상생활(식사/목욕), 감각(시각/청각), 의사소통/PC접근 등 4대 영역 평가.
2.  **AI Specialist (Gemini):** 
    - 사용자의 잔존 기능과 환경을 분석하여 "왜 이 도구가 필요한지" 전문가적 조언 제공.
3.  **정밀 매칭:** 
    - 기능 태그(Tags) 기반 매칭 (ex: `#손떨림방지`, `#한손조작`, `#고대비`).
4.  **수익화 모델:** 
    - 쿠팡 파트너스 등 제휴 링크 연결 및 클릭률(CTR) 추적.

## 🗄️ 데이터베이스 스키마 요약 (Supabase)

- `users`: 사용자 정보 (Clerk 연동)
- `products`: 보조기기 정보 (`domain`, `category`, `tags` 포함)
- `assessment_logs`: 설문 원본 및 AI 분석 결과
- `recommendations`: 추천 결과 및 클릭 트래킹

## ⚙️ 환경 변수 설정 (.env.local)

프로젝트 실행을 위해 다음 키가 필요합니다.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key