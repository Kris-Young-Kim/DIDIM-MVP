/**
 * @file app/layout.tsx
 * @description 글로벌 레이아웃. ClerkProvider + SyncUserProvider로 인증을 구성하고,
 * 다크 네이비 테마를 body에 적용한다.
 */
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Didim - 유니버설 보조기기 매칭",
  description: "누구나 장벽 없이 일상을 누리도록 돕는 보조기기 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" className="bg-background text-foreground">
        <body className="antialiased bg-background text-foreground min-h-screen">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:top-0 focus:left-0"
          >
            본문으로 건너뛰기
          </a>
          <SyncUserProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
