import { FileText, Search, ShoppingBag, Zap } from "lucide-react"

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            복잡한 행정은 AI에게, <br />
            <span className="text-gray-500">당신은 혜택만 누리세요.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Ministry Map */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ministry Map Engine</h3>
            <p className="text-gray-400 leading-relaxed">
              내 나이, 직업, 장애 유형만 입력하세요. 9개 부처 사업 중 본인부담금이 가장 적고 한도가 높은 최적의 루트를
              찾아드립니다.
            </p>
          </div>

          {/* Feature 2: AI Form Generator */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI 서류 자동 생성</h3>
            <p className="text-gray-400 leading-relaxed">
              "활용 계획서", "필요성" 등 쓰기 어려운 신청서. Gemini AI가 행정 용어로 완벽하게 작성하여 HWP/PDF 파일로
              제공합니다.
            </p>
          </div>

          {/* Feature 3: Smart Sourcing */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShoppingBag className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Sourcing</h3>
            <p className="text-gray-400 leading-relaxed">
              국내 제품뿐만 아니라 전 세계의 최신 보조기기 정보를 매주 업데이트하여 더 넓은 선택지를 제공합니다.
            </p>
          </div>
        </div>

        {/* Bento Grid Section for Detail */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
                <Zap className="w-3 h-3" />
                <span>실시간 업데이트</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">매주 월요일 09:00</h3>
              <p className="text-gray-400">새로운 보조기기 데이터가 자동으로 추가됩니다.</p>
            </div>
            <div className="mt-8 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-500 w-2/3" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white text-black flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-2xl font-bold mb-2">누적 지원금 120억 돌파</h3>
              <p className="text-gray-600">디딤을 통해 많은 분들이 혜택을 받았습니다.</p>
            </div>
            <div className="mt-8">
              <div className="text-5xl font-bold tracking-tighter">
                12,450<span className="text-2xl text-gray-500 ml-1">건</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">지난달 신청 완료 건수</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
