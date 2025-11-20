"use client";

import { Progress } from "@/components/ui/progress";
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
  const progress = (currentStep / totalSteps) * 100;

  return (
    <nav aria-label="Process Steps" className="w-full max-w-3xl mx-auto mb-8 space-y-4">
      <div className="relative">
        {/* Background Line */}
        <div 
          className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-0" 
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
                className="flex flex-col items-center relative group"
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white",
                    isCompleted
                      ? "border-primary bg-primary text-white"
                      : isCurrent
                      ? "border-primary text-primary"
                      : "border-gray-200 text-gray-400"
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className="sr-only">
                  {isCompleted ? `Step ${stepNumber} Completed: ` : `Step ${stepNumber}: `}
                </span>
                <span
                  className={cn(
                    "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                    isCurrent ? "text-primary" : "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      
      {/* Simple Progress Bar */}
      <Progress value={progress} className="h-2" aria-hidden="true" />
    </nav>
  );
}
