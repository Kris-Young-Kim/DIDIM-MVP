"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

export function LoginRequired() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              로그인이 필요한 서비스입니다
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              지원사업 정보와 제품 쇼케이스를 확인하려면
            </p>
            <p className="text-gray-400 text-lg mb-8">
              먼저 로그인해주세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 rounded-full text-base bg-white text-black hover:bg-gray-200">
              <Link href="/sign-in">
                로그인하기 <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-full text-base border-white/20 hover:bg-white/10 bg-transparent"
            >
              <Link href="/sign-up">
                회원가입
              </Link>
            </Button>
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-4">로그인 후 이용 가능한 서비스</h3>
            <ul className="text-left text-gray-400 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>5개 부처, 9개 지원사업 상세 정보 확인</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>부처별 제품 쇼케이스 및 가격 정보</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>AI 기반 맞춤형 지원사업 추천</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">✓</span>
                <span>신청서 자동 작성 및 다운로드</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

