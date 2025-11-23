import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Shield, AlertTriangle } from "lucide-react";

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

// 산재 재활보조기구 카테고리 체계 (중앙보조기기센터 기준)
const WORKPLACE_ACCIDENT_CATEGORIES = {
  all: { name: "전체", domain: null },
  upper_limb: { name: "팔의지", domain: "prosthetics_upper" },
  lower_limb: { name: "다리의지", domain: "prosthetics_lower" },
  arm_orthosis: { name: "팔보조기", domain: "orthosis_arm" },
  spine_orthosis: { name: "척추보조기", domain: "orthosis_spine" },
  leg_orthosis: { name: "다리보조기", domain: "orthosis_leg" },
  mobility: { name: "이동보조기기", domain: "mobility" },
  other: { name: "그 밖의 보조기기", domain: "other" },
} as const;

type CategoryKey = keyof typeof WORKPLACE_ACCIDENT_CATEGORIES;

async function getWorkplaceAccidentProducts(
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
      console.error("Workplace Accident Product fetch error:", error);
      return getMockWorkplaceAccidentProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    // 산재 재활보조기구 필터링 (의지·보조기 관련)
    const workplaceAccidentProducts = activeProducts.filter((p: any) => {
      const domain = p.domain?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = p.tags || [];
      
      return domain.includes("prosthetics") || 
             domain.includes("orthosis") ||
             category.includes("의지") ||
             category.includes("보조기") ||
             tags.some((tag: string) => 
               ["의지", "보조기", "재활보조기구", "산재", "근로복지공단"].includes(tag)
             );
    });

    // 카테고리 필터 적용
    if (categoryFilter !== "all") {
      const targetDomain = WORKPLACE_ACCIDENT_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        return workplaceAccidentProducts
          .filter((p: any) => p.domain?.includes(targetDomain.replace("prosthetics_", "").replace("orthosis_", "").replace("_", "")))
          .slice(0, limit);
      }
    }

    if (workplaceAccidentProducts.length === 0) {
      console.log("No workplace accident products found, using mock data");
      return getMockWorkplaceAccidentProducts(categoryFilter);
    }

    return workplaceAccidentProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching workplace accident products:", error);
    return getMockWorkplaceAccidentProducts(categoryFilter);
  }
}

// 산재 재활보조기구 관련 제품인지 확인
async function isWorkplaceAccidentProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry, program_name")
      .eq("ministry", "고용노동부")
      .like("program_name", "%산재%")
      .limit(1);
    
    if (data && data.length > 0) {
      // 산재 재활보조기구 관련 도메인 또는 태그 확인
      const workplaceAccidentDomains = ["prosthetics_upper", "prosthetics_lower", "orthosis_arm", "orthosis_spine", "orthosis_leg", "mobility"];
      const workplaceAccidentTags = ["의지", "보조기", "재활보조기구", "산재", "근로복지공단"];
      
      return workplaceAccidentDomains.some(d => product.domain?.includes(d)) ||
             workplaceAccidentTags.some(tag => product.tags?.includes(tag));
    }
    return false;
  } catch {
    return false;
  }
}

// Mock 데이터 (중앙보조기기센터 기준)
function getMockWorkplaceAccidentProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 팔의지
    {
      id: 501,
      name: "아래팔 의지-기능형",
      description: "산재로 인한 아래팔 절단자용 기능 의지입니다. 근로복지공단 지원 대상입니다.",
      domain: "prosthetics_upper",
      category: "팔의지",
      market_price: 980000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의지", "팔의지", "산재", "근로복지공단", "고용노동부"],
    },
    {
      id: 502,
      name: "근전전동의수",
      description: "근전도 신호로 제어하는 전동 의수입니다. 산재보험 별도 급여 품목입니다.",
      domain: "prosthetics_upper",
      category: "팔의지",
      market_price: 5500000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의수", "전동", "산재", "근로복지공단", "고용노동부"],
    },
    // 다리의지
    {
      id: 503,
      name: "넓적다리 의지-실리콘형",
      description: "산재로 인한 넓적다리 절단자용 실리콘형 의족입니다.",
      domain: "prosthetics_lower",
      category: "다리의지",
      market_price: 2960000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의족", "다리의지", "산재", "근로복지공단", "고용노동부"],
    },
    {
      id: 504,
      name: "넓적다리 의지(인공지능식)",
      description: "인공지능으로 제어하는 고기능 의족입니다. 산재보험 별도 급여 품목입니다.",
      domain: "prosthetics_lower",
      category: "다리의지",
      market_price: 4576000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의족", "AI", "산재", "근로복지공단", "고용노동부"],
    },
    // 팔보조기
    {
      id: 505,
      name: "팔꿈치-손목-손 보조기",
      description: "팔 기능 보조를 위한 보조기입니다.",
      domain: "orthosis_arm",
      category: "팔보조기",
      market_price: 270000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["보조기", "팔", "산재", "근로복지공단", "고용노동부"],
    },
    // 척추보조기
    {
      id: 506,
      name: "등-허리-엉치 보조기",
      description: "척추 보조를 위한 보조기입니다.",
      domain: "orthosis_spine",
      category: "척추보조기",
      market_price: 460000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["보조기", "척추", "산재", "근로복지공단", "고용노동부"],
    },
    // 다리보조기
    {
      id: 507,
      name: "무릎-발목-발 보조기",
      description: "다리 기능 보조를 위한 보조기입니다.",
      domain: "orthosis_leg",
      category: "다리보조기",
      market_price: 530000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["보조기", "다리", "산재", "근로복지공단", "고용노동부"],
    },
    // 이동보조기기
    {
      id: 508,
      name: "수·전동휠체어-바퀴분리형",
      description: "산재보험 별도 급여 품목인 바퀴분리형 휠체어입니다.",
      domain: "mobility",
      category: "이동보조기기",
      market_price: 3934000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["휠체어", "이동", "산재", "근로복지공단", "고용노동부"],
    },
    {
      id: 509,
      name: "전동휠체어",
      description: "산재근로자용 전동 휠체어입니다.",
      domain: "mobility",
      category: "이동보조기기",
      market_price: 2090000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["휠체어", "전동", "산재", "근로복지공단", "고용노동부"],
    },
    // 그 밖의 보조기기
    {
      id: 510,
      name: "설치형 전동리프트",
      description: "차량용 또는 벽체용 설치형 전동리프트입니다. 산재보험 별도 급여 품목입니다.",
      domain: "other",
      category: "그 밖의 보조기기",
      market_price: 2500000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["리프트", "이동", "산재", "근로복지공단", "고용노동부"],
    },
    {
      id: 511,
      name: "욕창예방매트리스(공기격자형)",
      description: "고무제 공기격자형 욕창예방매트리스입니다. 산재보험 별도 급여 품목입니다.",
      domain: "other",
      category: "그 밖의 보조기기",
      market_price: 1449000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1651326659270-59bbb788199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["욕창예방", "매트리스", "산재", "근로복지공단", "고용노동부"],
    },
  ];

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return allProducts.slice(0, 8);
  }

  const targetDomain = WORKPLACE_ACCIDENT_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return allProducts.slice(0, 8);

  return allProducts
    .filter(p => p.domain === targetDomain)
    .slice(0, 8);
}

// 카테고리 이름 변환
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    prosthetics_upper: "팔의지",
    prosthetics_lower: "다리의지",
    orthosis_arm: "팔보조기",
    orthosis_spine: "척추보조기",
    orthosis_leg: "다리보조기",
    mobility: "이동보조기기",
    other: "그 밖의 보조기기",
  };
  
  return domain ? domainMap[domain] || domain : "재활보조기구";
}

export async function WorkplaceAccidentProductShowcase() {
  const products = await getWorkplaceAccidentProducts(8, "all");
  const hasProducts = products.length > 0;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              고용노동부 산업재해보상보험 재활보조기구 보급사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            산재근로자의 재활 및 사회복귀를 위한 재활보조기구를 지원합니다.
            <span className="text-red-400 font-semibold"> 의지·보조기 112품목</span>, 
            <span className="text-green-400 font-semibold"> 지원율 90~100%</span>
          </p>
          
          {/* 산재근로자 안내 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-w-2xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 font-semibold">
              지원 대상: 산재근로자 (요양 종결시 또는 치료 중 필요시)
            </p>
          </div>

          {/* 지원 정보 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-4xl mx-auto">
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">건강보험대상자</h3>
              <p className="text-sm text-blue-200">
                실구입가의 90% 지원 (급여품목 상한액 범위 내)
              </p>
            </div>
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="text-green-300 font-semibold mb-2">의료급여대상자</h3>
              <p className="text-sm text-green-200">
                실구입가의 100% 지원 (급여품목 상한액 범위 내)
              </p>
            </div>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(WORKPLACE_ACCIDENT_CATEGORIES).map(([key, value]) => (
              <Button
                key={key}
                asChild
                variant={key === "all" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  key === "all"
                    ? "bg-red-600 hover:bg-red-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Link href={`/products?ministry=workplace_accident&category=${key}`}>
                  {value.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isWorkplaceAccident = await isWorkplaceAccidentProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10"
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
                        <Shield className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 산재 지원 뱃지 */}
                    {isWorkplaceAccident && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          산재보험
                        </span>
                      </div>
                    )}
                    
                    {/* 산재보험 별도 급여 뱃지 */}
                    {product.tags?.includes("산재") && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          산재별도급여
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 뱃지 */}
                    {product.domain && !product.tags?.includes("산재") && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          {categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 제품 정보 */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2 min-h-[3rem]">
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
                            {isWorkplaceAccident && (
                              <>
                                <p className="text-blue-400 font-semibold">
                                  지원: 실구입가의 90% (건강보험)
                                </p>
                                <p className="text-green-400 font-semibold">
                                  또는 100% (의료급여)
                                </p>
                                <p className="text-gray-500 text-xs">
                                  산재근로자 대상, 근로복지공단
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
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4"
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
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 재활보조기구를 만나보실 수 있습니다.</p>
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
              <Link href="https://www.comwel.or.kr/" target="_blank" rel="noopener noreferrer">
                더 많은 정보 보기 (근로복지공단)
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

