import { CuisinePreference, CUISINE_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, MapPin } from 'lucide-react';

interface StepCuisineProps {
  cuisine: CuisinePreference | '';
  setCuisine: (value: CuisinePreference) => void;
}

const cuisineOptions: { value: CuisinePreference; label: string; description: string; examples: string[] }[] = [
  {
    value: 'international',
    label: 'International',
    description: 'Global cuisine with variety',
    examples: ['Grilled chicken', 'Salmon', 'Quinoa', 'Greek yogurt'],
  },
  {
    value: 'nigerian',
    label: 'Nigerian',
    description: 'Traditional Nigerian dishes',
    examples: ['Jollof rice', 'Egusi soup', 'Suya', 'Moi moi'],
  },
  {
    value: 'west_african',
    label: 'West African',
    description: 'West African regional cuisine',
    examples: ['Fufu', 'Groundnut soup', 'Kelewele', 'Waakye'],
  },
];

export function StepCuisine({ cuisine, setCuisine }: StepCuisineProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Choose your cuisine preference</h3>
        <p className="text-sm text-muted-foreground">
          Your meals will feature foods from this cuisine
        </p>
      </div>

      <RadioGroup
        value={cuisine}
        onValueChange={(value) => setCuisine(value as CuisinePreference)}
        className="grid gap-3"
      >
        {cuisineOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`cuisine-${option.value}`}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all hover:border-primary ${
                cuisine === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value={option.value} id={`cuisine-${option.value}`} className="sr-only" />
                  <div className={`p-2 rounded-lg shrink-0 ${cuisine === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {option.value === 'international' ? (
                      <Globe className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {option.examples.map((food) => (
                        <span
                          key={food}
                          className="text-xs px-2 py-0.5 bg-muted rounded-full"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
