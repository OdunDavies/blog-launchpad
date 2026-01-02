import { ClipboardCheck, Calendar, User, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { muscleGroups, MuscleGroup } from '@/data/exercises';

interface StepReviewProps {
  splitDays: string;
  gender: string;
  goal: string;
  targetMuscles: MuscleGroup[];
}

const goalLabels: Record<string, string> = {
  strength: 'Build Strength',
  hypertrophy: 'Muscle Growth',
  endurance: 'Endurance',
  'weight-loss': 'Weight Loss',
};

export function StepReview({ splitDays, gender, goal, targetMuscles }: StepReviewProps) {
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
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Training Schedule</p>
              <p className="font-medium">{splitDays} Days per Week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Profile</p>
              <p className="font-medium capitalize">{gender}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Training Goal</p>
              <p className="font-medium">{goalLabels[goal] || goal}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Focus Areas</p>
              {targetMuscles.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {targetMuscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="text-xs">
                      {muscleGroups.find(m => m.id === muscle)?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="font-medium">Full Body (Balanced)</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
