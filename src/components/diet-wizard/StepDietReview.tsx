import { 
  FitnessGoal, DietType, CuisineType, UserProfile,
  GOAL_LABELS, DIET_TYPE_LABELS, CUISINE_LABELS, RESTRICTION_LABELS, DietaryRestriction 
} from '@/types/diet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, Flame, UtensilsCrossed, Clock, Globe, 
  ShieldAlert, User, Calculator, CheckCircle2 
} from 'lucide-react';

interface StepDietReviewProps {
  goal: FitnessGoal | '';
  calorieTarget: number;
  dietType: DietType | '';
  restrictions: string[];
  mealsPerDay: string;
  cuisine: CuisineType;
  profile?: UserProfile;
  bmr: number | null;
  tdee: number | null;
}

export function StepDietReview({ 
  goal, 
  calorieTarget, 
  dietType, 
  restrictions, 
  mealsPerDay,
  cuisine,
  profile,
  bmr,
  tdee,
}: StepDietReviewProps) {
  const reviewItems = [
    {
      icon: Target,
      label: 'Goal',
      value: goal ? GOAL_LABELS[goal] : 'Not set',
    },
    {
      icon: Flame,
      label: 'Daily Calories',
      value: `${calorieTarget.toLocaleString()} cal`,
    },
    {
      icon: UtensilsCrossed,
      label: 'Diet Style',
      value: dietType ? DIET_TYPE_LABELS[dietType] : 'Not set',
    },
    {
      icon: Clock,
      label: 'Meals Per Day',
      value: `${mealsPerDay} meals`,
    },
    {
      icon: Globe,
      label: 'Cuisine',
      value: CUISINE_LABELS[cuisine],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold">Review Your Plan</h3>
        <p className="text-sm text-muted-foreground">
          Confirm your selections before generating
        </p>
      </div>

      {/* Profile Summary */}
      {profile && (profile.name || profile.gender) && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Profile</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {profile.name && <Badge variant="outline">{profile.name}</Badge>}
              {profile.gender && <Badge variant="outline" className="capitalize">{profile.gender}</Badge>}
              {profile.age && <Badge variant="outline">{profile.age} years</Badge>}
              {profile.weight && (
                <Badge variant="outline">
                  {profile.weight} {profile.weightUnit || 'kg'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TDEE Summary */}
      {bmr && tdee && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Metabolic Profile</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">BMR</p>
                <p className="text-lg font-bold">{bmr.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">TDEE</p>
                <p className="text-lg font-bold text-primary">{tdee.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Details */}
      <div className="grid gap-3 sm:grid-cols-2">
        {reviewItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Restrictions */}
      {restrictions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-sm">Restrictions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {restrictions.map((r) => (
                <Badge key={r} variant="secondary">
                  {RESTRICTION_LABELS[r as DietaryRestriction] || r}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
