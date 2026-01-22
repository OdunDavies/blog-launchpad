import { Target, TrendingUp, Scale, Repeat } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FitnessGoal } from '@/types/diet';

interface StepGoalProps {
  goal: FitnessGoal | '';
  setGoal: (value: FitnessGoal) => void;
}

const goalOptions = [
  { 
    value: 'muscle-gain' as FitnessGoal, 
    label: 'Muscle Gain', 
    description: 'Build lean muscle mass with a caloric surplus',
    detail: '+300-500 cal surplus, high protein intake',
    icon: TrendingUp,
  },
  { 
    value: 'fat-loss' as FitnessGoal, 
    label: 'Fat Loss', 
    description: 'Lose body fat while preserving muscle',
    detail: '-500 cal deficit, increased protein',
    icon: Scale,
  },
  { 
    value: 'maintenance' as FitnessGoal, 
    label: 'Maintenance', 
    description: 'Maintain current body composition',
    detail: 'Balanced intake at TDEE',
    icon: Target,
  },
  { 
    value: 'recomposition' as FitnessGoal, 
    label: 'Body Recomposition', 
    description: 'Build muscle while losing fat simultaneously',
    detail: 'Slight deficit, very high protein',
    icon: Repeat,
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
        <h3 className="text-xl font-semibold">What's your fitness goal?</h3>
        <p className="text-muted-foreground">We'll optimize your meal plan for your specific goal</p>
      </div>

      <RadioGroup
        value={goal}
        onValueChange={(value) => setGoal(value as FitnessGoal)}
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
                className={`transition-all duration-200 hover:border-primary h-full ${
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
                <CardContent className="pt-0 space-y-1">
                  <CardDescription>{option.description}</CardDescription>
                  <p className="text-xs text-primary/80 font-medium">{option.detail}</p>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
