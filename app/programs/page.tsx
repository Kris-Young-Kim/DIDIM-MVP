import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { ProductShowcase } from "@/components/product-showcase"
import { MSITProductShowcase } from "@/components/msit-product-showcase"
import { MPVAProductShowcase } from "@/components/mpva-product-showcase"
import { MOEProductShowcase } from "@/components/moe-product-showcase"
import { MOHWProductShowcase } from "@/components/mohw-product-showcase"
import { WorkplaceAccidentProductShowcase } from "@/components/moel-workplace-accident-showcase"
import { LoginRequired } from "@/components/login-required"
import { auth } from "@clerk/nextjs/server"
import { Building2, Award, GraduationCap, Heart, Laptop, Shield } from "lucide-react"
import Link from "next/link"

interface ProgramsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProgramsPage({ searchParams }: ProgramsPageProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main className="pt-16">
        {/* 헤더 섹션 */}
        <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                정부 지원사업 안내
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                장애인과 노인을 위한 다양한 보조기기 지원사업을 확인하세요
              </p>
            </div>

            {/* 부처별 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {/* 고용노동부 */}
              <Link href="#moel-general" className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">고용노동부</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  장애인 근로자 및 구직자를 위한 보조공학기기 지원
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 보조공학기기 지원사업</li>
                  <li>• 훈련보조공학기기 지원</li>
                  <li>• 산업재해보상보험 재활보조기구</li>
                </ul>
              </Link>

              {/* 과학기술정보통신부 */}
              <Link href="#msit" className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <Laptop className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold">과학기술정보통신부</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  정보통신보조기기 보급으로 디지털 접근성 향상
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 정보통신보조기기 보급사업</li>
                  <li>• 시각/청각/지체장애 지원</li>
                  <li>• 최대 100만원 지원</li>
                </ul>
              </Link>

              {/* 국가보훈부 */}
              <Link href="#mpva" className="p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-lg hover:border-indigo-500/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-xl font-bold">국가보훈부</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  국가유공자를 위한 보철구 전액 지원
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 보철구 지원사업</li>
                  <li>• 51개 품목 지원</li>
                  <li>• 전액 지원 (자부담 0%)</li>
                </ul>
              </Link>

              {/* 교육부 */}
              <Link href="#moe" className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold">교육부</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  특수교육대상자를 위한 보조공학기기 지원
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 특수교육대상자 보조공학기기</li>
                  <li>• 학교를 통해 신청</li>
                  <li>• 교육청별 상이</li>
                </ul>
              </Link>

              {/* 보건복지부 */}
              <Link href="#mohw" className="p-6 bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-lg hover:border-pink-500/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h3 className="text-xl font-bold">보건복지부</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  장애인 및 노인을 위한 종합 보조기기 지원
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 장애인보조기기 교부/급여</li>
                  <li>• 장애인보조기기 교부사업</li>
                  <li>• 노인장기요양 복지용구</li>
                </ul>
              </Link>
            </div>
          </div>
        </section>

        {/* 제품 쇼케이스 섹션 */}
        {userId ? (
          <>
            {/* 보건복지부 3개 사업 - 최상단 */}
            <MOHWProductShowcase />
            
            {/* 고용노동부 */}
            <ProductShowcase category={category} />
            <WorkplaceAccidentProductShowcase />
            
            {/* 과학기술정보통신부 */}
            <MSITProductShowcase />
            
            {/* 국가보훈부 */}
            <MPVAProductShowcase />
            
            {/* 교육부 */}
            <MOEProductShowcase />
          </>
        ) : (
          <LoginRequired />
        )}
      </main>
      <Footer />
    </div>
  )
}

