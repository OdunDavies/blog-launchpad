import {
  DietGoal,
  DietType,
  CuisinePreference,
  DietaryRestriction,
  MealType,
  GOAL_LABELS,
  DIET_TYPE_LABELS,
  CUISINE_LABELS,
  RESTRICTION_LABELS,
  MEAL_TYPE_LABELS,
} from '@/types/diet';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Flame, Utensils, Globe, AlertTriangle, UtensilsCrossed, User } from 'lucide-react';

interface StepReviewProps {
  goal: DietGoal | '';
  dailyCalories: number;
  dietType: DietType | '';
  restrictions: DietaryRestriction[];
  mealTypes: MealType[];
  cuisine: CuisinePreference | '';
}

export function StepReview({
  goal,
  dailyCalories,
  dietType,
  restrictions,
  mealTypes,
  cuisine,
}: StepReviewProps) {
  const { profile, tdee } = useProfile();

  // Calculate macros based on goal
  const getMacros = () => {
    if (!dailyCalories || !goal) return null;
    
    const distributions: Record<DietGoal, { protein: number; carbs: number; fats: number }> = {
      muscle_building: { protein: 30, carbs: 40, fats: 30 },
      fat_loss: { protein: 35, carbs: 30, fats: 35 },
      maintenance: { protein: 25, carbs: 45, fats: 30 },
      endurance: { protein: 20, carbs: 55, fats: 25 },
    };

    const dist = distributions[goal];
    return {
      protein: Math.round((dailyCalories * dist.protein / 100) / 4),
      carbs: Math.round((dailyCalories * dist.carbs / 100) / 4),
      fats: Math.round((dailyCalories * dist.fats / 100) / 9),
    };
  };

  const macros = getMacros();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Review your diet plan settings</h3>
        <p className="text-sm text-muted-foreground">
          Confirm everything looks good before generating
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Goal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{goal ? GOAL_LABELS[goal] : 'Not set'}</p>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{dailyCalories.toLocaleString()} kcal</p>
            {tdee && (
              <p className="text-xs text-muted-foreground">
                {dailyCalories < tdee ? `${Math.round((1 - dailyCalories/tdee) * 100)}% below` : dailyCalories > tdee ? `${Math.round((dailyCalories/tdee - 1) * 100)}% above` : 'At'} TDEE
              </p>
            )}
          </CardContent>
        </Card>

        {/* Diet Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Diet Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{dietType ? DIET_TYPE_LABELS[dietType] : 'Not set'}</p>
          </CardContent>
        </Card>

        {/* Cuisine */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Cuisine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{cuisine ? CUISINE_LABELS[cuisine] : 'Not set'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Macros Summary */}
      {macros && (
        <Card className="bg-primary/5 border-primary">
          <CardContent className="pt-4">
            <p className="font-medium mb-3">Daily Macro Targets</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{macros.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{macros.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{macros.fats}g</p>
                <p className="text-xs text-muted-foreground">Fats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Meals Per Day ({mealTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {mealTypes.map((meal) => (
              <Badge key={meal} variant="secondary">
                {MEAL_TYPE_LABELS[meal]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restrictions */}
      {restrictions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Dietary Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {restrictions.map((restriction) => (
                <Badge key={restriction} variant="outline">
                  {RESTRICTION_LABELS[restriction]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Info */}
      {profile.name && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center gap-3 pt-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{profile.name}'s Diet Plan</p>
              <p className="text-sm text-muted-foreground">
                Personalized for your profile
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
