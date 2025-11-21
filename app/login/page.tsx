import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-6">
            <div className="w-6 h-6 bg-black rounded-sm" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">DIDIM 시작하기</h1>
          <p className="text-gray-400">
            3초 만에 가입하고 나에게 맞는 <br />
            정부 지원금을 확인해보세요.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button className="w-full h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black font-semibold text-base rounded-xl relative overflow-hidden group">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M12 3C5.373 3 0 6.627 0 11.1c0 2.837 2.167 5.366 5.49 6.768-.247.912-.897 3.312-.927 3.494-.046.28.103.278.216.205.146-.093 2.318-1.576 3.254-2.21.944.136 1.926.21 2.967.21 6.627 0 12-3.627 12-8.1S16.627 3 12 3z" />
              </svg>
              카카오로 3초 만에 시작하기
            </span>
          </Button>

          <Button className="w-full h-12 bg-white hover:bg-gray-100 text-black font-semibold text-base rounded-xl border border-gray-200">
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google로 계속하기
            </span>
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p className="mb-4">
            계정이 없으신가요?{" "}
            <Link href="#" className="text-blue-400 hover:underline">
              이메일로 가입하기
            </Link>
          </p>
          <p className="text-xs">
            가입 시{" "}
            <Link href="#" className="underline">
              이용약관
            </Link>{" "}
            및{" "}
            <Link href="#" className="underline">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>

        <div className="pt-8 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
