import { UtensilsCrossed } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepMealsProps {
  mealsPerDay: string;
  setMealsPerDay: (value: string) => void;
}

const mealOptions = [
  { value: '3', label: '3 Meals', description: 'Traditional breakfast, lunch, dinner' },
  { value: '4', label: '4 Meals', description: '3 main meals + 1 snack' },
  { value: '5', label: '5 Meals', description: '3 main meals + 2 snacks' },
  { value: '6', label: '6 Meals', description: 'Frequent eating for muscle gain' },
];

export function StepMeals({ mealsPerDay, setMealsPerDay }: StepMealsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">How many meals per day?</h3>
        <p className="text-muted-foreground">Choose what fits your lifestyle</p>
      </div>

      <RadioGroup
        value={mealsPerDay}
        onValueChange={setMealsPerDay}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
      >
        {mealOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`meals-${option.value}`}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all duration-200 hover:border-primary ${
                mealsPerDay === option.value ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.value} id={`meals-${option.value}`} />
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{option.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
