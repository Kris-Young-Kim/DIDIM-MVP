import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Building2 } from "lucide-react";
import { ProductCategoryFilter } from "@/components/product-category-filter";

interface Product {
  id: number;
  name: string;
  description: string | null;
  domain: string | null;
  category: string | null;
  market_price: number | null;
  purchase_link: string | null;
  image_url: string | null;
  tags: string[] | null;
}

// 한국장애인고용공단 보조공학기기 카테고리 체계 (atkeadshop.co.kr 기준)
const ASSISTIVE_TECH_CATEGORIES = {
  all: { name: "전체", domain: null },
  body: { name: "신체측정보조공학기기", domain: "body_support" },
  mobility: { name: "이동관련보조공학기기", domain: "mobility" },
  furniture: { name: "가구설비보조공학기기", domain: "furniture" },
  communication: { name: "의사소통보조공학기기", domain: "communication" },
  control: { name: "제어운반보조공학기기", domain: "control" },
  work: { name: "직무활동보조공학기기", domain: "work" },
} as const;

type CategoryKey = keyof typeof ASSISTIVE_TECH_CATEGORIES;

async function getProducts(
  limit: number = 8,
  categoryFilter: CategoryKey = "all"
): Promise<Product[]> {
  try {
    const supabase = getServiceRoleClient();
    
    let query = supabase
      .from("products")
      .select("id, name, description, domain, category, market_price, purchase_link, image_url, tags, is_active")
      .order("created_at", { ascending: false })
      .limit(limit);

    // 카테고리 필터 적용 (domain 기반)
    if (categoryFilter !== "all") {
      const targetDomain = ASSISTIVE_TECH_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        // domain 매핑: 기존 domain을 새로운 카테고리로 매핑
        const domainMapping: Record<string, string[]> = {
          body_support: ["adl", "body_support"],
          mobility: ["mobility"],
          furniture: ["adl", "furniture"],
          communication: ["communication", "sensory"],
          control: ["control"],
          work: ["work"],
        };
        
        const mappedDomains = domainMapping[targetDomain] || [targetDomain];
        query = query.in("domain", mappedDomains);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Product fetch error:", error);
      return getMockProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    if (activeProducts.length === 0) {
      console.log("No products found, using mock data");
      return getMockProducts(categoryFilter);
    }

    return activeProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return getMockProducts(categoryFilter);
  }
}

// 고용노동부 사업 관련 제품인지 확인
async function isMOELProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry")
      .eq("ministry", "고용노동부")
      .limit(1);
    
    // 고용노동부 사업이 있고, 제품이 직무활동/제어운반/의사소통 관련이면 연관 제품으로 간주
    if (data && data.length > 0) {
      const moelRelatedDomains = ["work", "control", "communication", "mobility"];
      return moelRelatedDomains.some(d => product.domain?.includes(d));
    }
    return false;
  } catch {
    return false;
  }
}

// Mock 데이터 (atkeadshop.co.kr 스타일)
function getMockProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 이동관련보조공학기기
    {
      id: 1,
      name: "전동 조향식 휠체어",
      description: "직무 수행을 위한 전동 휠체어입니다. 고용노동부 지원 대상입니다.",
      domain: "mobility",
      category: "전동 조향식 휠체어",
      market_price: 5122500,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["휠체어", "전동", "고용노동부", "직무활동"],
    },
    {
      id: 2,
      name: "수동 휠체어 추진장치",
      description: "수동 휠체어에 부착하여 전동으로 추진할 수 있는 장치입니다.",
      domain: "mobility",
      category: "수동 휠체어 추진장치",
      market_price: 2800000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["휠체어", "추진장치", "이동보조"],
    },
    // 의사소통보조공학기기
    {
      id: 3,
      name: "텍스트 음성 변환장치",
      description: "입력한 텍스트를 음성으로 변환하여 읽어주는 장치입니다.",
      domain: "communication",
      category: "텍스트 음성 변환장치",
      market_price: 4149225,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["의사소통", "TTS", "음성출력", "고용노동부"],
    },
    {
      id: 4,
      name: "이미지 확대 시스템",
      description: "화면을 확대하여 저시력인의 컴퓨터 사용을 돕는 시스템입니다.",
      domain: "communication",
      category: "이미지 확대 시스템",
      market_price: 4518045,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["시각", "확대", "컴퓨터접근", "고용노동부"],
    },
    // 제어운반보조공학기기
    {
      id: 5,
      name: "컴퓨터 포인팅 시스템",
      description: "손을 사용하기 어려운 분들을 위한 대체 입력 장치입니다.",
      domain: "control",
      category: "컴퓨터 포인팅 시스템",
      market_price: 1200000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["컴퓨터", "입력장치", "고용노동부", "직무활동"],
    },
    {
      id: 6,
      name: "조작용 스틱",
      description: "입력 장치를 조작하기 위한 보조 도구입니다.",
      domain: "control",
      category: "조작용 스틱",
      market_price: 45000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["조작", "입력보조", "저비용"],
    },
    // 직무활동보조공학기기
    {
      id: 7,
      name: "작업 및 사무용의자",
      description: "장시간 업무에 적합한 맞춤형 사무용 의자입니다.",
      domain: "work",
      category: "작업 및 사무용의자",
      market_price: 850000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["의자", "사무용", "고용노동부", "직무활동"],
    },
    {
      id: 8,
      name: "작업용 테이블",
      description: "높이 조절이 가능한 작업용 테이블입니다.",
      domain: "work",
      category: "작업용 테이블",
      market_price: 650000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["테이블", "작업용", "고용노동부"],
    },
    // 가구설비보조공학기기
    {
      id: 9,
      name: "등지지대",
      description: "올바른 자세 유지를 돕는 등받이 지지대입니다.",
      domain: "furniture",
      category: "등지지대",
      market_price: 180000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["자세유지", "등받이", "가구"],
    },
    // 신체측정보조공학기기
    {
      id: 10,
      name: "욕창예방방석",
      description: "장시간 앉아있을 때 욕창을 예방하는 방석입니다.",
      domain: "body_support",
      category: "욕창예방방석",
      market_price: 250000,
      purchase_link: "https://atkeadshop.co.kr/",
      image_url: null,
      tags: ["욕창예방", "방석", "건강"],
    },
  ];

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return allProducts.slice(0, 8);
  }

  const targetDomain = ASSISTIVE_TECH_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return allProducts.slice(0, 8);

  const domainMapping: Record<string, string[]> = {
    body_support: ["body_support"],
    mobility: ["mobility"],
    furniture: ["furniture"],
    communication: ["communication"],
    control: ["control"],
    work: ["work"],
  };

  const mappedDomains = domainMapping[targetDomain] || [];
  return allProducts
    .filter(p => mappedDomains.some(d => p.domain?.includes(d)))
    .slice(0, 8);
}

// 카테고리 이름 변환 (domain → 한글명)
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    body_support: "신체측정보조공학기기",
    mobility: "이동관련보조공학기기",
    furniture: "가구설비보조공학기기",
    communication: "의사소통보조공학기기",
    control: "제어운반보조공학기기",
    work: "직무활동보조공학기기",
    adl: "일상생활보조기기",
    sensory: "감각보조기기",
  };
  
  return domain ? domainMap[domain] || domain : "보조기기";
}

interface ProductShowcaseProps {
  category?: string;
}

export async function ProductShowcase({ category = "all" }: ProductShowcaseProps) {
  const products = await getProducts(8, category as CategoryKey);
  const hasProducts = products.length > 0;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              고용노동부 보조공학기기 지원사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            장애인 근로자의 직무 수행을 돕는 보조공학기기를 지원합니다. 
            <span className="text-blue-400 font-semibold"> 한도 1,500만원 (중증 2,000만원)</span>
          </p>
          
          {/* 지원 정보 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-4xl mx-auto">
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">130만원 이하</h3>
              <p className="text-sm text-blue-200">
                보조공학기기 가격의 90% 지원
              </p>
            </div>
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="text-green-300 font-semibold mb-2">130만원 초과</h3>
              <p className="text-sm text-green-200">
                130만원의 90% + ((가격-130만원)×95%)
              </p>
            </div>
          </div>
          
          {/* 지원 대상 안내 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg max-w-2xl mx-auto">
            <Building2 className="w-5 h-5 text-blue-400" />
            <p className="text-blue-300 font-semibold text-sm">
              지원 대상: 장애인 고용 사업주, 장애인 사업주(4명 이하), 장애인근로자·공무원
            </p>
          </div>
          
          {/* 품목 수 안내 */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              지원 품목: 차량용, 이동보조, 컴퓨터접근, 시각보조, 청각보조, 의사소통보조 등
            </p>
          </div>
          
          {/* 카테고리 필터 탭 */}
          <ProductCategoryFilter />
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isMOEL = await isMOELProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  {/* 제품 이미지 */}
                  <div className="relative aspect-square bg-gray-900 overflow-hidden">
                    {product.image_url && !product.image_url.includes("placeholder") ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
                        <ShoppingCart className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 고용노동부 지원 뱃지 */}
                    {isMOEL && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          고용노동부
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 뱃지 */}
                    {product.domain && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          {categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 제품 정보 */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <p className="text-2xl font-bold text-white mb-1">
                          {product.market_price
                            ? `${(product.market_price / 10000).toLocaleString()}만원`
                            : "가격 문의"}
                        </p>
                        {product.market_price && (
                          <p className="text-xs text-gray-500">
                            {product.market_price.toLocaleString()}원
                          </p>
                        )}
                      </div>
                      {product.purchase_link && product.purchase_link !== "#" ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
                        >
                          <Link
                            href={product.purchase_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            구매
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-gray-400 hover:text-white rounded-full px-4"
                          disabled
                        >
                          준비중
                        </Button>
                      )}
                    </div>
                    {/* 태그 */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/10">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 보조공학기기를 만나보실 수 있습니다.</p>
          </div>
        )}

        {/* 더보기 버튼 */}
        {hasProducts && (
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            >
              <Link href="/products">
                더 많은 제품 보기
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
