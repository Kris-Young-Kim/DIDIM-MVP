import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeatureGrid } from "@/components/feature-grid"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main>
        <HeroSection />
        <TrustSection />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  )
}
