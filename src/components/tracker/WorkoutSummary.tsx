import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trophy, Clock, Dumbbell, Target, Smile, Meh, Frown } from 'lucide-react';
import { WorkoutLog, LoggedExercise, WeightUnit } from '@/types/workout-tracker';
import { cn } from '@/lib/utils';

interface WorkoutSummaryProps {
  open: boolean;
  onClose: () => void;
  onFinish: (mood?: WorkoutLog['mood'], notes?: string) => void;
  exercises: LoggedExercise[];
  duration: string;
  weightUnit: WeightUnit;
  newPRs: string[];
}

const moodOptions: Array<{ value: WorkoutLog['mood']; label: string; icon: React.ReactNode; color: string }> = [
  { value: 'great', label: 'Great', icon: <Smile className="w-6 h-6" />, color: 'text-green-500 bg-green-500/10 border-green-500/30' },
  { value: 'good', label: 'Good', icon: <Smile className="w-6 h-6" />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { value: 'okay', label: 'Okay', icon: <Meh className="w-6 h-6" />, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
  { value: 'tired', label: 'Tired', icon: <Frown className="w-6 h-6" />, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { value: 'exhausted', label: 'Exhausted', icon: <Frown className="w-6 h-6" />, color: 'text-red-500 bg-red-500/10 border-red-500/30' },
];

export function WorkoutSummary({ 
  open, 
  onClose, 
  onFinish, 
  exercises, 
  duration, 
  weightUnit,
  newPRs,
}: WorkoutSummaryProps) {
  const [mood, setMood] = useState<WorkoutLog['mood']>();
  const [notes, setNotes] = useState('');

  const totalSets = exercises.reduce((sum, e) => 
    sum + e.sets.filter(s => s.completed && !s.isWarmup).length, 0
  );
  const totalVolume = exercises.reduce((sum, e) => 
    sum + e.sets.filter(s => s.completed && !s.isWarmup).reduce((setSum, s) => setSum + s.weight * s.reps, 0), 0
  );

  const handleFinish = () => {
    onFinish(mood, notes || undefined);
    setMood(undefined);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">🎉 Workout Complete!</DialogTitle>
          <DialogDescription className="text-center">
            Great job! Here's your workout summary.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{duration}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Dumbbell className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{totalSets}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{(totalVolume / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">{weightUnit} lifted</p>
              </CardContent>
            </Card>
          </div>

          {/* New PRs */}
          {newPRs.length > 0 && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <p className="font-semibold text-yellow-600">New Personal Records!</p>
                </div>
                <ul className="text-sm space-y-1">
                  {newPRs.map((pr, i) => (
                    <li key={i} className="text-muted-foreground">• {pr}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mood Selection */}
          <div>
            <Label className="mb-2 block">How do you feel?</Label>
            <div className="flex gap-2 justify-center">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all",
                    mood === option.value 
                      ? option.color 
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  {option.icon}
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout go? Any adjustments for next time?"
              className="mt-1.5"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue Workout
            </Button>
            <Button className="flex-1" onClick={handleFinish}>
              Save & Finish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
