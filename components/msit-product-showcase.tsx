import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Smartphone, Calendar, AlertCircle } from "lucide-react";

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

// 정보통신보조기기 카테고리 체계 (at4u.or.kr 기준)
const ICT_ASSISTIVE_CATEGORIES = {
  all: { name: "전체", domain: null, disabilityType: null },
  visual: { name: "시각장애", domain: "ict_visual", disabilityType: "visual" },
  hearing: { name: "청각·언어장애", domain: "ict_hearing", disabilityType: "hearing" },
  physical: { name: "지체·뇌병변", domain: "ict_physical", disabilityType: "physical" },
} as const;

type CategoryKey = keyof typeof ICT_ASSISTIVE_CATEGORIES;

// 시즌성 체크 (5~6월)
function isInSeason(): boolean {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  return currentMonth >= 5 && currentMonth <= 6;
}

async function getMSITProducts(
  limit: number = 8,
  categoryFilter: CategoryKey = "all"
): Promise<Product[]> {
  try {
    const supabase = getServiceRoleClient();
    
    let query = supabase
      .from("products")
      .select("id, name, description, domain, category, market_price, purchase_link, image_url, tags, is_active")
      .order("created_at", { ascending: false })
      .limit(limit * 2); // 필터링 후 충분한 수 확보

    const { data, error } = await query;

    if (error) {
      console.error("MSIT Product fetch error:", error);
      return getMockMSITProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    // 정보통신보조기기 필터링 (domain이 ict_로 시작하거나 communication, sensory 관련)
    const ictProducts = activeProducts.filter((p: any) => {
      const domain = p.domain?.toLowerCase() || "";
      return domain.includes("ict") || 
             domain.includes("communication") || 
             domain.includes("sensory") ||
             p.tags?.some((tag: string) => 
               ["화면독서기", "확대기", "점자", "음성인식", "스크린리더", "TTS", "OCR"].includes(tag)
             );
    });

    // 카테고리 필터 적용
    if (categoryFilter !== "all") {
      const targetDomain = ICT_ASSISTIVE_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        return ictProducts
          .filter((p: any) => p.domain?.includes(targetDomain.replace("ict_", "")))
          .slice(0, limit);
      }
    }

    if (ictProducts.length === 0) {
      console.log("No MSIT products found, using mock data");
      return getMockMSITProducts(categoryFilter);
    }

    return ictProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching MSIT products:", error);
    return getMockMSITProducts(categoryFilter);
  }
}

// 과학기술정보통신부 사업 관련 제품인지 확인
async function isMSITProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry")
      .eq("ministry", "과학기술정보통신부")
      .limit(1);
    
    if (data && data.length > 0) {
      // 정보통신보조기기 관련 도메인 또는 태그 확인
      const ictDomains = ["ict_visual", "ict_hearing", "ict_physical", "communication", "sensory"];
      const ictTags = ["화면독서기", "확대기", "점자", "음성인식", "스크린리더", "TTS", "OCR", "정보통신"];
      
      return ictDomains.some(d => product.domain?.includes(d)) ||
             ictTags.some(tag => product.tags?.includes(tag));
    }
    return false;
  } catch {
    return false;
  }
}

// Mock 데이터 (at4u.or.kr 스타일)
function getMockMSITProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 시각장애용 정보통신보조기기
    {
      id: 101,
      name: "한소네6",
      description: "화면에 있는 글자나 이미지를 음성으로 읽어주는 화면독서기입니다.",
      domain: "ict_visual",
      category: "화면독서기",
      market_price: 1200000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "화면독서기", "스크린리더", "음성출력", "과학기술정보통신부"],
    },
    {
      id: 102,
      name: "24인치 화면확대터치모니터",
      description: "컴퓨터 화면을 원하는 크기로 확대해주는 터치 모니터입니다.",
      domain: "ict_visual",
      category: "화면확대모니터",
      market_price: 900000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "확대기", "모니터", "터치", "과학기술정보통신부"],
    },
    {
      id: 103,
      name: "강한손 티티",
      description: "입력한 텍스트를 음성으로 변환하여 읽어주는 TTS 장치입니다.",
      domain: "ict_visual",
      category: "텍스트음성변환장치",
      market_price: 594000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "TTS", "음성출력", "과학기술정보통신부"],
    },
    {
      id: 104,
      name: "큐브레일",
      description: "점자로 놀이와 수학 훈련을 할 수 있는 점자 학습 보조기기입니다.",
      domain: "ict_visual",
      category: "점자학습기기",
      market_price: 850000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "점자", "학습", "과학기술정보통신부"],
    },
    {
      id: 105,
      name: "강한손 확대 터치모니터 32인치",
      description: "대형 화면으로 확대하여 저시력인의 컴퓨터 사용을 돕는 모니터입니다.",
      domain: "ict_visual",
      category: "화면확대모니터",
      market_price: 1500000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "확대", "모니터", "저시력", "과학기술정보통신부"],
    },
    {
      id: 106,
      name: "화면확대 소프트웨어",
      description: "컴퓨터 화면을 원하는 크기로 확대해주는 소프트웨어입니다.",
      domain: "ict_visual",
      category: "화면확대소프트웨어",
      market_price: 350000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["시각장애", "확대", "소프트웨어", "과학기술정보통신부"],
    },
    // 청각·언어장애용 정보통신보조기기
    {
      id: 107,
      name: "음성인식 소프트웨어",
      description: "음성으로 컴퓨터를 제어하고 텍스트를 입력할 수 있는 소프트웨어입니다.",
      domain: "ict_hearing",
      category: "음성인식소프트웨어",
      market_price: 450000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["청각장애", "음성인식", "소프트웨어", "과학기술정보통신부"],
    },
    {
      id: 108,
      name: "보청기용 음향중계시스템",
      description: "보청기와 연동하여 음향을 중계해주는 시스템입니다.",
      domain: "ict_hearing",
      category: "음향중계시스템",
      market_price: 280000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["청각장애", "보청기", "음향중계", "과학기술정보통신부"],
    },
    // 지체·뇌병변용 정보통신보조기기
    {
      id: 109,
      name: "안구 추적 마우스",
      description: "눈동자 움직임으로 컴퓨터를 제어할 수 있는 안구 추적 장치입니다.",
      domain: "ict_physical",
      category: "안구추적장치",
      market_price: 3500000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["지체장애", "안구추적", "마우스", "과학기술정보통신부"],
    },
    {
      id: 110,
      name: "음성 제어 소프트웨어",
      description: "음성 명령으로 컴퓨터를 제어할 수 있는 소프트웨어입니다.",
      domain: "ict_physical",
      category: "음성제어소프트웨어",
      market_price: 320000,
      purchase_link: "https://www.at4u.or.kr/",
      image_url: null,
      tags: ["지체장애", "음성제어", "소프트웨어", "과학기술정보통신부"],
    },
  ];

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return allProducts.slice(0, 8);
  }

  const targetDomain = ICT_ASSISTIVE_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return allProducts.slice(0, 8);

  return allProducts
    .filter(p => p.domain === targetDomain)
    .slice(0, 8);
}

// 카테고리 이름 변환
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    ict_visual: "시각장애용",
    ict_hearing: "청각·언어장애용",
    ict_physical: "지체·뇌병변용",
    communication: "의사소통보조기기",
    sensory: "감각보조기기",
  };
  
  return domain ? domainMap[domain] || domain : "정보통신보조기기";
}

export async function MSITProductShowcase() {
  const products = await getMSITProducts(8, "all");
  const hasProducts = products.length > 0;
  const inSeason = isInSeason();

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              과학기술정보통신부 정보통신보조기기 보급사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            정보 접근성이 어려운 분들을 위한 정보통신보조기기를 지원합니다.
            <span className="text-purple-400 font-semibold"> 매년 5~6월 신청</span>, 
            <span className="text-green-400 font-semibold"> 지원율 80% (저소득 90%)</span>
          </p>
          
          {/* 지원 정보 */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-4xl mx-auto">
            <div className="p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
              <h3 className="text-purple-300 font-semibold mb-2">일반 장애인</h3>
              <p className="text-sm text-purple-200">
                제품 가격의 80% 지원 (본인부담 20%)
              </p>
            </div>
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="text-green-300 font-semibold mb-2">저소득 장애인</h3>
              <p className="text-sm text-green-200">
                150만원 이하: 90% 지원<br/>
                150만원 초과: 90만원 + ((가격-100만원)×95%)
              </p>
            </div>
          </div>
          
          {/* 지원 대상 안내 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg max-w-2xl mx-auto">
            <Smartphone className="w-5 h-5 text-purple-400" />
            <p className="text-purple-300 font-semibold text-sm">
              지원 대상: 등록 장애인, 국가유공자 (1-7급 상이등급)
            </p>
          </div>
          
          {/* 품목 수 안내 */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              등록 제품: 시각 66개, 지체/뇌병변 22개, 청각/언어 37개
            </p>
          </div>
          
          {/* 시즌성 알림 */}
          {inSeason ? (
            <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg max-w-2xl mx-auto">
              <Calendar className="w-5 h-5 text-purple-400" />
              <p className="text-purple-300 font-semibold">
                현재 신청 가능 기간입니다! (5~6월)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-300 font-semibold">
                신청 기간: 매년 5~6월 (사전 예약 알림 신청 가능)
              </p>
            </div>
          )}

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(ICT_ASSISTIVE_CATEGORIES).map(([key, value]) => (
              <Button
                key={key}
                asChild
                variant={key === "all" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  key === "all"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Link href={`/products?ministry=msit&category=${key}`}>
                  {value.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isMSIT = await isMSITProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
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
                        <Smartphone className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 과학기술정보통신부 지원 뱃지 */}
                    {isMSIT && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          과기정통부
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
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-2 min-h-[3rem]">
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
                            {isMSIT && (
                              <>
                                <p className="text-purple-400 font-semibold">
                                  지원: 제품 가격의 80% (일반)
                                </p>
                                <p className="text-green-400 font-semibold text-xs">
                                  또는 90% (저소득, 150만원 이하)
                                </p>
                                <p className="text-gray-500 text-xs">
                                  5-6월 신청 기간, 등록 장애인/국가유공자
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
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4"
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
            <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 정보통신보조기기를 만나보실 수 있습니다.</p>
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
              <Link href="https://www.at4u.or.kr/" target="_blank" rel="noopener noreferrer">
                더 많은 제품 보기 (at4u.or.kr)
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

