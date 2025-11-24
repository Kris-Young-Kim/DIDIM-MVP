import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main id="main-content" aria-label="이용약관 메인 콘텐츠" className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">이용약관</h1>
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
                <p className="text-gray-300 leading-relaxed">
                  본 약관은 DIDIM(이하 "회사")이 제공하는 보조기기 지원사업 정보 및 상담 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>"서비스"란 회사가 제공하는 보조기기 지원사업 정보 조회, AI 기반 상담, 신청서 자동 생성 등의 서비스를 의미합니다.</li>
                  <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.</li>
                  <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
                <p className="text-gray-300 leading-relaxed">
                  본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 공지하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제4조 (서비스의 제공 및 변경)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 다음과 같은 서비스를 제공합니다:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
                  <li>보조기기 지원사업 정보 제공</li>
                  <li>AI 기반 맞춤형 상담 서비스</li>
                  <li>신청서 자동 생성 및 다운로드</li>
                  <li>제품 정보 조회 및 추천</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제5조 (개인정보 보호)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 이용자의 개인정보 보호를 위하여 노력합니다. 이용자의 개인정보 보호에 관해서는 관련 법령 및 회사가 정하는 "개인정보처리방침"에 정한 바에 따릅니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제6조 (면책사항)</h2>
                <p className="text-gray-300 leading-relaxed">
                  회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 또한 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">제7조 (준거법 및 관할법원)</h2>
                <p className="text-gray-300 leading-relaxed">
                  본 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국 법을 적용하며, 본 서비스와 관련하여 발생한 분쟁에 대하여는 관할 법원은 서울중앙지방법원으로 합니다.
                </p>
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

