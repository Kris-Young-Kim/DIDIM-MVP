"use client";

import { useState } from "react";
import { useForm, FormProvider, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs"; // Import useAuth
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
  const { isSignedIn } = useAuth(); // Get auth status
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
      sensory: { visual_impairment: undefined, hearing_impairment: undefined },
      mobility: { walking_ability: undefined, upper_limb_strength: undefined },
      adl: { eating: undefined, dressing: undefined, bathing: undefined },
    },
    mode: "onChange",
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
    // Client-side Auth Check
    if (!isSignedIn) {
      const confirmLogin = confirm("상세 분석 결과를 확인하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?");
      if (confirmLogin) {
        router.push("/sign-in?redirect_url=/check");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitAssessment(data);
      
      console.log("Analysis Result:", result);

      if (result?.logId) {
        router.push(`/result/${result.logId}`);
      } else {
        throw new Error("No log ID returned");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert(`오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<AssessmentData>) => {
    console.error("Form Validation Errors:", errors);
    
    // Recursive function to find the first error message
    const getFirstErrorMessage = (error: any): string => {
      if (error.message) return error.message;
      if (typeof error === 'object') {
        const values = Object.values(error);
        if (values.length > 0) return getFirstErrorMessage(values[0]);
      }
      return "입력 값을 확인해주세요.";
    };

    const errorMessage = getFirstErrorMessage(errors);
    alert(`[입력 오류] ${errorMessage}`);
  };

  return (
    <FormProvider {...form}>
      <section className="min-h-screen bg-background py-12 text-foreground">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80 mb-3">
              DIDIM ASSESSMENT
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              나에게 딱 맞는 보조기기 찾기
            </h1>
            <p className="text-foreground/70">
              상황에 맞는 최적의 보조기기를 추천해 드리기 위해 몇 가지 질문을 드립니다.
            </p>
          </div>

          <StepNavigator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          <div className="glass rounded-3xl border border-white/10 p-8 md:p-12 min-h-[500px] relative transition-all duration-300">
            {/* Step 1: Domain Selection */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  어떤 영역에서 도움이 필요하신가요?
                  <span className="text-base font-medium text-foreground/60 ml-2 align-middle">
                    (중복 선택 가능)
                  </span>
                </h2>
                <DomainSelector
                  selectedDomains={selectedDomains}
                  onToggle={handleDomainToggle}
                />
                {form.formState.errors.selectedDomains && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.selectedDomains.message}
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Dynamic Forms */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  상세 상황을 알려주세요
                </h2>
                <div className="space-y-8">
                  {selectedDomains.includes("sensory") && <SensoryForm />}
                  {selectedDomains.includes("mobility") && <MobilityForm />}
                  {selectedDomains.includes("adl") && <ADLForm />}
                  
                  {/* Placeholder for other domains */}
                  {selectedDomains
                    .filter((d) => !["sensory", "mobility", "adl"].includes(d))
                    .map((d) => (
                      <div
                        key={d}
                        className="p-6 border border-dashed border-white/20 rounded-xl text-foreground/70 text-center bg-white/5"
                      >
                        &quot;{d}&quot; 영역의 상세 질문은 준비 중입니다. (Phase 2)
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 3: Environment & Goal */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 text-white">
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
              className="w-24 h-12 text-base rounded-full border-white/30 text-foreground/80 hover:bg-white/5 hover:text-white"
              type="button"
            >
              이전
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && selectedDomains.length === 0}
                className="w-24 h-12 text-base bg-primary hover:bg-primary/85 text-primary-foreground rounded-full shadow-lg shadow-primary/30 transition-all"
                type="button"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit, onError)}
                disabled={isSubmitting}
                className="w-36 h-12 text-base bg-primary hover:bg-primary/85 text-primary-foreground rounded-full shadow-lg shadow-primary/30 transition-all"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  "결과 보기"
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </FormProvider>
  );
}
