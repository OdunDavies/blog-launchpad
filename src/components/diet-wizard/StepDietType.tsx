import { Salad, Beef, Leaf, Fish, Scale } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepDietTypeProps {
  dietType: string;
  setDietType: (value: string) => void;
}

const dietOptions = [
  { 
    value: 'balanced', 
    label: 'Balanced', 
    description: 'Equal macros with variety',
    icon: Scale
  },
  { 
    value: 'high-protein', 
    label: 'High Protein', 
    description: 'For muscle building and satiety',
    icon: Beef
  },
  { 
    value: 'low-carb', 
    label: 'Low Carb', 
    description: 'Reduced carbs, higher fats',
    icon: Salad
  },
  { 
    value: 'mediterranean', 
    label: 'Mediterranean', 
    description: 'Heart-healthy, whole foods',
    icon: Fish
  },
  { 
    value: 'vegetarian', 
    label: 'Vegetarian', 
    description: 'No meat, includes dairy & eggs',
    icon: Leaf
  },
  { 
    value: 'vegan', 
    label: 'Vegan', 
    description: 'Plant-based only',
    icon: Leaf
  },
];

export function StepDietType({ dietType, setDietType }: StepDietTypeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Salad className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Choose your diet style</h3>
        <p className="text-muted-foreground">This determines your macro distribution</p>
      </div>

      <RadioGroup
        value={dietType}
        onValueChange={setDietType}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {dietOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Label
              key={option.value}
              htmlFor={`diet-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all duration-200 hover:border-primary ${
                  dietType === option.value ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={option.value} id={`diet-${option.value}`} />
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
