import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';

interface NutritionSummaryProps {
  calories: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function NutritionSummary({ 
  calories, 
  targetCalories, 
  protein, 
  carbs, 
  fat 
}: NutritionSummaryProps) {
  const calorieProgress = Math.min((calories / targetCalories) * 100, 100);
  
  // Calculate percentages of total macros
  const totalMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);
  const proteinPercent = totalMacroCalories > 0 ? Math.round((protein * 4 / totalMacroCalories) * 100) : 0;
  const carbsPercent = totalMacroCalories > 0 ? Math.round((carbs * 4 / totalMacroCalories) * 100) : 0;
  const fatPercent = totalMacroCalories > 0 ? Math.round((fat * 9 / totalMacroCalories) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Calorie Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Daily Calories</span>
            </div>
            <span className="text-sm">
              <span className="font-bold">{calories.toLocaleString()}</span>
              <span className="text-muted-foreground"> / {targetCalories.toLocaleString()}</span>
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>

        {/* Macro Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Beef className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs text-muted-foreground">Protein</span>
            </div>
            <p className="text-lg font-bold">{protein}g</p>
            <p className="text-xs text-muted-foreground">{proteinPercent}%</p>
          </div>

          {/* Carbs */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wheat className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">Carbs</span>
            </div>
            <p className="text-lg font-bold">{carbs}g</p>
            <p className="text-xs text-muted-foreground">{carbsPercent}%</p>
          </div>

          {/* Fat */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Fat</span>
            </div>
            <p className="text-lg font-bold">{fat}g</p>
            <p className="text-xs text-muted-foreground">{fatPercent}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
