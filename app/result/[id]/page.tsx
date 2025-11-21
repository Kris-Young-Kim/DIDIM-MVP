import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import PurchaseButton from "@/components/result/PurchaseButton";

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

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-[#6c47ff]/10 text-[#6c47ff] rounded-full text-sm font-bold">
              AI 분석 완료
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(log.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            고객님에게 딱 맞는<br />
            <span className="text-[#6c47ff]">맞춤형 보조기기</span>를 찾았어요!
          </h1>

          <div className="prose max-w-none bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🤖 AI 전문가의 추천 의견
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
              {analysis?.reasoning}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {analysis?.search_tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          추천 제품 리스트
          <span className="text-[#6c47ff] bg-[#6c47ff]/10 px-2 py-0.5 rounded-full text-sm">
            {recommendations.length}개
          </span>
        </h2>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec: any, index: number) => {
              const product = rec.product;
              return (
                <div 
                  key={rec.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                     {product.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                         이미지 준비중
                       </div>
                     )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-[#6c47ff] uppercase tracking-wide bg-[#6c47ff]/5 px-2 py-1 rounded">
                        {product.domain} / {product.category}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#6c47ff] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="font-bold text-lg">
                          {product.price?.toLocaleString()}원
                        </span>
                        <PurchaseButton recommendationId={rec.id} purchaseLink={product.purchase_link} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">조건에 맞는 추천 제품을 찾지 못했습니다.</p>
          </div>
        )}
        
        <div className="mt-12 text-center pb-12">
            <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/check">다시 검사하기</Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
