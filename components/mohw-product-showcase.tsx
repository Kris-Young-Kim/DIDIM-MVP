import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Heart, Users } from "lucide-react";

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

// 보건복지부 보조기기 카테고리 체계 (보건복지부 고시 제2023-257호 기준)
const MOHW_ASSISTIVE_CATEGORIES = {
  all: { name: "전체", domain: null },
  life: { name: "생명활동 보조기기", domain: "life_support" },
  therapy: { name: "치료 운동 보조기기", domain: "therapy" },
  prosthetics: { name: "의지 및 보조기", domain: "prosthetics" },
  mobility: { name: "이동 보조기기", domain: "mobility" },
  communication: { name: "의사소통 보조기기", domain: "communication" },
  personal_care: { name: "개인보호 보조기기", domain: "personal_care" },
  furniture: { name: "가구 및 적응 보조기기", domain: "furniture" },
  leisure: { name: "취미 및 레저 보조기기", domain: "leisure" },
} as const;

type CategoryKey = keyof typeof MOHW_ASSISTIVE_CATEGORIES;

async function getMOHWProducts(
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
      console.error("MOHW Product fetch error:", error);
      return getMockMOHWProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    // 보건복지부 보조기기 필터링 (가장 보편적이므로 대부분의 제품 포함)
    const mohwProducts = activeProducts.filter((p: any) => {
      // 보건복지부는 가장 보편적인 사업이므로 특별한 필터링 없이 대부분 포함
      // 단, 다른 부처 전용 제품은 제외
      const tags = p.tags || [];
      const excludeTags = ["고용노동부", "과기정통부", "국가보훈부", "교육부"];
      return !excludeTags.some(tag => tags.includes(tag));
    });

    // 카테고리 필터 적용
    if (categoryFilter !== "all") {
      const targetDomain = MOHW_ASSISTIVE_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        return mohwProducts
          .filter((p: any) => {
            const domain = p.domain?.toLowerCase() || "";
            return domain.includes(targetDomain.replace("_", "")) ||
                   p.category?.toLowerCase().includes(targetDomain.replace("_", ""));
          })
          .slice(0, limit);
      }
    }

    if (mohwProducts.length === 0) {
      console.log("No MOHW products found, using mock data");
      return getMockMOHWProducts(categoryFilter);
    }

    // 수요가 많은 제품 우선순위 정렬 (휠체어, 보청기, 욕창예방 방석, 목욕의자 순)
    const priorityKeywords = ["휠체어", "보청기", "욕창예방", "방석", "욕의자", "목욕", "화면독서", "보행"];
    const sortedProducts = [...mohwProducts].sort((a: any, b: any) => {
      const aScore = getMOHWProductPriorityScore(a, priorityKeywords);
      const bScore = getMOHWProductPriorityScore(b, priorityKeywords);
      return bScore - aScore;
    });

    return sortedProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching MOHW products:", error);
    return getMockMOHWProducts(categoryFilter);
  }
}

// 보건복지부 사업 관련 제품인지 확인
async function isMOHWProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry")
      .eq("ministry", "보건복지부")
      .limit(1);
    
    if (data && data.length > 0) {
      // 보건복지부는 가장 보편적이므로 대부분의 제품 포함
      const tags = product.tags || [];
      const excludeTags = ["고용노동부", "과기정통부", "국가보훈부", "교육부"];
      return !excludeTags.some(tag => tags.includes(tag));
    }
    return false;
  } catch {
    return false;
  }
}

// MOHW 제품 우선순위 점수 계산
function getMOHWProductPriorityScore(product: any, priorityKeywords: string[]): number {
  let score = 0;
  const name = (product.name || "").toLowerCase();
  const description = (product.description || "").toLowerCase();
  const tags = (product.tags || []).join(" ").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const allText = `${name} ${description} ${tags} ${category}`;
  
  priorityKeywords.forEach((keyword, index) => {
    if (allText.includes(keyword.toLowerCase())) {
      score += (priorityKeywords.length - index) * 10;
    }
  });
  
  if (allText.includes("휠체어")) score += 100;
  if (allText.includes("보청기")) score += 80;
  if (allText.includes("욕창예방") || allText.includes("방석")) score += 60;
  if (allText.includes("욕의자") || allText.includes("목욕")) score += 50;
  
  return score;
}

// Mock 데이터 (보건복지부 고시 제2023-257호 기준)
function getMockMOHWProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 생명활동 보조기기
    {
      id: 401,
      name: "산소 공급장치",
      description: "호흡 곤란 시 산소를 공급하는 장치입니다. 보건복지부 지원 대상입니다.",
      domain: "life_support",
      category: "생명활동 보조기기",
      market_price: 850000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["호흡", "산소", "생명활동", "보건복지부"],
    },
    {
      id: 402,
      name: "흡인기",
      description: "폐의 분비물을 빨아들이는 장치입니다. 호흡 보조에 필수적입니다.",
      domain: "life_support",
      category: "생명활동 보조기기",
      market_price: 450000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["호흡", "흡인", "생명활동", "보건복지부"],
    },
    // 치료 운동 보조기기
    {
      id: 403,
      name: "재활 운동 기구",
      description: "신체 기능 회복을 위한 재활 운동 기구입니다.",
      domain: "therapy",
      category: "치료 운동 보조기기",
      market_price: 320000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["재활", "운동", "치료", "보건복지부"],
    },
    // 의지 및 보조기
    {
      id: 404,
      name: "상지 보조기",
      description: "상지 기능 보조를 위한 보조기입니다. 의지·보조기 기사 제조 필요.",
      domain: "prosthetics",
      category: "의지 및 보조기",
      market_price: 650000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의지", "보조기", "상지", "보건복지부"],
    },
    {
      id: 405,
      name: "하지 보조기",
      description: "하지 기능 보조를 위한 보조기입니다. 의지·보조기 기사 제조 필요.",
      domain: "prosthetics",
      category: "의지 및 보조기",
      market_price: 850000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["의지", "보조기", "하지", "보건복지부"],
    },
    // 이동 보조기기
    {
      id: 406,
      name: "수동 휠체어",
      description: "일상생활 이동을 위한 수동 휠체어입니다. 가장 보편적인 보조기기입니다.",
      domain: "mobility",
      category: "이동 보조기기",
      market_price: 850000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["휠체어", "이동", "보건복지부"],
    },
    {
      id: 407,
      name: "보행 보조차",
      description: "보행이 불편한 분들을 위한 보행 보조차입니다.",
      domain: "mobility",
      category: "이동 보조기기",
      market_price: 180000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["보행", "이동", "보건복지부"],
    },
    {
      id: 408,
      name: "지팡이",
      description: "보행 보조를 위한 지팡이입니다.",
      domain: "mobility",
      category: "이동 보조기기",
      market_price: 45000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["지팡이", "보행", "보건복지부"],
    },
    // 의사소통 보조기기
    {
      id: 409,
      name: "보청기",
      description: "청각 장애인을 위한 보청기입니다.",
      domain: "communication",
      category: "의사소통 보조기기",
      market_price: 1500000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["보청기", "청각", "의사소통", "보건복지부"],
    },
    {
      id: 410,
      name: "화면 독서기",
      description: "컴퓨터 화면의 내용을 음성으로 읽어주는 장치입니다.",
      domain: "communication",
      category: "의사소통 보조기기",
      market_price: 385000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["화면독서", "시각", "의사소통", "보건복지부"],
    },
    // 개인보호 보조기기
    {
      id: 411,
      name: "욕창예방 방석",
      description: "장시간 앉아있을 때 욕창을 예방하는 방석입니다.",
      domain: "personal_care",
      category: "개인보호 보조기기",
      market_price: 250000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["욕창예방", "방석", "개인보호", "보건복지부"],
    },
    // 가구 및 적응 보조기기
    {
      id: 412,
      name: "욕실 안전 손잡이",
      description: "욕실에서 낙상을 예방하는 안전 손잡이입니다.",
      domain: "furniture",
      category: "가구 및 적응 보조기기",
      market_price: 85000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["안전", "욕실", "가구", "보건복지부"],
    },
    {
      id: 413,
      name: "욕의자",
      description: "욕실에서 안전하게 목욕할 수 있도록 돕는 의자입니다.",
      domain: "furniture",
      category: "가구 및 적응 보조기기",
      market_price: 180000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["욕실", "의자", "가구", "보건복지부"],
    },
    // 노인장기요양 복지용구
    {
      id: 414,
      name: "침대 난간",
      description: "침대에서 낙상을 예방하는 난간입니다. 노인장기요양 복지용구 지원 대상입니다.",
      domain: "furniture",
      category: "가구 및 적응 보조기기",
      market_price: 120000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["침대", "안전", "노인", "보건복지부", "복지용구"],
    },
    {
      id: 415,
      name: "이동용 리프트",
      description: "침대에서 휠체어로 이동할 때 사용하는 리프트입니다. 노인장기요양 복지용구 지원 대상입니다.",
      domain: "mobility",
      category: "이동 보조기기",
      market_price: 1800000,
      purchase_link: "#",
      image_url: "https://images.unsplash.com/photo-1633466153506-a396b670565b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      tags: ["리프트", "이동", "노인", "보건복지부", "복지용구"],
    },
  ];

  // 수요가 많은 제품 우선순위 (휠체어, 보청기, 욕창예방 방석, 목욕의자 순)
  const priorityProducts = [
    "수동 휠체어",
    "보청기",
    "욕창예방 방석",
    "욕의자",
    "화면 독서기",
    "보행 보조차",
    "욕실 안전 손잡이",
    "침대 난간",
  ];

  // 우선순위에 따라 정렬
  const sortedProducts = [...allProducts].sort((a, b) => {
    const aIndex = priorityProducts.indexOf(a.name);
    const bIndex = priorityProducts.indexOf(b.name);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return sortedProducts.slice(0, 8);
  }

  const targetDomain = MOHW_ASSISTIVE_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return sortedProducts.slice(0, 8);

  return sortedProducts
    .filter(p => p.domain === targetDomain)
    .slice(0, 8);
}

// 카테고리 이름 변환
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    life_support: "생명활동 보조기기",
    therapy: "치료 운동 보조기기",
    prosthetics: "의지 및 보조기",
    mobility: "이동 보조기기",
    communication: "의사소통 보조기기",
    personal_care: "개인보호 보조기기",
    furniture: "가구 및 적응 보조기기",
    leisure: "취미 및 레저 보조기기",
  };
  
  return domain ? domainMap[domain] || domain : "보조기기";
}

export async function MOHWProductShowcase() {
  const products = await getMOHWProducts(8, "all");
  const hasProducts = products.length > 0;

  return (
    <section id="mohw" className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-teal-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              보건복지부 보조기기 지원사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            등록 장애인과 노인을 위한 보조기기를 지원합니다. 가장 보편적인 지원사업입니다.
          </p>
          
          {/* 세 가지 사업 안내 */}
          <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-6xl mx-auto">
            <div className="p-4 bg-teal-500/20 border border-teal-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h3 className="text-teal-300 font-semibold text-sm">장애인 보조기기 교부/급여</h3>
              </div>
              <p className="text-xs text-teal-200">
                건강보험: 지급기준금액의 90% (차상위 100%)<br/>
                의료급여: 지급기준금액의 100%<br/>
                9개 분류 90개 품목
              </p>
            </div>
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-blue-300 font-semibold text-sm">장애인보조기기 교부사업</h3>
              </div>
              <p className="text-xs text-blue-200">
                저소득 장애인 대상, 연 200만원 한도, 최대 3품목, 자부담 0%
              </p>
            </div>
            <div className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-orange-400" />
                <h3 className="text-orange-300 font-semibold text-sm">노인장기요양 복지용구</h3>
              </div>
              <p className="text-xs text-orange-200">
                65세 이상 (또는 노인성 질병), 장기요양등급 1~5급<br/>
                연 160만원 한도, 자부담 15% (기초수급 0%)<br/>
                구입 10개, 대여 6개, 구입/대여 2개 품목
              </p>
            </div>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(MOHW_ASSISTIVE_CATEGORIES).map(([key, value]) => (
              <Button
                key={key}
                asChild
                variant={key === "all" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  key === "all"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Link href={`/products?ministry=mohw&category=${key}`}>
                  {value.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isMOHW = await isMOHWProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              const isWelfareTool = product.tags?.includes("복지용구");
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10"
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
                        <Heart className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 보건복지부 지원 뱃지 */}
                    {isMOHW && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-teal-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          보건복지부
                        </span>
                      </div>
                    )}
                    
                    {/* 복지용구 뱃지 */}
                    {isWelfareTool && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          복지용구
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 뱃지 */}
                    {product.domain && !isWelfareTool && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          {categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 제품 정보 */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-teal-400 transition-colors line-clamp-2 min-h-[3rem]">
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
                            {isMOHW && (
                              <>
                                {isWelfareTool ? (
                                  <>
                                    <p className="text-orange-400 font-semibold">
                                      지원: 연 160만원 한도 (자부담 15%)
                                    </p>
                                    <p className="text-green-400 font-semibold text-xs">
                                      또는 6~9% (감경대상), 0% (기초수급)
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      65세 이상 (또는 노인성 질병), 장기요양등급 1~5급<br/>
                                      구입 10개, 대여 6개, 구입/대여 2개 품목
                                    </p>
                                  </>
                                ) : product.tags?.includes("저소득") ? (
                                  <>
                                    <p className="text-blue-400 font-semibold">
                                      지원: 연 200만원 한도, 최대 3품목 (자부담 0%)
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      저소득 장애인 대상 (수급자, 차상위)
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-teal-400 font-semibold">
                                      지원: 지급기준금액의 90% (건강보험)
                                    </p>
                                    <p className="text-green-400 font-semibold text-xs">
                                      또는 100% (차상위, 의료급여)
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      등록 장애인 대상, 9개 분류 90개 품목
                                    </p>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {product.purchase_link && product.purchase_link !== "#" ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4"
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
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 보조기기를 만나보실 수 있습니다.</p>
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
              <Link href="https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do" target="_blank" rel="noopener noreferrer">
                더 많은 정보 보기 (복지로)
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

