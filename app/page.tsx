/**
 * @file app/page.tsx
 * @description 랜딩 페이지. 다크 네이비 테마 기반으로 Hero, Features, How-it-works 섹션을 구성한다.
 *
 * 주요 섹션:
 * 1. Hero: CTA와 서비스 핵심 메시지
 * 2. Feature Highlights: 3가지 강점 카드
 * 3. How It Works: 3단계 이용 방법
 *
 * @dependencies lucide-react, shadcn/ui Button/Card/Badge
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Search, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-foreground">
      {/* Hero Section */}
      <section className="section-hero w-full py-24 lg:py-32 flex flex-col items-center px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-white/10 text-primary border-white/20 rounded-full mb-4">
            ✨ AI 기반 보조기기 매칭 서비스
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            나에게 딱 맞는 보조기기,<br className="hidden md:block" />
            <span className="glossy-text">디딤(Didim)</span>으로 찾으세요
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl leading-relaxed">
            수천 개의 보조기기 중 무엇이 필요할지 고민되시나요? <br className="hidden md:block" />
            간단한 질문에 답하면, AI 전문가가 최적의 제품을 추천해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <Link href="/check" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all text-primary-foreground">
                지금 무료로 진단받기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
              서비스 소개 보기
            </Button> */}
          </div>
          <p className="text-sm text-foreground/60 mt-4">
            * 별도의 회원가입 없이도 체험 가능합니다. (결과 저장 시 로그인 필요)
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">왜 디딤(Didim)인가요?</h2>
            <p className="text-foreground/70">복잡한 정보 탐색 과정을 획기적으로 단축시켜 드립니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="AI 전문가 분석"
              description="Google Gemini AI가 사용자의 신체 기능과 환경을 정밀 분석하여 맞춤형 카테고리를 제안합니다."
            />
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-primary" />}
              title="9대 영역 커버리지"
              description="감각, 이동, 일상생활 등 보조기기 공적급여 9대 영역의 데이터를 기반으로 폭넓게 탐색합니다."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-primary" />}
              title="검증된 제품 매칭"
              description="실제 판매 중인 제품 중 평점과 리뷰가 검증된 대표 제품을 우선적으로 추천해 드립니다."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 px-4 section-muted">
         <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">이용 방법</h2>
            <p className="text-foreground/80">누구나 3단계면 충분합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
             {/* Connecting Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-white/15 -z-10 transform -translate-y-1/2"></div>

             <StepCard 
               number="01"
               title="영역 선택"
               description="도움이 필요한 생활 영역을 선택합니다."
             />
             <StepCard 
               number="02"
               title="상황 진단"
               description="현재 겪고 있는 어려움과 목표를 입력합니다."
             />
             <StepCard 
               number="03"
               title="결과 확인"
               description="AI 분석 결과와 추천 제품을 확인합니다."
             />
          </div>

          <div className="mt-16 text-center">
             <Link href="/check">
              <Button size="lg" className="h-12 px-8 rounded-full bg-primary hover:bg-primary/85 text-primary-foreground shadow-lg shadow-primary/30">
                보조기기 추천 시작하기
              </Button>
            </Link>
          </div>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border border-white/5 glass transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="p-8 flex flex-col items-center text-center gap-4">
        <div className="p-4 bg-white/10 rounded-2xl shadow-inner shadow-black/30 mb-2">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-foreground/70 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center gap-4 glass p-8 rounded-2xl shadow-lg">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-2 shadow-lg shadow-primary/40">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
}
