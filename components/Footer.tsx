/**
 * @file components/Footer.tsx
 * @description 다크 네이비 테마에 맞춘 푸터. 브랜드 메시지와 기본 링크를 제공한다.
 */
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-16 bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-foreground/70">
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <span className="font-semibold text-white text-lg">Didim</span>
          <span>누구나 장벽 없이 일상을 누리도록 돕습니다.</span>
        </div>
        <nav aria-label="Footer Navigation" className="flex gap-6 text-foreground/60">
          <Link href="#" className="hover:text-white transition-colors">
            이용약관
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            개인정보처리방침
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            문의하기
          </Link>
        </nav>
        <div className="text-foreground/50 text-center md:text-right">
          © 2025 Didim. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

