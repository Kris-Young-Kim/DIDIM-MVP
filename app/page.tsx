import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeatureGrid } from "@/components/feature-grid"
import { TrustSection } from "@/components/trust-section"
import { ProductShowcase } from "@/components/product-showcase"
import { MSITProductShowcase } from "@/components/msit-product-showcase"
import { MPVAProductShowcase } from "@/components/mpva-product-showcase"
import { MOEProductShowcase } from "@/components/moe-product-showcase"
import { MOHWProductShowcase } from "@/components/mohw-product-showcase"
import { WorkplaceAccidentProductShowcase } from "@/components/moel-workplace-accident-showcase"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category || "all";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main id="main-content" aria-label="메인 콘텐츠">
        <HeroSection />
        <TrustSection />
        <FeatureGrid />
        
        {/* 지원사업 미리보기 섹션 */}
        <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                정부 지원사업 안내
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                5개 부처, 9개 사업으로 다양한 보조기기를 지원받을 수 있습니다
              </p>
              <Link 
                href="/programs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                aria-label="모든 지원사업 보기 페이지로 이동"
              >
                모든 지원사업 보기
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
