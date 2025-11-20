import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        Didim
      </Link>
      <nav aria-label="Global Navigation" className="flex gap-4 items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
              로그인
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b3bdb] transition-colors">
              회원가입
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
};

export default Navbar;
