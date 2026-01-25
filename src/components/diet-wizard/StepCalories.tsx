import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Flame, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { DietGoal } from '@/types/diet';

interface StepCaloriesProps {
  dailyCalories: number;
  setDailyCalories: (value: number) => void;
  goal: DietGoal | '';
}

export function StepCalories({ dailyCalories, setDailyCalories, goal }: StepCaloriesProps) {
  const { tdee, isProfileComplete } = useProfile();

  // Calculate suggested calories based on goal
  const getSuggestedCalories = () => {
    if (!tdee) return null;
    
    switch (goal) {
      case 'muscle_building':
        return Math.round(tdee * 1.1); // +10% surplus
      case 'fat_loss':
        return Math.round(tdee * 0.8); // -20% deficit
      case 'maintenance':
        return tdee;
      case 'endurance':
        return Math.round(tdee * 1.15); // +15% for high activity
      default:
        return tdee;
    }
  };

  const suggestedCalories = getSuggestedCalories();

  const applyTdee = (modifier: number) => {
    if (tdee) {
      setDailyCalories(Math.round(tdee * modifier));
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold">Set your daily calorie target</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isProfileComplete 
            ? "Based on your profile, we've calculated your TDEE"
            : "Complete your profile for personalized recommendations"}
        </p>
      </div>

      {/* TDEE Display */}
      {tdee && (
        <Card className="bg-muted/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Your TDEE: {tdee.toLocaleString()} calories</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Daily Energy Expenditure
                </p>
              </div>
            </div>
            
            {suggestedCalories && goal && (
              <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-background rounded-lg">
                <p className="text-xs sm:text-sm">
                  <span className="font-medium">Suggested for {goal.replace('_', ' ')}:</span>{' '}
                  <span className="text-primary font-bold">{suggestedCalories.toLocaleString()} calories</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Adjustment Buttons */}
      {tdee && (
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm text-muted-foreground">Quick adjustments from TDEE:</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(0.8)}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              -20%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(1)}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              TDEE
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(1.1)}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              +10%
            </Button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="space-y-2">
        <Label htmlFor="calories" className="flex items-center gap-2 text-sm">
          <Calculator className="w-4 h-4" />
          Daily Calorie Target
        </Label>
        <Input
          id="calories"
          type="number"
          placeholder="e.g., 2000"
          min="1200"
          max="6000"
          step="50"
          value={dailyCalories || ''}
          onChange={(e) => setDailyCalories(parseInt(e.target.value) || 0)}
          className="text-base sm:text-lg h-10 sm:h-11"
        />
        <p className="text-xs text-muted-foreground">
          Recommended range: 1,200 - 6,000 calories
        </p>
      </div>

      {/* Macro Preview */}
      {dailyCalories > 0 && goal && (
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="font-medium text-sm mb-2">Estimated Daily Macros:</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-primary">
                  {Math.round(dailyCalories * (goal === 'fat_loss' ? 0.35 : goal === 'muscle_building' ? 0.3 : 0.25) / 4)}g
                </p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-primary">
                  {Math.round(dailyCalories * (goal === 'endurance' ? 0.55 : goal === 'fat_loss' ? 0.3 : 0.4) / 4)}g
                </p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-primary">
                  {Math.round(dailyCalories * (goal === 'fat_loss' ? 0.35 : 0.3) / 9)}g
                </p>
                <p className="text-xs text-muted-foreground">Fats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
