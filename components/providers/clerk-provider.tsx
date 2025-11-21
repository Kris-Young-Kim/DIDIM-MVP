"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

/**
 * Clerk 인증 프로바이더
 * RootLayout에서 사용하기 위한 클라이언트 컴포넌트
 */
export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase>
      {children}
    </ClerkProviderBase>
  );
}

