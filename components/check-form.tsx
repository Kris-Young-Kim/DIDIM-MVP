"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { submitAssessment } from "@/actions/submit-assessment"
import type { AssessmentData } from "@/lib/schemas/assessment"
import { toast } from "sonner"

export function CheckForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    birthYear: "",
    disabilityType: "",
    occupation: "",
    isVeteran: "no",
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.birthYear || !formData.occupation || !formData.disabilityType) {
      toast.error("모든 항목을 입력해주세요.")
      return
    }

    setLoading(true)

    try {
      // submit-assessment가 기대하는 AssessmentData 형식으로 변환
      const currentYear = new Date().getFullYear()
      const age = currentYear - Number.parseInt(formData.birthYear)

      // disabilityType에 따라 selectedDomains 결정
      const selectedDomains: string[] = []
      if (formData.disabilityType === "physical" || formData.disabilityType === "visual") {
        selectedDomains.push("mobility", "sensory")
      } else if (formData.disabilityType === "hearing") {
        selectedDomains.push("sensory", "communication")
      } else if (formData.disabilityType === "developmental") {
        selectedDomains.push("communication", "adl")
      } else if (formData.disabilityType === "elderly") {
        selectedDomains.push("adl", "mobility")
      } else {
        selectedDomains.push("mobility") // 기본값
      }

      // AssessmentData 구성 (간단한 버전 - 필수 필드만)
      const assessmentData: AssessmentData = {
        selectedDomains,
        // 기본값으로 도메인별 데이터 채우기
        mobility: {
          walking_ability: "independent",
          upper_limb_strength: "normal",
        },
        sensory: {
          visual_impairment: formData.disabilityType === "visual" ? "low_vision" : "none",
          hearing_impairment: formData.disabilityType === "hearing" ? "mild" : "none",
        },
        adl: {
          eating: "independent",
          dressing: "independent",
          bathing: "independent",
        },
        common: {
          age,
          residence: "서울", // 기본값, 나중에 입력받을 수 있음
          goal_description: "일상생활에 필요한 보조기기를 지원받고 싶습니다.",
        },
      }

      console.log("[CheckForm] Submitting assessment:", assessmentData)

      // submit-assessment Server Action 호출
      const result = await submitAssessment(assessmentData)

      console.log("[CheckForm] Assessment result:", result)

      // 성공 시 result/[id]로 이동
      if (result.logId) {
        toast.success("분석이 완료되었습니다!")
        router.push(`/result/${result.logId}`)
      } else {
        throw new Error("분석 결과 ID를 받지 못했습니다.")
      }
    } catch (error) {
      console.error("[CheckForm] Submit error:", error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : "분석 중 오류가 발생했습니다. 다시 시도해주세요."
      )
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 p-6 md:p-8">
      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1 rounded-full mb-8">
        <div className="bg-blue-500 h-1 rounded-full transition-all duration-300" style={{ width: `${step * 25}%` }} />
      </div>

      <div className="min-h-[300px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">태어난 연도를 알려주세요.</h2>
              <p className="text-sm text-gray-400">나이에 따라 지원 가능한 사업이 달라집니다.</p>
            </div>
            <Input
              type="number"
              placeholder="예: 1980"
              className="bg-black/20 border-white/10 text-lg h-12"
              value={formData.birthYear}
              onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">현재 직업 상태는 어떠신가요?</h2>
              <p className="text-sm text-gray-400">고용노동부 지원 사업 대상인지 확인합니다.</p>
            </div>
            <RadioGroup
              value={formData.occupation}
              onValueChange={(val) => setFormData({ ...formData, occupation: val })}
              className="grid grid-cols-1 gap-3"
            >
              {[
                { value: "worker", label: "직장인 / 사업주", desc: "4대보험 가입 또는 사업자등록증 보유" },
                { value: "job_seeker", label: "구직자 / 훈련생", desc: "워크넷 구직등록 또는 직업훈련 중" },
                { value: "student", label: "학생", desc: "초/중/고/대학교 재학 중" },
                { value: "none", label: "해당 없음", desc: "현재 경제활동을 하지 않음" },
              ].map((item) => (
                <div key={item.value}>
                  <RadioGroupItem value={item.value} id={item.value} className="peer sr-only" />
                  <Label
                    htmlFor={item.value}
                    className="flex flex-col p-4 rounded-xl bg-black/20 border border-white/10 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer hover:bg-white/5 transition-all"
                  >
                    <span className="font-semibold text-base mb-1">{item.label}</span>
                    <span className="text-xs text-gray-400">{item.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">장애 유형을 선택해주세요.</h2>
              <p className="text-sm text-gray-400">유형에 따라 지원되는 품목이 다릅니다.</p>
            </div>
            <Select
              value={formData.disabilityType}
              onValueChange={(val) => setFormData({ ...formData, disabilityType: val })}
            >
              <SelectTrigger className="bg-black/20 border-white/10 h-12 text-lg">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">지체/뇌병변 장애</SelectItem>
                <SelectItem value="visual">시각 장애</SelectItem>
                <SelectItem value="hearing">청각/언어 장애</SelectItem>
                <SelectItem value="developmental">발달 장애</SelectItem>
                <SelectItem value="elderly">노인성 질환 (장기요양등급)</SelectItem>
                <SelectItem value="none">장애 등록 안함</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">국가유공자이신가요?</h2>
              <p className="text-sm text-gray-400">보훈부 지원 대상인지 확인합니다.</p>
            </div>
            <RadioGroup
              value={formData.isVeteran}
              onValueChange={(val) => setFormData({ ...formData, isVeteran: val })}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="yes" id="vet-yes" className="peer sr-only" />
                <Label
                  htmlFor="vet-yes"
                  className="flex items-center justify-center p-6 rounded-xl bg-black/20 border border-white/10 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer hover:bg-white/5 transition-all h-full"
                >
                  <span className="font-semibold">네, 맞습니다</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="no" id="vet-no" className="peer sr-only" />
                <Label
                  htmlFor="vet-no"
                  className="flex items-center justify-center p-6 rounded-xl bg-black/20 border border-white/10 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer hover:bg-white/5 transition-all h-full"
                >
                  <span className="font-semibold">아니요</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="pt-8 flex justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white">
              이전
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="bg-white text-black hover:bg-gray-200 px-8 rounded-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 분석 중...
              </>
            ) : step === 4 ? (
              "결과 보기"
            ) : (
              "다음"
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
