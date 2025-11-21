import { getServiceRoleClient } from "@/lib/supabase/service-role";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink } from "lucide-react";

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

async function getProducts(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, domain, category, market_price, purchase_link, image_url, tags")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Product fetch error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function ProductShowcase() {
  const products = await getProducts(8);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            인기 보조기기
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            다양한 보조기기를 만나보세요. 국비 지원 대상 제품부터 일반 제품까지 한눈에 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
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
                {/* 카테고리 뱃지 */}
                {product.domain && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {product.domain}
                    </span>
                  </div>
                )}
              </div>

              {/* 제품 정보 */}
              <div className="p-5">
                <div className="mb-2">
                  {product.category && (
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {product.category}
                    </span>
                  )}
                </div>
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
                  {product.purchase_link ? (
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
          ))}
        </div>

        {/* 더보기 버튼 */}
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
      </div>
    </section>
  );
}

