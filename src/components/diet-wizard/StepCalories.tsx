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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Set your daily calorie target</h3>
        <p className="text-sm text-muted-foreground">
          {isProfileComplete 
            ? "Based on your profile, we've calculated your TDEE"
            : "Complete your profile for personalized recommendations"}
        </p>
      </div>

      {/* TDEE Display */}
      {tdee && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">Your TDEE: {tdee.toLocaleString()} calories</p>
                <p className="text-sm text-muted-foreground">
                  Total Daily Energy Expenditure
                </p>
              </div>
            </div>
            
            {suggestedCalories && goal && (
              <div className="mt-3 p-3 bg-background rounded-lg">
                <p className="text-sm">
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
          <Label className="text-sm text-muted-foreground">Quick adjustments from TDEE:</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(0.8)}
              className="flex items-center gap-1"
            >
              <TrendingDown className="w-4 h-4" />
              -20%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(1)}
              className="flex items-center gap-1"
            >
              <Minus className="w-4 h-4" />
              TDEE
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyTdee(1.1)}
              className="flex items-center gap-1"
            >
              <TrendingUp className="w-4 h-4" />
              +10%
            </Button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="space-y-2">
        <Label htmlFor="calories" className="flex items-center gap-2">
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
          className="text-lg"
        />
        <p className="text-xs text-muted-foreground">
          Recommended range: 1,200 - 6,000 calories
        </p>
      </div>

      {/* Macro Preview */}
      {dailyCalories > 0 && goal && (
        <Card>
          <CardContent className="p-4">
            <p className="font-medium mb-2">Estimated Daily Macros:</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(dailyCalories * (goal === 'fat_loss' ? 0.35 : goal === 'muscle_building' ? 0.3 : 0.25) / 4)}g
                </p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(dailyCalories * (goal === 'endurance' ? 0.55 : goal === 'fat_loss' ? 0.3 : 0.4) / 4)}g
                </p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
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
