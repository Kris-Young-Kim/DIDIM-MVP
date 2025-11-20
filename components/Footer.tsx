import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-semibold text-gray-900">Didim</span>
          <span>누구나 장벽 없이 일상을 누리도록 돕습니다.</span>
        </div>
        <nav aria-label="Footer Navigation" className="flex gap-6">
          <Link href="#" className="hover:text-gray-900 transition-colors">
            이용약관
          </Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">
            개인정보처리방침
          </Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">
            문의하기
          </Link>
        </nav>
        <div>
          © 2025 Didim. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

