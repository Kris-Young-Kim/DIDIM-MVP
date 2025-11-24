import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="DIDIM 홈으로 이동">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-sm" />
              </div>
              <span className="font-bold text-lg">DIDIM</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              보조공학사와 개발자가 함께 만드는
              <br />
              누구나 기술의 혜택을 누리는 세상.
            </p>
            <div className="mt-4 space-y-2">
              <a 
                href="mailto:contact@didim.kr" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all duration-200 hover:scale-105"
                aria-label="이메일로 문의하기"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>contact@didim.kr</span>
              </a>
              <a 
                href="tel:1670-5529" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all duration-200 hover:scale-105"
                aria-label="전화로 문의하기"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>1670-5529</span>
              </a>
            </div>
          </div>
          <nav aria-label="서비스 링크">
            <h4 className="font-bold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/programs" className="hover:text-white transition-all duration-200 hover:scale-105 inline-block">
                  지원사업 찾기
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-all duration-200 hover:scale-105 inline-block">
                  제품 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-all duration-200 hover:scale-105 inline-block">
                  성공 사례
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="회사 정보">
            <h4 className="font-bold mb-4">회사</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/#features" className="hover:text-white transition-all duration-200 hover:scale-105 inline-block">
                  팀 소개
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-all duration-200 hover:scale-105 inline-block">
                  채용
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@didim.kr" 
                  className="hover:text-white transition-all duration-200 hover:scale-105 inline-block"
                >
                  문의하기
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2025 DIDIM. All rights reserved.</p>
          <nav aria-label="법적 정보">
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white transition-all duration-200 hover:scale-105">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-white transition-all duration-200 hover:scale-105">
                개인정보처리방침
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
