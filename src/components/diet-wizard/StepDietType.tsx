import { DietType } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Apple, Beef, Wheat, Fish, Leaf, Carrot, UtensilsCrossed } from 'lucide-react';

interface StepDietTypeProps {
  dietType: DietType | '';
  setDietType: (value: DietType) => void;
}

const dietTypeOptions: { 
  value: DietType; 
  label: string; 
  description: string; 
  icon: React.ElementType;
}[] = [
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Flexible eating with all food groups',
    icon: Apple,
  },
  {
    value: 'high-protein',
    label: 'High Protein',
    description: 'Prioritize protein for muscle building',
    icon: Beef,
  },
  {
    value: 'low-carb',
    label: 'Low Carb',
    description: 'Reduce carbs for fat loss',
    icon: Wheat,
  },
  {
    value: 'mediterranean',
    label: 'Mediterranean',
    description: 'Heart-healthy fats and whole foods',
    icon: Fish,
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based with dairy and eggs',
    icon: Leaf,
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: '100% plant-based nutrition',
    icon: Carrot,
  },
];

export function StepDietType({ dietType, setDietType }: StepDietTypeProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">Choose Your Diet Approach</h3>
        <p className="text-sm text-muted-foreground">
          Select the eating style that fits your preferences
        </p>
      </div>

      <RadioGroup
        value={dietType}
        onValueChange={(value) => setDietType(value as DietType)}
        className="grid gap-3 sm:grid-cols-2"
      >
        {dietTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = dietType === option.value;
          
          return (
            <Label
              key={option.value}
              htmlFor={`diet-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary h-full ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-center gap-3 p-3 sm:p-4">
                  <RadioGroupItem value={option.value} id={`diet-${option.value}`} className="sr-only" />
                  <div 
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">{option.label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{option.description}</p>
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
