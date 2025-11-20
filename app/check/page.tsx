"use client";

import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StepNavigator from "@/components/StepNavigator";
import DomainSelector from "@/components/check/DomainSelector";
import SensoryForm from "@/components/check/forms/SensoryForm";
import MobilityForm from "@/components/check/forms/MobilityForm";
import ADLForm from "@/components/check/forms/ADLForm";
import EnvironmentForm from "@/components/check/forms/EnvironmentForm";
import { Button } from "@/components/ui/button";
import { AssessmentSchema, AssessmentData } from "@/lib/schemas/assessment";
import { submitAssessment } from "@/actions/submit-assessment";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CheckPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const steps = ["영역 선택", "상세 질문", "환경/목표"];

  const form = useForm<AssessmentData>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      selectedDomains: [],
      common: {
        age: 0,
        residence: "",
        goal_description: "",
      },
      // Initialize other objects to avoid undefined errors if radio groups expect them
      sensory: { visual_impairment: undefined, hearing_impairment: undefined },
      mobility: { walking_ability: undefined, upper_limb_strength: undefined },
      adl: { eating: undefined, dressing: undefined, bathing: undefined },
    },
    mode: "onChange", // Enable real-time validation for button state
  });

  const selectedDomains = form.watch("selectedDomains");

  const handleDomainToggle = (domainId: string) => {
    const current = form.getValues("selectedDomains") || [];
    const next = current.includes(domainId)
      ? current.filter((id) => id !== domainId)
      : [...current, domainId];
    form.setValue("selectedDomains", next, { shouldValidate: true });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger("selectedDomains");
      if (isValid && selectedDomains.length > 0) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      // Validate only selected domains
      const fieldsToValidate = selectedDomains.map(
        (d) => d as keyof AssessmentData
      );
      const isValid = await form.trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit: SubmitHandler<AssessmentData> = async (data) => {
    try {
      setIsSubmitting(true);
      // alert("AI가 분석 중입니다... 잠시만 기다려주세요.");
      
      const result = await submitAssessment(data);
      
      console.log("Analysis Result:", result);

      if (result?.logId) {
        router.push(`/result/${result.logId}`);
      } else {
        throw new Error("No log ID returned");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <main id="main-content" className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              나에게 딱 맞는 보조기기 찾기
            </h1>
            <p className="text-gray-600">
              상황에 맞는 최적의 보조기기를 추천해 드리기 위해 몇 가지 질문을 드립니다.
            </p>
          </div>

          <StepNavigator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px] relative">
            {/* Step 1: Domain Selection */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-semibold mb-6">
                  어떤 영역에서 도움이 필요하신가요?
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (중복 선택 가능)
                  </span>
                </h2>
                <DomainSelector
                  selectedDomains={selectedDomains}
                  onToggle={handleDomainToggle}
                />
                {form.formState.errors.selectedDomains && (
                  <p className="text-red-500 text-sm mt-2">
                    {form.formState.errors.selectedDomains.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Dynamic Forms */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-semibold mb-6">
                  상세 상황을 알려주세요
                </h2>
                <div className="space-y-8">
                  {selectedDomains.includes("sensory") && <SensoryForm />}
                  {selectedDomains.includes("mobility") && <MobilityForm />}
                  {selectedDomains.includes("adl") && <ADLForm />}
                  
                  {/* Placeholder for other domains */}
                  {selectedDomains
                    .filter(d => !["sensory", "mobility", "adl"].includes(d))
                    .map(d => (
                      <div key={d} className="p-4 border border-dashed border-gray-200 rounded-lg text-gray-500 text-center">
                        &quot;{d}&quot; 영역의 상세 질문은 준비 중입니다. (Phase 2)
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Step 3: Environment & Goal */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-semibold mb-6">
                  환경 및 목표 설정
                </h2>
                <EnvironmentForm />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              className="w-24"
              type="button"
            >
              이전
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && selectedDomains.length === 0}
                className="w-24 bg-[#6c47ff] hover:bg-[#5b3bdb]"
                type="button"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-32 bg-[#6c47ff] hover:bg-[#5b3bdb]"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  "결과 보기"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
