import { Target, Dumbbell, Flame, Scale, Activity } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepGoalProps {
  goal: string;
  setGoal: (value: string) => void;
}

const goalOptions = [
  { 
    value: 'strength', 
    label: 'Build Strength', 
    description: 'Low reps, heavy weight, longer rest',
    icon: Dumbbell
  },
  { 
    value: 'hypertrophy', 
    label: 'Muscle Growth', 
    description: 'Moderate reps, progressive overload',
    icon: Target
  },
  { 
    value: 'endurance', 
    label: 'Endurance', 
    description: 'High reps, shorter rest periods',
    icon: Flame
  },
  { 
    value: 'weight-loss', 
    label: 'Weight Loss', 
    description: 'High volume, circuit-style training',
    icon: Scale
  },
  { 
    value: 'general', 
    label: 'General Fitness', 
    description: 'Well-rounded training with varied rep ranges',
    icon: Activity
  },
];

export function StepGoal({ goal, setGoal }: StepGoalProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Target className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">What's your training goal?</h3>
        <p className="text-muted-foreground">We'll optimize your plan for this goal</p>
      </div>

      <RadioGroup
        value={goal}
        onValueChange={setGoal}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {goalOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Label
              key={option.value}
              htmlFor={`goal-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all duration-200 hover:border-primary ${
                  goal === option.value ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={option.value} id={`goal-${option.value}`} />
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{option.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{option.description}</CardDescription>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
