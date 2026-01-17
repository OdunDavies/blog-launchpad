import { Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Meal, Food } from '@/types/diet';

interface MealCardProps {
  meal: Meal;
  isEditing: boolean;
  onRemoveFood?: (foodIndex: number) => void;
}

export function MealCard({ meal, isEditing, onRemoveFood }: MealCardProps) {
  const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = meal.foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = meal.foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = meal.foods.reduce((sum, food) => sum + food.fat, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{meal.name}</CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-3 h-3" />
            {meal.time}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">{totalCalories} kcal</Badge>
          <Badge variant="outline" className="text-xs">P: {totalProtein}g</Badge>
          <Badge variant="outline" className="text-xs">C: {totalCarbs}g</Badge>
          <Badge variant="outline" className="text-xs">F: {totalFat}g</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-2">
          {meal.foods.map((food, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{food.name}</p>
                <p className="text-xs text-muted-foreground">{food.portion}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-muted-foreground">
                  <span>{food.calories} kcal</span>
                </div>
                {isEditing && onRemoveFood && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveFood(index)}
                  >
                    <Trash2 className="w-3 h-3" />
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
