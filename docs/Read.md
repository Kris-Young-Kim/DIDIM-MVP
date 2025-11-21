---

# 7. README.md

```markdown
# 🏛️ Didim (디딤) - 범부처 통합 보조기기 원스톱 플랫폼

> **"나랏돈 받는 복잡한 보조기기 신청, 디딤이 한 번에 해결합니다."**

## 🌟 Project Vision
대한민국 5개 부처 9개로 흩어진 보조기기 지원 사업을 통합 조회하고, AI를 통해 복잡한 신청 서류까지 자동으로 작성해주는 **Public Tech Platform**입니다.

## 🔑 Key Features
1.  **Ministry Map Engine:** 내 상황(직장인, 학생, 유공자 등)에 맞춰 가장 유리한 정부 지원 사업을 찾아줍니다.
2.  **AI Form Generator:** "필요성", "활용계획" 등 쓰기 어려운 신청서를 Gemini AI가 대신 써주고 HWP/PDF로 만들어줍니다.
3.  **Smart Sourcing:** n8n 자동화를 통해 전 세계의 최신 보조기기 정보를 매주 수집합니다.

## 🛠 Tech Stack
*   **Core:** Next.js 15, Supabase, Clerk
*   **AI:** Google Gemini 1.5 Flash
*   **Ops:** n8n (Automation), Vercel
*   **Special:** Python (for HWP generation)

## 🚀 Getting Started
1.  `npm install`
2.  Supabase에 `migrations` 폴더의 SQL 실행.
3.  `welfare_programs` 테이블에 9개 사업 데이터 시딩.
4.  `npm run dev`

---
**Designed by 16-year ATP & Developer.**