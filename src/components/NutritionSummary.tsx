import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface NutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
}

export function NutritionSummary({ 
  totalCalories, 
  totalProtein, 
  totalCarbs, 
  totalFat,
  targetCalories 
}: NutritionSummaryProps) {
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  
  // Calculate macro percentages
  const totalMacroCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
  const proteinPercent = totalMacroCalories > 0 ? ((totalProtein * 4) / totalMacroCalories) * 100 : 0;
  const carbsPercent = totalMacroCalories > 0 ? ((totalCarbs * 4) / totalMacroCalories) * 100 : 0;
  const fatPercent = totalMacroCalories > 0 ? ((totalFat * 9) / totalMacroCalories) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Calories</span>
            <span className="text-muted-foreground">
              {totalCalories} / {targetCalories} kcal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Beef className="w-4 h-4 mx-auto mb-1 text-red-500" />
            <p className="text-lg font-semibold">{totalProtein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-xs text-muted-foreground">{proteinPercent.toFixed(0)}%</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Wheat className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-semibold">{totalCarbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-xs text-muted-foreground">{carbsPercent.toFixed(0)}%</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Droplet className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-semibold">{totalFat}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-xs text-muted-foreground">{fatPercent.toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
