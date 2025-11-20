/**
 * @file components/Navbar.tsx
 * @description 최상단 글로벌 네비게이션. 다크 네이비 테마에 맞춰 글래스 효과와
 * Clerk 인증 CTA(로그인/회원가입)를 제공한다.
 */
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 gap-4 h-16 max-w-7xl mx-auto text-foreground">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Didim
        </Link>
        <nav aria-label="Global Navigation" className="flex gap-4 items-center text-sm font-medium">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="cursor-pointer text-primary/80 hover:text-primary transition-colors font-semibold">
                로그인
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-primary to-[#7c5eff] text-primary-foreground rounded-full font-semibold text-sm sm:text-base h-10 sm:h-12 px-6 cursor-pointer transition-all shadow-lg shadow-primary/40 hover:shadow-primary/60">
                회원가입
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonTrigger: "ring-2 ring-primary/40 rounded-full" } }} />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
