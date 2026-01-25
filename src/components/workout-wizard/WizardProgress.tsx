import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; icon: React.ReactNode }[];
}

export function WizardProgress({ currentStep, totalSteps, steps }: WizardProgressProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-between min-w-max sm:min-w-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    !isCompleted && !isCurrent && "border-muted-foreground/30 bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-xs sm:hidden">{stepNumber}</span>
                  )}
                  <span className="hidden sm:block">{step.icon}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center hidden md:block max-w-16",
                    isCurrent && "text-primary",
                    isCompleted && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 sm:mx-2 transition-all duration-300 min-w-4",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
