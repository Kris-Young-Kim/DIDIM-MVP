export function TrustSection() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-500 mb-8">대한민국 주요 정부 부처 지원사업을 통합 분석합니다</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholder for Ministry Logos - Using text for MVP */}
          <span className="text-xl font-bold text-white">고용노동부</span>
          <span className="text-xl font-bold text-white">보건복지부</span>
          <span className="text-xl font-bold text-white">과학기술정보통신부</span>
          <span className="text-xl font-bold text-white">교육부</span>
          <span className="text-xl font-bold text-white">국가보훈부</span>
        </div>
      </div>
    </section>
  )
}
