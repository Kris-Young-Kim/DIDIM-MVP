import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight">DIDIM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">
            기능 소개
          </Link>
          <Link href="#programs" className="hover:text-white transition-colors">
            지원 사업
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            요금제
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            파트너스
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white hidden sm:block">
            로그인
          </Link>
          <Button asChild className="bg-white text-black hover:bg-gray-200 rounded-full px-6">
            <Link href="/check">
              시작하기 <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
