import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, GraduationCap, BookOpen } from "lucide-react";

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

// 교육용 보조공학기기 카테고리 체계 (장애학생 교육용 보조공학 기준)
const EDUCATION_ASSISTIVE_CATEGORIES = {
  all: { name: "전체", domain: null },
  learning: { name: "학습보조기기", domain: "education_learning" },
  communication: { name: "의사소통보조기기", domain: "education_communication" },
  mobility: { name: "이동보조기기", domain: "education_mobility" },
  sensory: { name: "감각보조기기", domain: "education_sensory" },
  computer: { name: "컴퓨터접근기기", domain: "education_computer" },
} as const;

type CategoryKey = keyof typeof EDUCATION_ASSISTIVE_CATEGORIES;

async function getMOEProducts(
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
      console.error("MOE Product fetch error:", error);
      return getMockMOEProducts(categoryFilter);
    }

    const activeProducts = (data || []).filter((p: any) => p.is_active !== false);
    
    // 교육용 보조공학기기 필터링
    const educationProducts = activeProducts.filter((p: any) => {
      const domain = p.domain?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = p.tags || [];
      
      return domain.includes("education") || 
             domain.includes("learning") ||
             domain.includes("communication") ||
             domain.includes("sensory") ||
             category.includes("학습") ||
             category.includes("교육") ||
             tags.some((tag: string) => 
               ["학습", "교육", "학교", "학생", "교육부", "특수교육", "의사소통", "컴퓨터접근"].includes(tag)
             );
    });

    // 카테고리 필터 적용
    if (categoryFilter !== "all") {
      const targetDomain = EDUCATION_ASSISTIVE_CATEGORIES[categoryFilter].domain;
      if (targetDomain) {
        return educationProducts
          .filter((p: any) => p.domain?.includes(targetDomain.replace("education_", "")))
          .slice(0, limit);
      }
    }

    if (educationProducts.length === 0) {
      console.log("No MOE products found, using mock data");
      return getMockMOEProducts(categoryFilter);
    }

    return educationProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching MOE products:", error);
    return getMockMOEProducts(categoryFilter);
  }
}

// 교육부 사업 관련 제품인지 확인
async function isMOEProduct(product: Product): Promise<boolean> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from("welfare_programs")
      .select("id, ministry")
      .eq("ministry", "교육부")
      .limit(1);
    
    if (data && data.length > 0) {
      // 교육용 보조공학기기 관련 도메인 또는 태그 확인
      const moeDomains = ["education_learning", "education_communication", "education_mobility", "education_sensory", "education_computer"];
      const moeTags = ["학습", "교육", "학교", "학생", "교육부", "특수교육", "의사소통", "컴퓨터접근"];
      
      return moeDomains.some(d => product.domain?.includes(d)) ||
             moeTags.some(tag => product.tags?.includes(tag));
    }
    return false;
  } catch {
    return false;
  }
}

// Mock 데이터 (장애학생 교육용 보조공학 기준)
function getMockMOEProducts(categoryFilter: CategoryKey = "all"): Product[] {
  const allProducts: Product[] = [
    // 학습보조기기
    {
      id: 301,
      name: "전자 확대 독서기",
      description: "교과서와 학습 자료를 확대하여 보여주는 전자 확대 독서기입니다. 저시력 학생의 학습을 돕습니다.",
      domain: "education_learning",
      category: "학습보조기기",
      market_price: 450000,
      purchase_link: "#",
      image_url: null,
      tags: ["학습", "확대", "독서", "저시력", "교육부", "특수교육"],
    },
    {
      id: 302,
      name: "음성 출력 계산기",
      description: "계산 과정과 결과를 음성으로 읽어주는 계산기입니다. 시각장애 학생의 수학 학습을 돕습니다.",
      domain: "education_learning",
      category: "학습보조기기",
      market_price: 180000,
      purchase_link: "#",
      image_url: null,
      tags: ["학습", "수학", "음성출력", "시각장애", "교육부", "특수교육"],
    },
    {
      id: 303,
      name: "점자 학습기",
      description: "점자를 배우고 연습할 수 있는 학습기입니다. 시각장애 학생의 점자 학습을 돕습니다.",
      domain: "education_learning",
      category: "학습보조기기",
      market_price: 320000,
      purchase_link: "#",
      image_url: null,
      tags: ["학습", "점자", "시각장애", "교육부", "특수교육"],
    },
    // 의사소통보조기기
    {
      id: 304,
      name: "AAC 의사소통기기",
      description: "그림이나 문자를 선택하여 음성으로 의사를 표현할 수 있는 의사소통기기입니다. 언어장애 학생의 의사소통을 돕습니다.",
      domain: "education_communication",
      category: "의사소통보조기기",
      market_price: 1200000,
      purchase_link: "#",
      image_url: null,
      tags: ["의사소통", "AAC", "언어장애", "교육부", "특수교육"],
    },
    {
      id: 305,
      name: "그림 의사소통판",
      description: "자주 쓰는 단어와 그림이 인쇄된 의사소통판입니다. 간단한 의사소통에 적합합니다.",
      domain: "education_communication",
      category: "의사소통보조기기",
      market_price: 35000,
      purchase_link: "#",
      image_url: null,
      tags: ["의사소통", "그림", "언어장애", "교육부", "특수교육"],
    },
    // 컴퓨터접근기기
    {
      id: 306,
      name: "화면 확대 소프트웨어",
      description: "컴퓨터 화면을 확대하여 보여주는 소프트웨어입니다. 저시력 학생의 컴퓨터 학습을 돕습니다.",
      domain: "education_computer",
      category: "컴퓨터접근기기",
      market_price: 350000,
      purchase_link: "#",
      image_url: null,
      tags: ["컴퓨터", "확대", "소프트웨어", "저시력", "교육부", "특수교육"],
    },
    {
      id: 307,
      name: "화면 독서 소프트웨어",
      description: "컴퓨터 화면의 내용을 음성으로 읽어주는 소프트웨어입니다. 시각장애 학생의 컴퓨터 학습을 돕습니다.",
      domain: "education_computer",
      category: "컴퓨터접근기기",
      market_price: 385000,
      purchase_link: "#",
      image_url: null,
      tags: ["컴퓨터", "화면독서", "음성출력", "시각장애", "교육부", "특수교육"],
    },
    {
      id: 308,
      name: "대체 키보드",
      description: "손을 사용하기 어려운 학생을 위한 대체 키보드입니다. 다양한 입력 방식을 지원합니다.",
      domain: "education_computer",
      category: "컴퓨터접근기기",
      market_price: 450000,
      purchase_link: "#",
      image_url: null,
      tags: ["컴퓨터", "키보드", "입력장치", "지체장애", "교육부", "특수교육"],
    },
    // 감각보조기기
    {
      id: 309,
      name: "FM 보청기 시스템",
      description: "교사의 목소리를 직접 들려주는 FM 보청기 시스템입니다. 청각장애 학생의 수업 이해를 돕습니다.",
      domain: "education_sensory",
      category: "감각보조기기",
      market_price: 850000,
      purchase_link: "#",
      image_url: null,
      tags: ["보청기", "FM", "청각장애", "교육부", "특수교육"],
    },
    {
      id: 310,
      name: "진동 알림 시계",
      description: "시간을 진동으로 알려주는 시계입니다. 청각장애 학생의 시간 인식을 돕습니다.",
      domain: "education_sensory",
      category: "감각보조기기",
      market_price: 80000,
      purchase_link: "#",
      image_url: null,
      tags: ["시계", "진동", "청각장애", "교육부", "특수교육"],
    },
    // 이동보조기기
    {
      id: 311,
      name: "학교용 휠체어",
      description: "학교 생활에 적합한 휠체어입니다. 좁은 복도와 교실 이동에 최적화되었습니다.",
      domain: "education_mobility",
      category: "이동보조기기",
      market_price: 1200000,
      purchase_link: "#",
      image_url: null,
      tags: ["휠체어", "이동보조", "학교", "지체장애", "교육부", "특수교육"],
    },
  ];

  // 카테고리 필터 적용
  if (categoryFilter === "all") {
    return allProducts.slice(0, 8);
  }

  const targetDomain = EDUCATION_ASSISTIVE_CATEGORIES[categoryFilter].domain;
  if (!targetDomain) return allProducts.slice(0, 8);

  return allProducts
    .filter(p => p.domain === targetDomain)
    .slice(0, 8);
}

// 카테고리 이름 변환
function getCategoryDisplayName(domain: string | null, category: string | null): string {
  if (category) return category;
  
  const domainMap: Record<string, string> = {
    education_learning: "학습보조기기",
    education_communication: "의사소통보조기기",
    education_mobility: "이동보조기기",
    education_sensory: "감각보조기기",
    education_computer: "컴퓨터접근기기",
  };
  
  return domain ? domainMap[domain] || domain : "교육용 보조공학기기";
}

export async function MOEProductShowcase() {
  const products = await getMOEProducts(8, "all");
  const hasProducts = products.length > 0;

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl md:text-4xl font-bold">
              교육부 특수교육대상자 보조공학기기 지원사업
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            특수교육대상자의 학습 및 생활 지원을 위한 보조공학기기를 지원합니다.
            <span className="text-green-400 font-semibold"> 교육청별 상이</span>, 
            <span className="text-green-400 font-semibold"> 자부담 0%</span>
          </p>
          
          {/* 특수교육대상자 안내 */}
          <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg max-w-2xl mx-auto">
            <BookOpen className="w-5 h-5 text-green-400" />
            <p className="text-green-300 font-semibold">
              지원 대상: 특수교육대상자 (6~18세 학생, 학교 신청)
            </p>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(EDUCATION_ASSISTIVE_CATEGORIES).map(([key, value]) => (
              <Button
                key={key}
                asChild
                variant={key === "all" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  key === "all"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <Link href={`/products?ministry=moe&category=${key}`}>
                  {value.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {await Promise.all(products.map(async (product) => {
              const isMOE = await isMOEProduct(product);
              const categoryName = getCategoryDisplayName(product.domain, product.category);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
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
                        <GraduationCap className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* 교육부 지원 뱃지 */}
                    {isMOE && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          교육부
                        </span>
                      </div>
                    )}
                    
                    {/* 카테고리 뱃지 */}
                    {product.domain && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          {categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 제품 정보 */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-green-400 transition-colors line-clamp-2 min-h-[3rem]">
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
                            {isMOE && (
                              <>
                                <p className="text-green-400 font-semibold">
                                  지원: 교육청별 상이 (자부담 0%)
                                </p>
                                <p className="text-gray-500 text-xs">
                                  학교를 통해 신청하세요
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
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
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
                          학교신청
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
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
            <p className="text-gray-400 text-lg mb-2">제품 준비 중입니다</p>
            <p className="text-gray-500 text-sm">곧 다양한 교육용 보조공학기기를 만나보실 수 있습니다.</p>
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
              <Link href="https://www.moe.go.kr/" target="_blank" rel="noopener noreferrer">
                더 많은 정보 보기 (교육부)
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

