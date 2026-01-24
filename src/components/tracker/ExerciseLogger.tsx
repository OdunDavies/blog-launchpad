import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronDown, ChevronUp, Trophy, Flame } from 'lucide-react';
import { LoggedExercise, WorkoutSet, WeightUnit } from '@/types/workout-tracker';
import { SetRow } from './SetRow';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExerciseLoggerProps {
  exercise: LoggedExercise;
  exerciseIndex: number;
  weightUnit: WeightUnit;
  onAddSet: (isWarmup?: boolean) => void;
  onUpdateSet: (setIndex: number, updates: Partial<WorkoutSet>) => void;
  onRemoveSet: (setIndex: number) => void;
  onRemoveExercise: () => void;
  previousBest?: { weight: number; reps: number } | null;
  hasPR?: boolean;
}

export function ExerciseLogger({
  exercise,
  exerciseIndex,
  weightUnit,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onRemoveExercise,
  previousBest,
  hasPR,
}: ExerciseLoggerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const completedSets = exercise.sets.filter(s => s.completed && !s.isWarmup).length;
  const totalSets = exercise.sets.filter(s => !s.isWarmup).length;
  const totalVolume = exercise.sets
    .filter(s => s.completed && !s.isWarmup)
    .reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  {exercise.exerciseName}
                </CardTitle>
                {hasPR && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                    <Trophy className="w-3 h-3 mr-1" />
                    PR
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{completedSets}</span>/{totalSets} sets
                  {totalVolume > 0 && (
                    <span className="ml-2">
                      • {totalVolume.toLocaleString()} {weightUnit}
                    </span>
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            {previousBest && (
              <p className="text-xs text-muted-foreground mt-1">
                Last best: {previousBest.weight} {weightUnit} × {previousBest.reps}
              </p>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 items-center px-3 text-xs font-medium text-muted-foreground">
              <span className="min-w-[40px]">SET</span>
              <span className="text-center">WEIGHT</span>
              <span className="text-center">REPS</span>
              <span className="w-5 text-center">✓</span>
              <span className="w-8"></span>
            </div>

            {/* Sets */}
            <div className="space-y-1">
              {exercise.sets.map((set, setIndex) => (
                <SetRow
                  key={setIndex}
                  set={set}
                  setIndex={setIndex}
                  weightUnit={weightUnit}
                  onUpdate={(updates) => onUpdateSet(setIndex, updates)}
                  onRemove={() => onRemoveSet(setIndex)}
                  previousBest={previousBest}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onAddSet(false)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Set
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                onClick={() => onAddSet(true)}
              >
                <Flame className="w-4 h-4 mr-1" />
                Warmup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onRemoveExercise}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
