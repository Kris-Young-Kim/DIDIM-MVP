import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@/components/providers/clerk-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SyncUserProvider } from "@/components/providers/sync-user-provider"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "DIDIM | AI Assistive Tech Platform",
  description: "One-Stop FinTech for Assistive Technology Support",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="ko" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-black text-white`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SyncUserProvider>
              {children}
            </SyncUserProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
