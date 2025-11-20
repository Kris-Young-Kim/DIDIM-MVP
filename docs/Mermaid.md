Mermaid.md

# 🧜‍♀️ Mermaid Diagrams for Project Didim

이 문서는 프로젝트의 데이터베이스 구조, 사용자 흐름, 그리고 평가 로직의 분기 처리를 시각화합니다.

## 1. Entity Relationship Diagram (ERD)
Supabase 데이터베이스 스키마 구조입니다. 제품(Products) 테이블의 `domain`과 `tags` 컬럼이 매칭의 핵심입니다.

```mermaid
erDiagram
    USERS {
        UUID id PK "Primary Key"
        TEXT clerk_user_id UK "Clerk User ID (Unique)"
        TEXT nickname "사용자 닉네임"
        TIMESTAMPTZ created_at "가입일"
    }

    PRODUCTS {
        BIGINT id PK
        TEXT name "제품명"
        TEXT domain "대분류 (ex: adl_eating, mobility, sensory_vision)"
        TEXT category "상세분류 (ex: weighted_spoon, wheelchair)"
        INT price "가격"
        TEXT image_url "이미지 링크"
        TEXT purchase_link "구매처 링크"
        TEXT[] tags "기능 태그 (ex: 손떨림방지, 고대비)"
        TEXT description "전문가 설명"
    }

    ASSESSMENT_LOGS {
        UUID id PK
        UUID user_id FK "USERS.id 참조"
        JSONB input_data "사용자 응답 (영역, 증상, 목표)"
        JSONB gemini_analysis "AI 분석 결과 (캐싱)"
        TIMESTAMPTZ created_at "평가일"
    }

    RECOMMENDATIONS {
        UUID id PK
        UUID log_id FK "ASSESSMENT_LOGS.id 참조"
        BIGINT product_id FK "PRODUCTS.id 참조"
        BOOLEAN is_clicked "클릭 여부 (전환율 추적)"
        TIMESTAMPTZ created_at
    }

    USERS ||--o{ ASSESSMENT_LOGS : "performs"
    ASSESSMENT_LOGS ||--o{ RECOMMENDATIONS : "generates"
    PRODUCTS ||--o{ RECOMMENDATIONS : "suggested in"

2. Service Sequence Diagram (User Flow)
사용자가 진입하여 평가를 받고, AI가 분석하여 결과를 내놓는 과정입니다.
code
Mermaid
sequenceDiagram
    actor User
    participant Client as Web (Next.js)
    participant Clerk
    participant Server as Server Actions
    participant Gemini as Google AI
    participant DB as Supabase

    User->>Client: 1. 메인 페이지 접속
    Client->>Clerk: 로그인 요청
    Clerk-->>Client: 인증 완료

    User->>Client: 2. [Step 1] 불편한 영역 선택 (다중선택)
    Note right of User: 식사, 이동, 시각 등
    
    Client->>Client: 3. [Step 2] 선택 영역별 상세 폼 렌더링
    Note over Client: '식사' 선택 시 -> 손떨림/악력 질문 노출
    
    User->>Client: 상세 설문 작성 후 제출
    Client->>Server: submitAssessment(data)
    
    Server->>Gemini: 4. 분석 요청 (System Prompt: 보조공학 전문가)
    Gemini-->>Server: JSON { domain, category, tags, summary }
    
    Server->>DB: 5. 제품 검색 (Category & Tags Filtering)
    DB-->>Server: 추천 제품 리스트 반환
    
    Server->>DB: 로그 저장 (Assessment_Logs, Recommendations)
    Server-->>Client: 결과 리포트 반환
    
    Client->>User: 6. 전문가 조언 및 추천 카드 표시
    User->>Client: 제품 클릭
    Client->>DB: trackClick(is_clicked=true)
    Client->>User: 구매처 이동

3. Assessment Logic Flow (Branching)
사용자의 영역 선택에 따라 질문이 달라지는 조건부 로직입니다.
code
Mermaid
graph TD
    A[평가 시작] --> B{Step 1: 영역 선택}
    B -- 이동(Mobility) --> C[이동 상세: 보행/휠체어/운전]
    B -- 일상(ADL) --> D[ADL 상세: 식사/목욕/착탈의]
    B -- 감각(Sensory) --> E[감각 상세: 시각/청각]
    B -- 소통(Comm) --> F[소통 상세: AAC/PC접근]
    
    C --> G[Step 3: 공통 환경 및 목표]
    D --> G
    E --> G
    F --> G
    
    G --> H[AI 분석 수행]