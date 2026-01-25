import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  icon: React.ReactNode;
}

interface DietWizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export function DietWizardProgress({ currentStep, totalSteps, steps }: DietWizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    isPending && 'border-muted-foreground/30 bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-xs sm:text-sm">{step.icon}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-[10px] sm:text-xs font-medium hidden sm:block',
                    isCompleted && 'text-primary',
                    isCurrent && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2',
                    stepNumber < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step indicator */}
      <div className="sm:hidden mt-2 text-center">
        <span className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}: <span className="font-medium text-foreground">{steps[currentStep - 1]?.title}</span>
        </span>
      </div>
    </div>
  );
}
