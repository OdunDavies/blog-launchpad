import { DietGoal, GOAL_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dumbbell, TrendingDown, Scale, Zap } from 'lucide-react';

interface StepGoalProps {
  goal: DietGoal | '';
  setGoal: (value: DietGoal) => void;
}

const goalOptions: { value: DietGoal; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'muscle_building',
    label: 'Build Muscle',
    description: 'High protein diet to support muscle growth and recovery',
    icon: Dumbbell,
  },
  {
    value: 'fat_loss',
    label: 'Lose Fat',
    description: 'Caloric deficit with high protein to preserve muscle',
    icon: TrendingDown,
  },
  {
    value: 'maintenance',
    label: 'Maintain Weight',
    description: 'Balanced nutrition to maintain your current physique',
    icon: Scale,
  },
  {
    value: 'endurance',
    label: 'Improve Endurance',
    description: 'High carb diet optimized for athletic performance',
    icon: Zap,
  },
];

export function StepGoal({ goal, setGoal }: StepGoalProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">What's your primary goal?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          We'll optimize your macros based on your goal
        </p>
      </div>

      <RadioGroup
        value={goal}
        onValueChange={(value) => setGoal(value as DietGoal)}
        className="grid gap-2 sm:gap-3"
      >
        {goalOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary ${
                  goal === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${goal === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">{option.label}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
