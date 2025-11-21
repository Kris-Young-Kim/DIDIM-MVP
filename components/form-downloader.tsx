"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { generateApplication } from "@/actions/generate-application"

interface FormDownloaderProps {
  programId: number // welfare_programs.id
  programName: string
  assessmentLogId?: string // assessment_logs.id (선택적)
}

export function FormDownloader({ programId, programName, assessmentLogId }: FormDownloaderProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "generating-pdf" | "done" | "error">("idle")
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setStatus("generating")
    setError(null)
    
    toast.info("AI가 서류 작성을 시작했습니다.", {
      description: "사용자 정보를 바탕으로 최적화된 내용을 생성 중입니다...",
    })

    try {
      // 1. AI Writing: 신청서 내용 생성 및 applications 테이블 저장
      const { applicationId } = await generateApplication({
        programId,
        assessmentLogId,
      })

      console.log("Application generated:", applicationId)

      setStatus("generating-pdf")
      toast.info("PDF 생성 중...", {
        description: "신청서 파일을 생성하고 있습니다.",
      })

      // 2. PDF 생성 및 업로드
      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "PDF 생성에 실패했습니다.")
      }

      const data = await response.json()
      setFileUrl(data.fileUrl)

      setStatus("done")
      toast.success("서류 생성이 완료되었습니다!", {
        description: `${programName} 신청서가 준비되었습니다.`,
      })

      // 3. 파일 다운로드
      if (data.fileUrl) {
        window.open(data.fileUrl, "_blank")
      }
    } catch (err) {
      console.error("Form generation error:", err)
      setStatus("error")
      const errorMessage = err instanceof Error ? err.message : "서류 생성 중 오류가 발생했습니다."
      setError(errorMessage)
      
      toast.error("서류 생성 실패", {
        description: errorMessage,
      })
    }
  }

  return (
    <div className="flex-1">
      <Button
        onClick={handleDownload}
        disabled={status === "generating" || status === "generating-pdf"}
        className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base w-full"
      >
        {status === "generating" ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            AI가 서류 작성 중...
          </>
        ) : status === "generating-pdf" ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            PDF 생성 중...
          </>
        ) : status === "done" ? (
          <>
            <FileText className="w-5 h-5 mr-2" />
            작성 완료 (다시 받기)
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            다시 시도
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            AI 신청서 자동 생성
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
