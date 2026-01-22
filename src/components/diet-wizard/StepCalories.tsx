import { Flame, Calculator, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TDEEResult } from '@/utils/tdeeCalculator';
import { FitnessGoal } from '@/types/diet';

interface StepCaloriesProps {
  calorieTarget: string;
  setCalorieTarget: (value: string) => void;
  customCalories: string;
  setCustomCalories: (value: string) => void;
  tdeeResult?: TDEEResult | null;
  goal?: FitnessGoal;
}

const presetCalorieOptions = [
  { value: '1500', label: '1,500 kcal', description: 'Weight loss - moderate deficit' },
  { value: '2000', label: '2,000 kcal', description: 'Maintenance for most adults' },
  { value: '2500', label: '2,500 kcal', description: 'Muscle gain - slight surplus' },
  { value: '3000', label: '3,000 kcal', description: 'Bulking - significant surplus' },
];

const goalDescriptions: Record<FitnessGoal, string> = {
  'muscle-gain': 'Includes a 300 kcal surplus for muscle building',
  'fat-loss': 'Includes a 500 kcal deficit for fat loss',
  'maintenance': 'Matches your daily energy needs',
  'recomposition': 'Slight deficit to build muscle while losing fat',
};

export function StepCalories({ 
  calorieTarget, 
  setCalorieTarget, 
  customCalories, 
  setCustomCalories,
  tdeeResult,
  goal
}: StepCaloriesProps) {
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

      {/* TDEE Summary Card */}
      {tdeeResult && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Personalized Calculation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{tdeeResult.bmr}</p>
                <p className="text-xs text-muted-foreground">BMR</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{tdeeResult.tdee}</p>
                <p className="text-xs text-muted-foreground">TDEE</p>
              </div>
              <div className="col-span-2 sm:col-span-2 border-l border-primary/20 pl-4">
                <p className="text-2xl font-bold text-primary">{tdeeResult.suggestedCalories}</p>
                <p className="text-xs text-muted-foreground">Recommended</p>
              </div>
            </div>
            {goal && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {goalDescriptions[goal]}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <RadioGroup
        value={calorieTarget}
        onValueChange={setCalorieTarget}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Suggested Option (if TDEE available) */}
        {tdeeResult && (
          <Label
            htmlFor="calories-suggested"
            className="cursor-pointer col-span-1 sm:col-span-2"
          >
            <Card
              className={`transition-all duration-200 hover:border-primary ${
                calorieTarget === 'suggested' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="suggested" id="calories-suggested" />
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg flex items-center gap-2">
                    {tdeeResult.suggestedCalories.toLocaleString()} kcal
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>
                  Calculated for your goal based on your profile • {tdeeResult.macros.protein}g protein, {tdeeResult.macros.carbs}g carbs, {tdeeResult.macros.fat}g fat
                </CardDescription>
              </CardContent>
            </Card>
          </Label>
        )}

        {/* Preset Options */}
        {presetCalorieOptions.map((option) => (
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
                  <Flame className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{option.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          </Label>
        ))}

        {/* Custom Option */}
        <Label
          htmlFor="calories-custom"
          className="cursor-pointer"
        >
          <Card
            className={`transition-all duration-200 hover:border-primary ${
              calorieTarget === 'custom' ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="custom" id="calories-custom" />
                <Calculator className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Custom</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>Enter your own target</CardDescription>
            </CardContent>
          </Card>
        </Label>
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
