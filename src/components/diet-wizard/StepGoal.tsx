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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">What's your primary goal?</h3>
        <p className="text-sm text-muted-foreground">
          We'll optimize your macros based on your goal
        </p>
      </div>

      <RadioGroup
        value={goal}
        onValueChange={(value) => setGoal(value as DietGoal)}
        className="grid gap-3"
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
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <div className={`p-2 rounded-lg ${goal === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
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
