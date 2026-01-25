import { FitnessGoal } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dumbbell, TrendingDown, Scale, RefreshCw, Target } from 'lucide-react';

interface StepGoalProps {
  goal: FitnessGoal | '';
  setGoal: (value: FitnessGoal) => void;
}

const goalOptions: { 
  value: FitnessGoal; 
  label: string; 
  description: string; 
  macroDetail: string;
  icon: React.ElementType;
}[] = [
  {
    value: 'muscle-gain',
    label: 'Build Muscle',
    description: 'Caloric surplus to maximize muscle growth',
    macroDetail: 'High protein, moderate carbs',
    icon: Dumbbell,
  },
  {
    value: 'fat-loss',
    label: 'Lose Fat',
    description: 'Caloric deficit while preserving muscle mass',
    macroDetail: 'High protein, lower carbs',
    icon: TrendingDown,
  },
  {
    value: 'maintenance',
    label: 'Maintain Weight',
    description: 'Balanced nutrition at maintenance calories',
    macroDetail: 'Balanced macros',
    icon: Scale,
  },
  {
    value: 'recomposition',
    label: 'Body Recomposition',
    description: 'Build muscle while losing fat simultaneously',
    macroDetail: 'High protein, moderate deficit',
    icon: RefreshCw,
  },
];

export function StepGoal({ goal, setGoal }: StepGoalProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">What's your primary goal?</h3>
        <p className="text-sm text-muted-foreground">
          We'll optimize your nutrition plan based on your goal
        </p>
      </div>

      <RadioGroup
        value={goal}
        onValueChange={(value) => setGoal(value as FitnessGoal)}
        className="grid gap-3"
      >
        {goalOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = goal === option.value;
          
          return (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <div 
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">{option.label}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{option.description}</p>
                    <p className="text-xs text-primary mt-1">{option.macroDetail}</p>
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
