import { Meal, Food } from '@/types/diet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MealCardProps {
  meal: Meal;
  isEditing?: boolean;
  onRemoveFood?: (foodIndex: number) => void;
}

// Calculate total macros for a meal
function getMealTotals(foods: Food[]) {
  return foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function MealCard({ meal, isEditing = false, onRemoveFood }: MealCardProps) {
  const totals = getMealTotals(meal.foods);

  return (
    <Card>
      <CardHeader className="pb-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{meal.name}</CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{meal.time}</span>
          </div>
        </div>
        
        {/* Macro badges */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="secondary" className="text-xs font-normal">
            <Flame className="w-3 h-3 mr-1" />
            {totals.calories} cal
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            P: {totals.protein}g
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            C: {totals.carbs}g
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            F: {totals.fat}g
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-2">
          {meal.foods.map((food, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{food.name}</p>
                <p className="text-xs text-muted-foreground">{food.portion}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {food.calories} cal
                </span>
                {isEditing && onRemoveFood && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRemoveFood(index)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
