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

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category || "all";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main>
        <HeroSection />
        <TrustSection />
        <FeatureGrid />
        <ProductShowcase category={category} />
        <WorkplaceAccidentProductShowcase />
        <MSITProductShowcase />
        <MPVAProductShowcase />
        <MOEProductShowcase />
        <MOHWProductShowcase />
      </main>
      <Footer />
    </div>
  )
}
