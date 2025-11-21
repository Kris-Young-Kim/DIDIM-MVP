import { SiteHeader } from "@/components/site-header"
import { CheckForm } from "@/components/check-form"

export default function CheckPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">디딤 체크 (Didim Check)</h1>
            <p className="text-gray-400">
              몇 가지 질문에 답해주시면, <br />
              <span className="text-blue-400">가장 유리한 정부 지원 사업</span>을 찾아드립니다.
            </p>
          </div>
          <CheckForm />
        </div>
      </main>
    </div>
  )
}
