import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react"
import { findBestProgram, type UserProfile } from "@/lib/ministry-logic"
import { FormDownloader } from "@/components/form-downloader"
import { ProductRecommendation } from "@/components/product-recommendation"

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ data?: string }>
}) {
  const { data } = await searchParams

  // Default mock profile if no data provided
  let profile: UserProfile = {
    birthYear: 1980,
    occupation: "worker",
    disabilityType: "physical",
    isVeteran: false,
  }

  // Parse data from URL if available
  if (data) {
    try {
      const decoded = JSON.parse(atob(data))
      profile = {
        ...profile,
        ...decoded,
      }
    } catch (e) {
      console.error("Failed to parse profile data", e)
    }
  }

  const result = findBestProgram(profile)
  const currentYear = new Date().getFullYear()
  const age = currentYear - profile.birthYear

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link
            href="/check"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> 다시 진단하기
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Result Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <CheckCircle className="w-64 h-64" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">AI 분석 결과</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    고객님은 <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
                      {result.ministry}
                    </span>{" "}
                    대상자입니다.
                  </h1>

                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">{result.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-sm text-gray-500 mb-1">지원 한도</p>
                      <p className="text-2xl font-bold text-white">{result.subsidyLimit}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-sm text-gray-500 mb-1">본인 부담금</p>
                      <p className="text-2xl font-bold text-green-400">{result.selfPaymentRate}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <FormDownloader programName={result.programName} />
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-white/10 hover:bg-white/5 text-base hover:text-white bg-transparent"
                    >
                      자세한 공고문 보기
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Analysis Section */}
              <Card className="bg-white/5 border-white/10 p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                    <span className="text-purple-400 text-xs font-bold">AI</span>
                  </div>
                  <h3 className="text-lg font-bold">Gemini 맞춤 분석</h3>
                </div>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    사용자의 연령({age}세)과
                    {profile.occupation === "worker"
                      ? " 직업(근로자)"
                      : profile.occupation === "student"
                        ? " 직업(학생)"
                        : profile.occupation === "job_seeker"
                          ? " 직업(구직자)"
                          : " 상황"}
                    을 종합적으로 분석했습니다.
                  </p>
                  <p>
                    {result.id === "moel" && "근로자로서 업무 효율성을 높일 수 있는 고가 장비 지원이 가능합니다."}
                    {result.id === "mohw_ltc" &&
                      "장기요양등급을 활용하여 복지용구를 저렴하게 대여/구매하실 수 있습니다."}
                    {result.id === "mpva" && "국가유공자로서 최고의 예우와 지원을 받으실 수 있습니다."}
                    {result.id === "general" && "현재 정부 지원 대상은 아니지만, 가성비 좋은 일반 제품을 추천드립니다."}
                  </p>

                  {result.id !== "general" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3 mt-4">
                      <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                      <p className="text-sm text-yellow-200/80">
                        {result.id === "moel"
                          ? "재직증명서와 사업자등록증 사본이 필요합니다."
                          : result.id === "mohw_ltc"
                            ? "장기요양인정서가 필요합니다."
                            : "신청 전 필요 서류를 꼭 확인해주세요."}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar / Recommendations */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  추천 보조기기
                </h3>
                <div className="space-y-4">
                  <ProductRecommendation
                    name="전동 높낮이 조절 책상"
                    price="1,200,000원"
                    image="/public/simple-wooden-desk.png"
                    tag="업무용"
                  />
                  <ProductRecommendation
                    name="인체공학 버티컬 마우스"
                    price="150,000원"
                    image="/public/field-mouse.png"
                    tag="인기"
                  />
                  <ProductRecommendation
                    name="음성 인식 소프트웨어"
                    price="800,000원"
                    image="/public/software-abstract-code.png"
                    tag="SW"
                  />
                </div>
                <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border-0">
                  더 많은 제품 보기
                </Button>
              </div>

              <div className="bg-blue-600 rounded-3xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">전문가 상담이 필요하신가요?</h3>
                  <p className="text-blue-100 text-sm mb-4">16년차 보조공학사가 직접 제품 선정을 도와드립니다.</p>
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold">
                    무료 상담 신청
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
