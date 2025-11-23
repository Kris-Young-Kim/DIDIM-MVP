import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import PurchaseButton from "@/components/result/PurchaseButton";
import { findBestProgramAsync, type UserProfile } from "@/lib/ministry-logic";
import { FormDownloader } from "@/components/form-downloader";
import { SiteHeader } from "@/components/site-header";
import { CheckCircle, AlertCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage(props: PageProps) {
  const params = await props.params;
  const supabase = getServiceRoleClient();

  const { data: log, error } = await supabase
    .from("assessment_logs")
    .select("*, recommendations(id, product:products(*))")
    .eq("id", params.id)
    .single();

  if (error || !log) {
    console.error("Result Fetch Error:", error);
    return notFound();
  }

  const analysis = log.gemini_analysis;
  const recommendations = log.recommendations || [];
  const inputData = log.input_data as any;

  // input_data에서 UserProfile 구성
  const currentYear = new Date().getFullYear();
  const age = inputData?.common?.age || (inputData?.birthYear ? currentYear - inputData.birthYear : null);
  const birthYear = inputData?.common?.age ? currentYear - inputData.common.age : inputData?.birthYear || 1980;

  const userProfile: UserProfile = {
    birthYear,
    occupation: inputData?.occupation || "none",
    disabilityType: inputData?.disabilityType || "none",
    isVeteran: inputData?.isVeteran || false,
    ltcGrade: inputData?.ltcGrade || null,
  };

  // 복지 사업 매칭 결과 가져오기
  let welfareProgram = null;
  try {
    welfareProgram = await findBestProgramAsync(userProfile);
  } catch (error) {
    console.error("Welfare program matching error:", error);
    // 에러가 나도 계속 진행
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main id="main-content" aria-label="평가 결과 메인 콘텐츠" className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link
            href="/check"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <span className="mr-2">←</span> 다시 진단하기
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Result Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* 복지 사업 매칭 결과 */}
              {welfareProgram && (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group mb-6">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <CheckCircle className="w-64 h-64" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">복지 사업 매칭</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                      고객님은 <br />
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500`}>
                        {welfareProgram.ministry}
                      </span>{" "}
                      대상자입니다.
                    </h1>

                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">{welfareProgram.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-sm text-gray-500 mb-1">지원 한도</p>
                        <p className="text-2xl font-bold text-white">{welfareProgram.subsidyLimit}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-sm text-gray-500 mb-1">본인 부담금</p>
                        <p className="text-2xl font-bold text-green-400">{welfareProgram.selfPaymentRate}</p>
                      </div>
                    </div>

                    {welfareProgram.programId && (
                      <FormDownloader 
                        programId={welfareProgram.programId} 
                        programName={welfareProgram.programName}
                        assessmentLogId={log.id}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* AI 분석 결과 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                    <span className="text-purple-400 text-xs font-bold">AI</span>
                  </div>
                  <h3 className="text-lg font-bold">Gemini 맞춤 분석</h3>
                  <span className="text-gray-400 text-sm ml-auto">
                    {new Date(log.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                
                <div className="prose max-w-none bg-black/20 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                    🤖 AI 전문가의 추천 의견
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-4">
                    {analysis?.reasoning || "분석 결과가 없습니다."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {analysis?.search_tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 text-gray-300 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Recommendations */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span>🛒</span>
                  추천 보조기기
                  <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full text-sm">
                    {recommendations.length}개
                  </span>
                </h3>
                
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec: any, index: number) => {
                      const product = rec.product;
                      return (
                        <div 
                          key={rec.id} 
                          className="bg-black/20 rounded-xl border border-white/10 overflow-hidden hover:bg-black/30 transition-all duration-300 group"
                        >
                          <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                            {product.image_url && !product.image_url.includes('placeholder') ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img 
                                src={product.image_url} 
                                alt={`${product.name} 제품 이미지${product.description ? ` - ${product.description}` : ""}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900 ${product.image_url && !product.image_url.includes('placeholder') ? 'hidden' : ''}`}
                              aria-label={`${product.name} 이미지 준비 중`}
                            >
                              이미지 준비중
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs font-bold text-blue-400 uppercase tracking-wide bg-blue-400/10 px-2 py-1 rounded">
                                {product.domain} / {product.category}
                              </div>
                            </div>
                            <h3 className="font-bold text-base mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3 line-clamp-2 h-8">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-white/10">
                              <span className="font-bold text-white">
                                {product.market_price?.toLocaleString() || product.price?.toLocaleString() || "가격 문의"}원
                              </span>
                              <PurchaseButton recommendationId={rec.id} purchaseLink={product.purchase_link} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-black/20 rounded-xl border border-white/10">
                    <p className="text-gray-400 text-sm">조건에 맞는 추천 제품을 찾지 못했습니다.</p>
                  </div>
                )}
              </div>

              {welfareProgram && welfareProgram.id !== "general" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <p className="text-sm text-yellow-200/80">
                      {welfareProgram.id === "moel"
                        ? "재직증명서와 사업자등록증 사본이 필요합니다."
                        : welfareProgram.id === "mohw_ltc"
                          ? "장기요양인정서가 필요합니다."
                          : "신청 전 필요 서류를 꼭 확인해주세요."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
