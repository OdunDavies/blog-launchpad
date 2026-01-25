import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Coffee, Sun, Moon, Cookie } from 'lucide-react';

interface StepMealsProps {
  mealsPerDay: string;
  setMealsPerDay: (value: string) => void;
}

const mealOptions = [
  { 
    value: '3', 
    label: '3 Meals', 
    description: 'Breakfast, Lunch, Dinner',
    icon: Coffee,
  },
  { 
    value: '4', 
    label: '4 Meals', 
    description: '3 meals + 1 snack',
    icon: Sun,
  },
  { 
    value: '5', 
    label: '5 Meals', 
    description: '3 meals + 2 snacks',
    icon: Cookie,
  },
  { 
    value: '6', 
    label: '6 Meals', 
    description: '3 meals + 3 snacks',
    icon: Moon,
  },
];

export function StepMeals({ mealsPerDay, setMealsPerDay }: StepMealsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">How Many Meals Per Day?</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred eating frequency
        </p>
      </div>

      <RadioGroup
        value={mealsPerDay}
        onValueChange={setMealsPerDay}
        className="grid gap-3 sm:grid-cols-2"
      >
        {mealOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = mealsPerDay === option.value;
          
          return (
            <Label
              key={option.value}
              htmlFor={`meals-${option.value}`}
              className="cursor-pointer"
            >
              <Card
                className={`transition-all hover:border-primary ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <RadioGroupItem value={option.value} id={`meals-${option.value}`} className="sr-only" />
                  <div 
                    className={`p-2.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        More frequent meals can help manage hunger and maintain energy levels
      </p>
    </div>
  );
}
