"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs"; // Import useAuth
import StepNavigator from "@/components/StepNavigator";
import DomainSelector, { DOMAINS, type DomainId } from "@/components/check/DomainSelector";
import SensoryForm from "@/components/check/forms/SensoryForm";
import MobilityForm from "@/components/check/forms/MobilityForm";
import ADLForm from "@/components/check/forms/ADLForm";
import EnvironmentForm from "@/components/check/forms/EnvironmentForm";
import { Button } from "@/components/ui/button";
import { AssessmentSchema, AssessmentData } from "@/lib/schemas/assessment";
import { submitAssessment } from "@/actions/submit-assessment";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export default function CheckPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth(); // Get auth status
  const steps = ["영역 선택", "상세 질문", "환경/목표"];
  const domainLabelMap = useMemo(
    () =>
      DOMAINS.reduce<Record<DomainId, string>>((acc, domain) => {
        acc[domain.id] = domain.label;
        return acc;
      }, {} as Record<DomainId, string>),
    []
  );
  const domainFieldKeyMap = useMemo(
    () =>
      ({
        sensory: "sensory",
        mobility: "mobility",
        adl: "adl",
        communication: "communication",
        positioning: "positioning",
        vehicle: "vehicle",
        computer: "computer",
        leisure: "leisure",
        environment: "environment",
      }) as Record<DomainId, keyof AssessmentData | null>,
    []
  );

  const form = useForm<AssessmentData>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      selectedDomains: [],
      common: {
        age: 0,
        residence: "",
        goal_description: "",
      },
      sensory: undefined,
      mobility: undefined,
      adl: undefined,
      communication: undefined,
      positioning: undefined,
      vehicle: undefined,
      computer: undefined,
      leisure: undefined,
      environment: undefined,
    },
    mode: "onChange",
  });

  const [selectedDomains, setSelectedDomains] = useState<DomainId[]>([]);

  const clearDomainValues = (domainId: DomainId) => {
    const fieldKey = domainFieldKeyMap[domainId];
    if (!fieldKey) return;
    form.setValue(fieldKey, undefined as AssessmentData[typeof fieldKey], {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    form.clearErrors(fieldKey);
  };

  const handleDomainToggle = (domainId: DomainId) => {
    setSelectedDomains((prev) => {
      const exists = prev.includes(domainId);
      const next = exists ? prev.filter((id) => id !== domainId) : [...prev, domainId];
      if (exists) {
        clearDomainValues(domainId);
      }
      form.setValue("selectedDomains", next, { shouldValidate: true });
      console.groupCollapsed("[Assessment] Domain Toggle");
      console.log("toggled:", domainId);
      console.log("next domains:", next);
      console.groupEnd();
      return next;
    });
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger("selectedDomains");
      if (isValid && selectedDomains.length > 0) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      const fieldsToValidate = selectedDomains
        .map((domain) => domainFieldKeyMap[domain])
        .filter((key): key is keyof AssessmentData => Boolean(key));
      const isValid =
        fieldsToValidate.length > 0 ? await form.trigger(fieldsToValidate) : true;
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
      console.group("[Assessment] Submit Start");
      console.log("Form Data:", data);
      console.groupEnd();
      
      const result = await submitAssessment(data);
      
      console.group("[Assessment] Submit Success");
      console.log("Result:", result);
      console.log("Log ID:", result?.logId);
      console.groupEnd();

      if (!result?.logId) {
        throw new Error("분석 결과를 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      router.push(`/result/${result.logId}`);
    } catch (error) {
      console.group("[Assessment] Submit Error");
      console.error("Error:", error);
      console.groupEnd();
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "알 수 없는 오류가 발생했습니다.";
      alert(`오류가 발생했습니다: ${errorMessage}`);
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

  const renderDomainForms = () => {
    if (!selectedDomains.length) {
      return (
        <div className="p-6 border border-dashed border-white/20 rounded-xl text-foreground/70 bg-white/5">
          선택한 영역이 없습니다. 이전 단계에서 영역을 선택해주세요.
        </div>
      );
    }

    return selectedDomains.map((domain) => {
      switch (domain) {
        case "sensory":
          return <SensoryForm key="sensory" />;
        case "mobility":
          return <MobilityForm key="mobility" />;
        case "adl":
          return <ADLForm key="adl" />;
        default:
          return (
            <div
              key={domain}
              className="p-6 border border-dashed border-white/20 rounded-xl text-foreground/70 bg-white/5"
            >
              &quot;{domainLabelMap[domain] ?? domain}&quot; 영역의 상세 질문은 준비 중입니다. (Phase 2)
            </div>
          );
      }
    });
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
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedDomains.length > 0 ? (
                    selectedDomains.map((domain) => (
                      <button
                        key={`chip-${domain}`}
                        type="button"
                        onClick={() => handleDomainToggle(domain)}
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-foreground/80 hover:border-primary/60 hover:text-white transition"
                      >
                        {domainLabelMap[domain] ?? domain}
                        <X className="w-3 h-3" />
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-red-300">
                      선택한 영역이 없습니다. (이전 단계로 돌아가 선택해주세요)
                    </span>
                  )}
                </div>
                <div className="space-y-8">{renderDomainForms()}</div>
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
