import { MealType, MEAL_TYPE_LABELS } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Coffee, Cookie, UtensilsCrossed, Moon, Dumbbell } from 'lucide-react';

interface StepMealsProps {
  mealTypes: MealType[];
  setMealTypes: (value: MealType[]) => void;
}

const mealOptions: { value: MealType; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'breakfast', label: 'Breakfast', description: 'Morning fuel', icon: Coffee },
  { value: 'morning_snack', label: 'AM Snack', description: 'Mid-morning', icon: Cookie },
  { value: 'lunch', label: 'Lunch', description: 'Midday meal', icon: UtensilsCrossed },
  { value: 'afternoon_snack', label: 'PM Snack', description: 'Pre-dinner', icon: Cookie },
  { value: 'dinner', label: 'Dinner', description: 'Evening meal', icon: Moon },
  { value: 'evening_snack', label: 'Eve Snack', description: 'Night bite', icon: Cookie },
  { value: 'pre_workout', label: 'Pre-Workout', description: 'Before training', icon: Dumbbell },
  { value: 'post_workout', label: 'Post-Workout', description: 'Recovery', icon: Dumbbell },
];

export function StepMeals({ mealTypes, setMealTypes }: StepMealsProps) {
  const toggleMeal = (value: MealType) => {
    if (mealTypes.includes(value)) {
      setMealTypes(mealTypes.filter(m => m !== value));
    } else {
      setMealTypes([...mealTypes, value]);
    }
  };

  const selectPreset = (preset: 'basic' | 'standard' | 'athlete') => {
    switch (preset) {
      case 'basic':
        setMealTypes(['breakfast', 'lunch', 'dinner']);
        break;
      case 'standard':
        setMealTypes(['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner']);
        break;
      case 'athlete':
        setMealTypes(['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'pre_workout', 'post_workout', 'dinner']);
        break;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">How many meals per day?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Choose the meals you want in your plan
        </p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => selectPreset('basic')}
          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          3 Meals
        </button>
        <button
          onClick={() => selectPreset('standard')}
          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          5 Meals
        </button>
        <button
          onClick={() => selectPreset('athlete')}
          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          7 Meals
        </button>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {mealOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:border-primary ${
                mealTypes.includes(option.value) ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
              }`}
              onClick={() => toggleMeal(option.value)}
            >
              <CardContent className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3">
                <Checkbox
                  id={`meal-${option.value}`}
                  checked={mealTypes.includes(option.value)}
                  onCheckedChange={() => toggleMeal(option.value)}
                  className="shrink-0"
                />
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={`meal-${option.value}`} className="cursor-pointer font-medium text-xs sm:text-sm">
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground hidden sm:block">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mealTypes.length > 0 && (
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          {mealTypes.length} meal{mealTypes.length !== 1 ? 's' : ''} selected per day
        </p>
      )}
    </div>
  );
}
