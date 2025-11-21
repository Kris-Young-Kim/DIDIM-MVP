"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileText } from "lucide-react"
import { toast } from "sonner"

export function FormDownloader({ programName }: { programName: string }) {
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle")

  const handleDownload = async () => {
    setStatus("generating")
    toast.info("AI가 서류 작성을 시작했습니다.", {
      description: "사용자 정보를 바탕으로 최적화된 내용을 생성 중입니다...",
    })

    // Simulate AI Generation Delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setStatus("done")
    toast.success("서류 생성이 완료되었습니다!", {
      description: `${programName} 신청서가 다운로드 폴더에 저장되었습니다.`,
    })
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={status === "generating"}
      className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base flex-1"
    >
      {status === "generating" ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          AI가 서류 작성 중...
        </>
      ) : status === "done" ? (
        <>
          <FileText className="w-5 h-5 mr-2" />
          작성 완료 (다시 받기)
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" />
          AI 신청서 자동 생성
        </>
      )}
    </Button>
  )
}
