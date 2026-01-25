import { FitnessGoal } from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flame, Zap, Calculator, Sparkles } from 'lucide-react';

interface StepCaloriesProps {
  calorieTarget: string;
  setCalorieTarget: (value: string) => void;
  customCalories: string;
  setCustomCalories: (value: string) => void;
  goal: FitnessGoal | '';
  suggestedCalories: number | null;
  bmr: number | null;
  tdee: number | null;
}

const presetOptions = [
  { value: '1500', label: '1,500', description: 'Aggressive deficit' },
  { value: '2000', label: '2,000', description: 'Moderate intake' },
  { value: '2500', label: '2,500', description: 'Active lifestyle' },
  { value: '3000', label: '3,000', description: 'High activity/bulk' },
];

export function StepCalories({ 
  calorieTarget, 
  setCalorieTarget, 
  customCalories,
  setCustomCalories,
  goal,
  suggestedCalories,
  bmr,
  tdee,
}: StepCaloriesProps) {
  const getGoalDescription = () => {
    switch (goal) {
      case 'muscle-gain':
        return 'Surplus recommended (+10-15% above TDEE)';
      case 'fat-loss':
        return 'Deficit recommended (-15-20% below TDEE)';
      case 'maintenance':
        return 'Eat at your TDEE';
      case 'recomposition':
        return 'Slight deficit with high protein';
      default:
        return 'Select a goal first for recommendations';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Flame className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">Set Your Daily Calories</h3>
        <p className="text-sm text-muted-foreground">{getGoalDescription()}</p>
      </div>

      {/* TDEE Summary Card */}
      {bmr && tdee && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Your Metabolic Profile</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">BMR</p>
                <p className="text-lg font-bold">{bmr.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">TDEE</p>
                <p className="text-lg font-bold text-primary">{tdee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Suggested</p>
                <p className="text-lg font-bold text-primary">{suggestedCalories?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <RadioGroup
        value={calorieTarget}
        onValueChange={setCalorieTarget}
        className="grid gap-3"
      >
        {/* Suggested option */}
        {suggestedCalories && (
          <Label htmlFor="suggested" className="cursor-pointer">
            <Card
              className={`transition-all hover:border-primary ${
                calorieTarget === 'suggested' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
              }`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <RadioGroupItem value="suggested" id="suggested" className="sr-only" />
                <div 
                  className={`p-2.5 rounded-lg shrink-0 ${
                    calorieTarget === 'suggested' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{suggestedCalories.toLocaleString()} cal</p>
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Based on your profile and goal</p>
                </div>
              </CardContent>
            </Card>
          </Label>
        )}

        {/* Preset options */}
        <div className="grid grid-cols-2 gap-3">
          {presetOptions.map((option) => (
            <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
              <Card
                className={`transition-all hover:border-primary ${
                  calorieTarget === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <CardContent className="p-3 text-center">
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <p className="font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            </Label>
          ))}
        </div>

        {/* Custom option */}
        <Label htmlFor="custom" className="cursor-pointer">
          <Card
            className={`transition-all hover:border-primary ${
              calorieTarget === 'custom' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
            }`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <RadioGroupItem value="custom" id="custom" className="sr-only" />
              <div 
                className={`p-2.5 rounded-lg shrink-0 ${
                  calorieTarget === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Custom Amount</p>
                {calorieTarget === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Enter calories"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="mt-2 w-full"
                    min="1000"
                    max="6000"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </Label>
      </RadioGroup>
    </div>
  );
}
