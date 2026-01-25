import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Flame, Trophy, Trash2, Dumbbell } from 'lucide-react';
import { LoggedExercise, WorkoutSet, WeightUnit, ExerciseHistory } from '@/types/workout-tracker';
import { SetRow } from './SetRow';
import { cn } from '@/lib/utils';

interface ExerciseLoggerProps {
  exercise: LoggedExercise;
  weightUnit: WeightUnit;
  history?: ExerciseHistory[];
  onAddSet: (set: Omit<WorkoutSet, 'setNumber'>) => void;
  onUpdateSet: (setNumber: number, updates: Partial<WorkoutSet>) => void;
  onRemoveSet: (setNumber: number) => void;
  onRemoveExercise: () => void;
}

export function ExerciseLogger({
  exercise,
  weightUnit,
  history,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onRemoveExercise,
}: ExerciseLoggerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedSets = exercise.sets.filter(s => s.completed && !s.isWarmup).length;
  const totalSets = exercise.sets.filter(s => !s.isWarmup).length;
  const hasPR = exercise.sets.some(s => s.isPR);

  // Get previous best from history
  const previousBest = history?.[0]?.bestSet;

  // Calculate total volume
  const totalVolume = exercise.sets.reduce((sum, set) => {
    if (set.isWarmup) return sum;
    return sum + (set.weight * set.reps);
  }, 0);

  const handleAddSet = () => {
    const lastSet = exercise.sets.filter(s => !s.isWarmup).slice(-1)[0];
    onAddSet({
      weight: lastSet?.weight || previousBest?.weight || 0,
      weightUnit,
      reps: lastSet?.reps || previousBest?.reps || 0,
      isWarmup: false,
      completed: false,
    });
  };

  const handleAddWarmupSet = () => {
    const firstWorkingSet = exercise.sets.find(s => !s.isWarmup);
    const warmupWeight = firstWorkingSet ? Math.round(firstWorkingSet.weight * 0.5) : 0;
    onAddSet({
      weight: warmupWeight,
      weightUnit,
      reps: 10,
      isWarmup: true,
      completed: false,
    });
  };

  return (
    <Card className={cn(hasPR && 'ring-1 ring-yellow-500/50')}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="font-medium">{exercise.exerciseName}</span>
                {hasPR && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    <Trophy className="w-3 h-3 mr-1" /> PR
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {completedSets}/{totalSets} sets
                </Badge>
                {totalVolume > 0 && (
                  <Badge variant="outline" className="text-xs hidden sm:flex">
                    {totalVolume.toLocaleString()} {weightUnit}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-2">
            {/* Previous Best */}
            {previousBest && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                Previous best: {previousBest.weight} {weightUnit} × {previousBest.reps} reps
              </div>
            )}

            {/* Sets */}
            <div className="space-y-1">
              {/* Header Row */}
              <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] sm:grid-cols-[40px_1fr_1fr_40px_40px_40px] gap-2 px-2 text-xs text-muted-foreground">
                <span className="text-center">Set</span>
                <span className="text-center">Weight</span>
                <span className="text-center">Reps</span>
                <span className="text-center">✓</span>
                <span className="text-center hidden sm:block">Del</span>
                <span className="text-center sm:hidden"></span>
              </div>

              {exercise.sets.map((set) => (
                <SetRow
                  key={set.setNumber}
                  set={set}
                  weightUnit={weightUnit}
                  previousBest={previousBest}
                  onUpdate={(updates) => onUpdateSet(set.setNumber, updates)}
                  onRemove={() => onRemoveSet(set.setNumber)}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleAddSet} className="gap-1">
                <Plus className="w-4 h-4" />
                Add Set
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddWarmupSet}
                className="gap-1 text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Flame className="w-4 h-4" />
                Warmup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveExercise}
                className="gap-1 text-destructive hover:text-destructive ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
