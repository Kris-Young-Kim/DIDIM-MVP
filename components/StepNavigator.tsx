"use client";

/**
 * @file components/StepNavigator.tsx
 * @description 다크 네이비 테마에 맞춰 커스텀한 단계 진행 UI.
 */
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function StepNavigator({
  currentStep,
  totalSteps,
  steps,
}: StepNavigatorProps) {
  return (
    <nav aria-label="Process Steps" className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative">
        {/* Connecting Line */}
        <div 
          className="absolute top-4 left-0 w-full h-[2px] bg-white/10 z-0" 
          aria-hidden="true" 
        />
        {/* Progress Line (Colored) */}
        <div 
          className="absolute top-4 left-0 h-[2px] bg-primary transition-all duration-500 z-0" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          aria-hidden="true" 
        />
        
        <ol className="relative flex justify-between w-full z-10">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <li
                key={step}
                className="flex flex-col items-center group"
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-card text-foreground shadow-inner shadow-black/30",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-primary/40"
                      : isCurrent
                      ? "border-primary text-primary ring-4 ring-primary/20"
                      : "border-white/10 text-foreground/40"
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </div>
                <span className="sr-only">
                  {isCompleted ? `Step ${stepNumber} Completed: ` : `Step ${stepNumber}: `}
                </span>
                <span
                  className={cn(
                    "mt-3 text-xs font-bold tracking-tight whitespace-nowrap transition-colors duration-300 px-2 py-1 rounded-full",
                    isCurrent ? "text-primary bg-primary/10" : "text-foreground/50"
                  )}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
