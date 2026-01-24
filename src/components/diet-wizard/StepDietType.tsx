import { DietType, DIET_TYPE_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Scale, Beef, Wheat, Flame, Leaf, Salad } from 'lucide-react';

interface StepDietTypeProps {
  dietType: DietType | '';
  setDietType: (value: DietType) => void;
}

const dietTypeOptions: { value: DietType; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Moderate protein, carbs, and fats for overall health',
    icon: Scale,
  },
  {
    value: 'high_protein',
    label: 'High Protein',
    description: 'Emphasizes protein for muscle building and satiety',
    icon: Beef,
  },
  {
    value: 'low_carb',
    label: 'Low Carb',
    description: 'Reduced carbohydrates, higher protein and fats',
    icon: Wheat,
  },
  {
    value: 'keto',
    label: 'Keto',
    description: 'Very low carb, high fat for ketosis',
    icon: Flame,
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based with eggs and dairy',
    icon: Leaf,
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: '100% plant-based, no animal products',
    icon: Salad,
  },
];

export function StepDietType({ dietType, setDietType }: StepDietTypeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Choose your diet approach</h3>
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
          return (
            <Label
              key={option.value}
              htmlFor={`diet-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary h-full ${
                  dietType === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <RadioGroupItem value={option.value} id={`diet-${option.value}`} className="sr-only" />
                  <div className={`p-2 rounded-lg shrink-0 ${dietType === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
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
