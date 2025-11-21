3. External Integrations
HWP Generation: pyhwp 또는 hwp5-automated 라이브러리를 활용하여 필드 채우기 구현.
n8n Webhook: Supabase Edge Function에서 n8n으로 트리거 전송.
code
Code
---

# 4. Mermaid.md

```markdown
# 🧜‍♀️ Diagrams

## 1. The Ministry Map Logic (Flowchart)
9개 사업 판별 로직의 시각화입니다.

```mermaid
flowchart TD
    Start[사용자 진입] --> CheckType{장애 등록 여부}
    
    CheckType -- Yes --> CheckOcc{직업 확인}
    CheckType -- No --> CheckAge{65세 이상/노인성질환}
    
    %% 고용부 로직
    CheckOcc -- 직장인/사업주 --> MOEL[고용노동부: 보조공학기기 지원]
    CheckOcc -- 구직자 --> MOEL_Job[고용노동부: 훈련보조기기]
    CheckOcc -- 학생 --> MOE[교육부: 특수교육지원]
    CheckOcc -- 무직 --> CheckSeason{5~6월 인가?}
    
    %% 과기부/복지부 로직
    CheckSeason -- Yes --> MSIT[과기정통부: 정보통신보조기기]
    CheckSeason -- No --> MOHW[보건복지부: 교부/급여]
    
    %% 노인 로직
    CheckAge -- Yes --> LTC[복지부: 노인장기요양 복지용구]
    CheckAge -- No --> GenMarket[일반 구매 (가성비 추천)]
    
    %% 보훈 로직 (최우선 체크)
    Start -.-> CheckVet{국가유공자?}
    CheckVet -- Yes --> MPVA[국가보훈부: 보철구 지원]

    2. Auto-Form Generation Process
서류 생성 시퀀스 다이어그램입니다.
code
Mermaid
sequenceDiagram
    actor User
    participant Client
    participant AI as Gemini
    participant Generator as Python Form Engine
    participant DB

    User->>Client: "신청서 작성하기" 클릭
    Client->>DB: 유저 정보 + 제품 정보 조회
    Client->>AI: 프롬프트 전송 (상황 설명 + 필요성 작문 요청)
    AI-->>Client: 작성된 텍스트 반환 (JSON)
    
    Client->>Generator: 템플릿 ID + 채울 데이터 전송
    Generator->>Generator: HWP 템플릿에 데이터 삽입
    Generator-->>Client: 다운로드 URL 반환
    
    Client->>User: 파일 다운로드 실행