import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminProductList } from "@/components/admin-product-list"
import { BarChart3, CheckCircle2, Clock, Users } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
            <p className="text-gray-400">n8n 자동 수집 제품 및 신청 현황을 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            n8n Automation Active
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">총 수집 제품</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,345</div>
              <p className="text-xs text-gray-500">+180 from last week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">승인 대기</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">24</div>
              <p className="text-xs text-gray-500">Requires review</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">이번 달 신청</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-gray-500">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">활성 사용자</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-gray-500">+180 new users</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 h-full">
              <CardHeader>
                <CardTitle>신규 수집 제품 (Pending Approval)</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminProductList />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>최근 활동 로그</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New Application", user: "김*수", time: "2분 전" },
                    { action: "Product Approved", user: "Admin", time: "15분 전" },
                    { action: "n8n Sync Completed", user: "System", time: "1시간 전" },
                    { action: "New User Signup", user: "이*영", time: "2시간 전" },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-white">{log.action}</p>
                        <p className="text-gray-500">{log.user}</p>
                      </div>
                      <span className="text-gray-600 text-xs">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
