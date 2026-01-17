import { Flame, Calculator } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface StepCaloriesProps {
  calorieTarget: string;
  setCalorieTarget: (value: string) => void;
  customCalories: string;
  setCustomCalories: (value: string) => void;
}

const calorieOptions = [
  { value: '1500', label: '1,500 kcal', description: 'Weight loss - moderate deficit' },
  { value: '2000', label: '2,000 kcal', description: 'Maintenance for most adults' },
  { value: '2500', label: '2,500 kcal', description: 'Muscle gain - slight surplus' },
  { value: '3000', label: '3,000 kcal', description: 'Bulking - significant surplus' },
  { value: 'custom', label: 'Custom', description: 'Enter your own target' },
];

export function StepCalories({ calorieTarget, setCalorieTarget, customCalories, setCustomCalories }: StepCaloriesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Flame className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">What's your daily calorie target?</h3>
        <p className="text-muted-foreground">We'll build your meal plan around this</p>
      </div>

      <RadioGroup
        value={calorieTarget}
        onValueChange={setCalorieTarget}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {calorieOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`calories-${option.value}`}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all duration-200 hover:border-primary ${
                calorieTarget === option.value ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.value} id={`calories-${option.value}`} />
                  {option.value === 'custom' ? (
                    <Calculator className="w-5 h-5 text-primary" />
                  ) : (
                    <Flame className="w-5 h-5 text-primary" />
                  )}
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

      {calorieTarget === 'custom' && (
        <div className="max-w-xs mx-auto">
          <Label htmlFor="custom-calories" className="text-sm text-muted-foreground">
            Enter your target (kcal)
          </Label>
          <Input
            id="custom-calories"
            type="number"
            placeholder="e.g., 1800"
            value={customCalories}
            onChange={(e) => setCustomCalories(e.target.value)}
            className="mt-2"
            min="1000"
            max="5000"
          />
        </div>
      )}
    </div>
  );
}
