import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
          </div>
          <div>
            <h4 className="font-bold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-white">
                  지원사업 찾기
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  제품 둘러보기
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  성공 사례
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">회사</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-white">
                  팀 소개
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  채용
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2025 DIDIM. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">
              이용약관
            </Link>
            <Link href="#" className="hover:text-white">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
