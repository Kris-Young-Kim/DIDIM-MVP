import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { ChatInterface } from "@/components/chat-interface"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ChatPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect=/chat");
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <SiteHeader />
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                AI 챗봇 상담
              </h1>
              <p className="text-gray-400 text-lg">
                보조기기 지원사업과 제품에 대해 궁금한 점을 물어보세요
              </p>
            </div>
            <ChatInterface />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

