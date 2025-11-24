import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main id="main-content" aria-label="개인정보처리방침 메인 콘텐츠" className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">개인정보처리방침</h1>
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">제1조 (개인정보의 처리 목적)</h2>
                <p className="text-gray-300 leading-relaxed">
                  DIDIM(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>서비스 제공: 보조기기 지원사업 정보 제공, AI 상담, 신청서 생성 등</li>
                  <li>회원 관리: 회원 식별, 본인 확인, 불량 회원의 부정 이용 방지</li>
                  <li>서비스 개선: 신규 서비스 개발, 맞춤형 서비스 제공, 서비스 이용 통계 분석</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>회원 정보: 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)</li>
                  <li>서비스 이용 기록: 3년 (통신비밀보호법)</li>
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제3조 (처리하는 개인정보의 항목)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 다음의 개인정보 항목을 처리하고 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>필수항목: 이메일, 이름, 생년월일, 직업, 장애 유형</li>
                  <li>선택항목: 전화번호, 주소</li>
                  <li>자동 수집 항목: IP주소, 쿠키, 접속 로그, 기기정보</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제4조 (개인정보의 제3자 제공)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제5조 (개인정보처리의 위탁)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>인증 서비스: Clerk (인증 및 사용자 관리)</li>
                  <li>데이터베이스: Supabase (데이터 저장 및 관리)</li>
                  <li>AI 서비스: Google Gemini API (AI 상담 서비스)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="text-gray-300 leading-relaxed">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>개인정보 처리정지 요구권</li>
                  <li>개인정보 열람요구권</li>
                  <li>개인정보 정정·삭제요구권</li>
                  <li>개인정보 처리정지 요구권</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  위 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제7조 (개인정보의 파기)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차 및 방법은 다음과 같습니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
                  <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제8조 (개인정보 보호책임자)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-300"><strong>개인정보 보호책임자</strong></p>
                  <p className="text-gray-400 mt-2">이메일: contact@didim.kr</p>
                  <p className="text-gray-400">전화: 1670-5529</p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-white/10 text-sm text-gray-500">
                <p>시행일자: 2025년 1월 1일</p>
                <p>최종 수정일자: 2025년 1월 1일</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

