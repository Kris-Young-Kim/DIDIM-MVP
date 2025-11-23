"use client";

import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only"
      aria-label="메인 콘텐츠로 건너뛰기"
    >
      메인 콘텐츠로 건너뛰기
    </Link>
  );
}

