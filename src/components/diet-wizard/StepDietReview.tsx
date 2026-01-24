import { ClipboardList, Target, User, Flame, Salad, AlertCircle, UtensilsCrossed, Activity, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FitnessGoal, UserProfile, CuisineType } from '@/types/diet';
import { TDEEResult } from '@/utils/tdeeCalculator';

interface StepDietReviewProps {
  calorieTarget: string;
  customCalories: string;
  dietType: string;
  restrictions: string[];
  mealsPerDay: string;
  goal?: FitnessGoal;
  profile?: UserProfile;
  tdeeResult?: TDEEResult | null;
  cuisine?: CuisineType;
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
  'halal': 'Halal',
  'kosher': 'Kosher',
};

const goalLabels: Record<FitnessGoal, string> = {
  'muscle-gain': 'Muscle Gain',
  'fat-loss': 'Fat Loss',
  'maintenance': 'Maintenance',
  'recomposition': 'Body Recomposition',
};

const activityLabels: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  'very-active': 'Extremely Active',
};

const cuisineLabels: Record<CuisineType, string> = {
  'international': 'International Mix',
  'nigerian': 'Nigerian',
  'west-african': 'West African',
};

export function StepDietReview({ 
  calorieTarget, 
  customCalories, 
  dietType, 
  restrictions, 
  mealsPerDay,
  goal,
  profile,
  tdeeResult,
  cuisine
}: StepDietReviewProps) {
  const getDisplayCalories = () => {
    if (calorieTarget === 'suggested' && tdeeResult) {
      return tdeeResult.suggestedCalories.toLocaleString();
    }
    if (calorieTarget === 'custom') {
      return parseInt(customCalories).toLocaleString();
    }
    return parseInt(calorieTarget).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Review your plan</h3>
        <p className="text-muted-foreground">Confirm your settings before generating</p>
      </div>

      <div className="grid gap-4 max-w-lg mx-auto">
        {goal && (
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Fitness Goal</p>
                <p className="font-semibold">{goalLabels[goal]}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {profile && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Your Profile</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Age: </span><span className="font-medium">{profile.age}y</span></div>
                <div><span className="text-muted-foreground">Gender: </span><span className="font-medium capitalize">{profile.gender}</span></div>
                <div><span className="text-muted-foreground">Weight: </span><span className="font-medium">{profile.weight}{profile.weightUnit}</span></div>
                <div><span className="text-muted-foreground">Height: </span><span className="font-medium">{profile.heightUnit === 'ft' ? `${profile.height}'${profile.heightInches || 0}"` : `${profile.height}cm`}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{activityLabels[profile.activityLevel]}</span>
                <span className="text-muted-foreground">• {profile.trainingDays} training days/week</span>
              </div>
            </CardContent>
          </Card>
        )}

        {tdeeResult && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-lg font-bold text-primary">{tdeeResult.bmr}</p><p className="text-xs text-muted-foreground">BMR</p></div>
                <div><p className="text-lg font-bold text-primary">{tdeeResult.tdee}</p><p className="text-xs text-muted-foreground">TDEE</p></div>
                <div><p className="text-lg font-bold text-primary">{tdeeResult.suggestedCalories}</p><p className="text-xs text-muted-foreground">Target</p></div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 rounded-lg bg-primary/10"><Flame className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Daily Calories</p>
              <p className="font-semibold">{getDisplayCalories()} kcal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 rounded-lg bg-primary/10"><Salad className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Diet Style</p>
              <p className="font-semibold">{dietTypeLabels[dietType]}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-2 rounded-lg bg-primary/10"><UtensilsCrossed className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Meals Per Day</p>
              <p className="font-semibold">{mealsPerDay} meals</p>
            </div>
          </CardContent>
        </Card>

        {cuisine && (
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="p-2 rounded-lg bg-primary/10"><Globe className="w-5 h-5 text-primary" /></div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Cuisine Preference</p>
                <p className="font-semibold">{cuisineLabels[cuisine]}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {restrictions.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 rounded-lg bg-primary/10"><AlertCircle className="w-5 h-5 text-primary" /></div>
                <p className="text-sm text-muted-foreground">Dietary Restrictions</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {restrictions.map((r) => <Badge key={r} variant="secondary">{restrictionLabels[r] || r}</Badge>)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
