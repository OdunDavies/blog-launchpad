import { ClipboardCheck, Flame, Salad, AlertCircle, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StepDietReviewProps {
  calorieTarget: string;
  customCalories: string;
  dietType: string;
  restrictions: string[];
  mealsPerDay: string;
}

const dietTypeLabels: Record<string, string> = {
  balanced: 'Balanced',
  'high-protein': 'High Protein',
  'low-carb': 'Low Carb',
  mediterranean: 'Mediterranean',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

const restrictionLabels: Record<string, string> = {
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
  'shellfish-free': 'Shellfish-Free',
  'egg-free': 'Egg-Free',
  'soy-free': 'Soy-Free',
  halal: 'Halal',
  kosher: 'Kosher',
};

export function StepDietReview({ 
  calorieTarget, 
  customCalories, 
  dietType, 
  restrictions, 
  mealsPerDay 
}: StepDietReviewProps) {
  const displayCalories = calorieTarget === 'custom' ? customCalories : calorieTarget;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <ClipboardCheck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Review Your Preferences</h3>
        <p className="text-muted-foreground">Make sure everything looks correct before generating</p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Daily Calories</p>
              <p className="font-medium">{displayCalories} kcal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Salad className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Diet Style</p>
              <p className="font-medium">{dietTypeLabels[dietType] || dietType}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Meals Per Day</p>
              <p className="font-medium">{mealsPerDay} Meals</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Dietary Restrictions</p>
              {restrictions.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {restrictions.map((restriction) => (
                    <Badge key={restriction} variant="secondary" className="text-xs">
                      {restrictionLabels[restriction] || restriction}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="font-medium">None</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
