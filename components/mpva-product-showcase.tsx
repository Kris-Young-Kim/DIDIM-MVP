import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Award, Shield } from "lucide-react";

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

// 보철구 카테고리 체계 (보건복지부 고시 제2023-257호 기준)
const PROSTHETICS_CATEGORIES = {
  all: { name: "전체", domain: null },
  upper_limb: { name: "상지의지", domain: "prosthetics_upper" },
  lower_limb: { name: "하지의지", domain: "prosthetics_lower" },
  orthosis: { name: "보조기", domain: "orthosis" },
  mobility: { name: "이동보조기기", domain: "mobility" },
} as const;

type CategoryKey = keyof typeof PROSTHETICS_CATEGORIES;

async function getMPVAProducts(
  limit: number = 8,
  categoryFilter: CategoryKey = "all"
): Promise<Product[]> {
  try {
    const supabase = getServiceRoleClient();
    
    let query = supabase
      .from("products")
      .select("id, name, description, domain, category, market_price, purchase_link, image_url, tags, is_active")
      .order("created_at", { ascending: false })
      .limit(limit * 2);

    const { data, error } = await query;

    if (error) {
      console.error("MPVA Product fetch error:", error);
      return getMockMPVAProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    // 보철구 관련 제품 필터링 (의지·보조기 관련)
    const prostheticsProducts = activeProducts.filter((p: any) => {
      const domain = p.domain?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = p.tags || [];
      
      return domain.includes("prosthetics") || 
             domain.includes("orthosis") ||
             category.includes("의지") ||
             category.includes("보조기") ||
             tags.some((tag: string) => 
               ["의지", "보조기", "보철구", "상지", "하지", "의족", "의수", "국가보훈부"].includes(tag)
             );
    });

    // 카테고리 필터 적용
    if (categoryFilter !== "all") {
      const targetDomain = PROSTHETICS_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        return prostheticsProducts
          .filter((p: any) => p.domain?.includes(targetDomain.replace("prosthetics_", "").replace("_", "")))
          .slice(0, limit);
      }
    }

    if (prostheticsProducts.length === 0) {
      console.log("No MPVA products found, using mock data");
      return getMockMPVAProducts(categoryFilter);
    }

    return prostheticsProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching MPVA products:", error);
    return getMockMPVAProducts(categoryFilter);
  }
}

// 국가보훈부 사업 관련 제품인지 확인
async function isMPVAProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry")
      .eq("ministry", "국가보훈부")
      .limit(1);
    
    if (data && data.length > 0) {
      // 보철구 관련 도메인 또는 태그 확인
      const mpvaDomains = ["prosthetics_upper", "prosthetics_lower", "orthosis", "mobility"];
      const mpvaTags = ["의지", "보조기", "보철구", "상지", "하지", "의족", "의수", "국가보훈부"];
      
      return mpvaDomains.some(d => product.domain?.includes(d)) ||
             mpvaTags.some(tag => product.tags?.includes(tag));
    }
    return false;
  } catch {
    return false;
  }
}

// Mock 데이터 (보철구 지급 실적 및 지급계획 기준)
function getMockMPVAProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 상지의지
    {
      id: 201,
      name: "전동 의수",
      description: "상지 절단자용 전동 의수입니다. 국가보훈부 전액 지원 대상입니다.",
      domain: "prosthetics_upper",
      category: "상지의지",
      market_price: 3500000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의수", "상지의지", "전동", "국가보훈부", "전액지원"],
    },
    {
      id: 202,
      name: "미용 의수",
      description: "상지 절단자용 미용 의수입니다. 외관이 자연스러워 일상생활에 적합합니다.",
      domain: "prosthetics_upper",
      category: "상지의지",
      market_price: 1200000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의수", "상지의지", "미용", "국가보훈부", "전액지원"],
    },
    {
      id: 203,
      name: "기능 의수",
      description: "상지 절단자용 기능 의수입니다. 다양한 작업을 수행할 수 있습니다.",
      domain: "prosthetics_upper",
      category: "상지의지",
      market_price: 2800000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의수", "상지의지", "기능", "국가보훈부", "전액지원"],
    },
    // 하지의지
    {
      id: 204,
      name: "전동 의족",
      description: "하지 절단자용 전동 의족입니다. 보행 능력을 향상시킵니다.",
      domain: "prosthetics_lower",
      category: "하지의지",
      market_price: 8500000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의족", "하지의지", "전동", "국가보훈부", "전액지원"],
    },
    {
      id: 205,
      name: "기능 의족",
      description: "하지 절단자용 기능 의족입니다. 일상 보행에 적합합니다.",
      domain: "prosthetics_lower",
      category: "하지의지",
      market_price: 4500000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의족", "하지의지", "기능", "국가보훈부", "전액지원"],
    },
    {
      id: 206,
      name: "스포츠 의족",
      description: "하지 절단자용 스포츠 의족입니다. 운동 및 활동에 특화되었습니다.",
      domain: "prosthetics_lower",
      category: "하지의지",
      market_price: 3200000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["의족", "하지의지", "스포츠", "국가보훈부", "전액지원"],
    },
    // 보조기
    {
      id: 207,
      name: "상지 보조기",
      description: "상지 기능 보조를 위한 보조기입니다. 일상생활 활동을 돕습니다.",
      domain: "orthosis",
      category: "상지보조기",
      market_price: 850000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["보조기", "상지", "국가보훈부", "전액지원"],
    },
    {
      id: 208,
      name: "하지 보조기",
      description: "하지 기능 보조를 위한 보조기입니다. 보행 능력을 향상시킵니다.",
      domain: "orthosis",
      category: "하지보조기",
      market_price: 1200000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["보조기", "하지", "국가보훈부", "전액지원"],
    },
    // 이동보조기기
    {
      id: 209,
      name: "휠체어 (보훈대상자용)",
      description: "국가보훈부 지원 대상자용 휠체어입니다. 전액 지원 대상입니다.",
      domain: "mobility",
      category: "휠체어",
      market_price: 2500000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["휠체어", "이동보조", "국가보훈부", "전액지원"],
    },
    {
      id: 210,
      name: "보행 보조기",
      description: "보행 보조를 위한 보조기입니다. 균형 유지와 보행 능력 향상을 돕습니다.",
      domain: "mobility",
      category: "보행보조기",
      market_price: 650000,
      purchase_link: "https://www.mpva.go.kr/",
      image_url: null,
      tags: ["보행보조", "이동보조", "국가보훈부", "전액지원"],
    },
  ];

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return allProducts.slice(0, 8);
  }

  const targetDomain = PROSTHETICS_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return allProducts.slice(0, 8);

  return allProducts
    .filter(p => p.domain === targetDomain)
    .slice(0, 8);
}

// 카테고리 이름 변환
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    prosthetics_upper: "상지의지",
    prosthetics_lower: "하지의지",
    orthosis: "보조기",
    mobility: "이동보조기기",
  };
  
  return domain ? domainMap[domain] || domain : "보철구";
}

export async function MPVAProductShowcase() {
  const products = await getMPVAProducts(8, "all");
  const hasProducts = products.length > 0;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              국가보훈부 보철구 지원사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            국가유공자 및 그 유족을 위한 보철구를 지원합니다.
            <span className="text-indigo-400 font-semibold"> 품목별 지원 기준액 내 전액 지원</span>, 
            <span className="text-green-400 font-semibold"> 자부담 0%</span>
          </p>
          
          {/* 국가유공자 안내 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-lg max-w-2xl mx-auto">
            <Shield className="w-5 h-5 text-indigo-400" />
            <p className="text-indigo-300 font-semibold text-sm">
              지원 대상: 국가유공자 (전상군경, 공상군경, 4·19혁명부상자, 공상공무원, 6·18자유상이자, 재해부상군경, 특수임무부상자, 애국지사, 5·18민주화운동부상자, 고엽제후유의증환자, 전상/공상 제대군인 등)
            </p>
          </div>
          
          {/* 품목 수 안내 */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              총 51개 품목 지원 (의지·보조기, 이동보조기기, 의사소통보조기기, 정보통신보조기기 등)
            </p>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(PROSTHETICS_CATEGORIES).map(([key, value]) => (
              <Button
                key={key}
                asChild
                variant={key === "all" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  key === "all"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Link href={`/products?ministry=mpva&category=${key}`}>
                  {value.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isMPVA = await isMPVAProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
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
                        <Award className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 국가보훈부 지원 뱃지 */}
                    {isMPVA && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          국가보훈부
                        </span>
                      </div>
                    )}
                    
                    {/* 전액지원 뱃지 */}
                    {isMPVA && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          전액지원
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 뱃지 */}
                    {product.domain && !isMPVA && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          {categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 제품 정보 */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3rem]">
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
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <p>{product.market_price.toLocaleString()}원</p>
                            {isMPVA && (
                              <>
                                <p className="text-green-400 font-semibold">
                                  지원: 품목별 지원 기준액 내 전액 지원 (100%)
                                </p>
                                <p className="text-gray-500 text-xs">
                                  자부담: 0원 (0%), 국가유공자 대상
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {product.purchase_link && product.purchase_link !== "#" ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4"
                        >
                          <Link
                            href={product.purchase_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            신청
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
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 보철구를 만나보실 수 있습니다.</p>
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
              <Link href="https://www.mpva.go.kr/" target="_blank" rel="noopener noreferrer">
                더 많은 정보 보기 (국가보훈부)
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

