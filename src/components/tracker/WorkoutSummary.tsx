import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, ListChecks, Trophy, Smile, Meh, Frown, Zap, Battery } from 'lucide-react';
import { ActiveWorkoutState, WorkoutMood, ExercisePR, WeightUnit, calculateLogVolume } from '@/types/workout-tracker';
import { cn } from '@/lib/utils';

interface WorkoutSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: ActiveWorkoutState;
  duration: number;
  newPRs: ExercisePR[];
  weightUnit: WeightUnit;
  onSave: (notes: string, mood?: WorkoutMood) => void;
  onContinue: () => void;
}

const moodOptions: { value: WorkoutMood; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'great', label: 'Great', icon: <Zap className="w-5 h-5" />, color: 'text-green-500 bg-green-500/10 border-green-500/30' },
  { value: 'good', label: 'Good', icon: <Smile className="w-5 h-5" />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { value: 'okay', label: 'Okay', icon: <Meh className="w-5 h-5" />, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
  { value: 'tired', label: 'Tired', icon: <Frown className="w-5 h-5" />, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { value: 'exhausted', label: 'Exhausted', icon: <Battery className="w-5 h-5" />, color: 'text-red-500 bg-red-500/10 border-red-500/30' },
];

export function WorkoutSummary({
  open,
  onOpenChange,
  workout,
  duration,
  newPRs,
  weightUnit,
  onSave,
  onContinue,
}: WorkoutSummaryProps) {
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<WorkoutMood | undefined>();

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate stats
  const totalSets = workout.exercises.reduce((sum, ex) => 
    sum + ex.sets.filter(s => !s.isWarmup && s.completed).length, 0
  );

  const totalVolume = workout.exercises.reduce((sum, ex) => 
    sum + ex.sets.reduce((setSum, set) => {
      if (set.isWarmup) return setSum;
      return setSum + (set.weight * set.reps);
    }, 0), 0
  );

  const handleSave = () => {
    onSave(notes, selectedMood);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Workout Complete! 🎉</DialogTitle>
          <DialogDescription>
            {workout.workoutName || 'Great workout'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">{formatDuration(duration)}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <ListChecks className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">{totalSets}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Dumbbell className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">
                  {totalVolume >= 1000 
                    ? `${(totalVolume / 1000).toFixed(1)}k` 
                    : totalVolume}
                </p>
                <p className="text-xs text-muted-foreground">{weightUnit}</p>
              </CardContent>
            </Card>
          </div>

          {/* New PRs */}
          {newPRs.length > 0 && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                    {newPRs.length} New PR{newPRs.length > 1 ? 's' : ''}!
                  </span>
                </div>
                <div className="space-y-1">
                  {newPRs.map((pr) => (
                    <div key={pr.exerciseId} className="text-sm flex justify-between">
                      <span className="text-muted-foreground">{pr.exerciseName}</span>
                      <span className="font-medium">
                        {pr.weight} {pr.weightUnit} × {pr.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mood Selector */}
          <div>
            <p className="text-sm font-medium mb-2">How did you feel?</p>
            <div className="flex gap-2 flex-wrap">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMood(mood.value)}
                  className={cn(
                    'gap-1 transition-all',
                    selectedMood === mood.value && mood.color
                  )}
                >
                  {mood.icon}
                  <span className="hidden sm:inline">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm font-medium mb-2">Notes (optional)</p>
            <Textarea
              placeholder="How was your workout? Any observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onContinue} className="flex-1">
              Continue Workout
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save & Finish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
