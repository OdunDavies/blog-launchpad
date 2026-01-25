import { DietType, RegionalFocus, DIET_TYPE_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Scale, Beef, Wheat, Flame, Leaf, Salad, Globe, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface StepDietTypeProps {
  dietType: DietType | '';
  setDietType: (value: DietType) => void;
  regionalFocus: RegionalFocus;
  setRegionalFocus: (value: RegionalFocus) => void;
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

const regionalFocusOptions: { value: RegionalFocus; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'balanced',
    label: 'Balanced Global',
    description: 'Mix of international and African foods',
    icon: Globe,
  },
  {
    value: 'african',
    label: 'African Focus',
    description: 'Prioritize Nigerian & West African dishes',
    icon: MapPin,
  },
];

export function StepDietType({ dietType, setDietType, regionalFocus, setRegionalFocus }: StepDietTypeProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Choose your diet approach</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Select the eating style that fits your preferences
        </p>
      </div>

      <RadioGroup
        value={dietType}
        onValueChange={(value) => setDietType(value as DietType)}
        className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2"
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
                <CardContent className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
                  <RadioGroupItem value={option.value} id={`diet-${option.value}`} className="sr-only" />
                  <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${dietType === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      <Separator />

      {/* Regional Focus Toggle */}
      <div>
        <h4 className="text-sm font-medium mb-2">Food Preference</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Choose your preferred cuisine mix for variety
        </p>
        <RadioGroup
          value={regionalFocus}
          onValueChange={(value) => setRegionalFocus(value as RegionalFocus)}
          className="grid gap-2 grid-cols-2"
        >
          {regionalFocusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Label
                key={option.value}
                htmlFor={`regional-${option.value}`}
                className="cursor-pointer"
              >
                <Card
                  className={`transition-all hover:border-primary ${
                    regionalFocus === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                  }`}
                >
                  <CardContent className="flex items-center gap-2 p-3">
                    <RadioGroupItem value={option.value} id={`regional-${option.value}`} className="sr-only" />
                    <div className={`p-1.5 rounded-lg shrink-0 ${regionalFocus === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}
