"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Menu, X } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export function SiteHeader() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header role="banner" className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="DIDIM 홈으로 이동">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight">DIDIM</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav aria-label="주요 네비게이션" className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link 
            href="#features" 
            className={`hover:text-white transition-colors ${pathname === "/" ? "text-white" : ""}`}
          >
            기능 소개
          </Link>
          <Link 
            href="/programs" 
            className={`hover:text-white transition-colors ${isActive("/programs") ? "text-white font-semibold" : ""}`}
            aria-current={isActive("/programs") ? "page" : undefined}
          >
            지원 사업
          </Link>
          {isSignedIn && (
            <Link 
              href="/chat" 
              className={`hover:text-white transition-colors flex items-center gap-1 ${isActive("/chat") ? "text-white font-semibold" : ""}`}
              aria-current={isActive("/chat") ? "page" : undefined}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>AI챗봇</span>
            </Link>
          )}
          <Link 
            href="#pricing" 
            className="hover:text-white transition-colors"
          >
            요금제
          </Link>
          <Link 
            href="/admin" 
            className={`hover:text-white transition-colors ${isActive("/admin") ? "text-white font-semibold" : ""}`}
            aria-current={isActive("/admin") ? "page" : undefined}
          >
            파트너스
          </Link>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" aria-hidden="true" />
          )}
        </button>

        {/* 데스크톱 우측 버튼 */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white">
            로그인
          </Link>
          <Button asChild className="bg-white text-black hover:bg-gray-200 rounded-full px-6">
            <Link href="/check">
              시작하기 <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="모바일 네비게이션"
          className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="#features"
              className="block py-3 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              기능 소개
            </Link>
            <Link
              href="/programs"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                isActive("/programs")
                  ? "text-white font-semibold bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive("/programs") ? "page" : undefined}
            >
              지원 사업
            </Link>
            {isSignedIn && (
              <Link
                href="/chat"
                className={`block py-3 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/chat")
                    ? "text-white font-semibold bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive("/chat") ? "page" : undefined}
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>AI챗봇</span>
              </Link>
            )}
            <Link
              href="#pricing"
              className="block py-3 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              요금제
            </Link>
            <Link
              href="/admin"
              className={`block py-3 px-4 rounded-lg transition-colors ${
                isActive("/admin")
                  ? "text-white font-semibold bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive("/admin") ? "page" : undefined}
            >
              파트너스
            </Link>
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/login"
                className="block py-3 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                로그인
              </Link>
              <Button asChild className="w-full bg-white text-black hover:bg-gray-200 rounded-full">
                <Link href="/check" onClick={() => setMobileMenuOpen(false)}>
                  시작하기 <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
