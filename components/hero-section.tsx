import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>2025년도 보조기기 지원사업 데이터 업데이트 완료</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          나랏돈 받는 보조기기, <br />
          <span className="text-gradient-blue">디딤이 찾아드립니다.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          9개 부처, 20여 개 지원사업 중 나에게 딱 맞는 혜택을 AI가 분석합니다.
          <br className="hidden md:block" /> 복잡한 서류 작성부터 최저가 구매까지 한 번에 해결하세요.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Button asChild size="lg" className="h-12 px-8 rounded-full text-base bg-white text-black hover:bg-gray-200">
            <Link href="/check">
              내 지원금 조회하기 <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-full text-base border-white/20 hover:bg-white/10 bg-transparent"
          >
            <Link href="#demo">서비스 소개 영상</Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>평균 1,500만원 지원</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>서류 자동 작성</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>3초 간편 가입</span>
          </div>
        </div>
      </div>
    </section>
  )
}
