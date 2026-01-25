import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Trophy, Flame } from 'lucide-react';
import { WorkoutSet, WeightUnit } from '@/types/workout-tracker';
import { cn } from '@/lib/utils';

interface SetRowProps {
  set: WorkoutSet;
  weightUnit: WeightUnit;
  previousBest?: { weight: number; reps: number };
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
}

export function SetRow({ set, weightUnit, previousBest, onUpdate, onRemove }: SetRowProps) {
  const isCompleted = set.completed || false;
  const isWarmup = set.isWarmup || false;

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_1fr_auto_auto] sm:grid-cols-[40px_1fr_1fr_40px_40px_40px] gap-2 items-center p-2 rounded-lg transition-colors',
        isWarmup && 'bg-orange-500/10 border border-orange-500/20',
        isCompleted && !isWarmup && 'bg-primary/5 border border-primary/20',
        !isCompleted && !isWarmup && 'bg-muted/50'
      )}
    >
      {/* Set Number */}
      <div className="flex items-center justify-center gap-1">
        {isWarmup ? (
          <Flame className="w-4 h-4 text-orange-500" />
        ) : (
          <span className="text-sm font-medium text-muted-foreground w-6 text-center">
            {set.setNumber}
          </span>
        )}
        {set.isPR && <Trophy className="w-4 h-4 text-yellow-500" />}
      </div>

      {/* Weight Input */}
      <div className="relative">
        <Input
          type="number"
          value={set.weight || ''}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          placeholder={previousBest ? `${previousBest.weight}` : '0'}
          className="pr-8 text-center"
          min={0}
          step={weightUnit === 'kg' ? 2.5 : 5}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {weightUnit}
        </span>
      </div>

      {/* Reps Input */}
      <div className="relative">
        <Input
          type="number"
          value={set.reps || ''}
          onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
          placeholder={previousBest ? `${previousBest.reps}` : '0'}
          className="pr-10 text-center"
          min={0}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          reps
        </span>
      </div>

      {/* Completed Checkbox */}
      <div className="flex justify-center">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={(checked) => onUpdate({ completed: checked === true })}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      {/* Delete Button - Hidden on mobile, shown on larger screens */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive hidden sm:flex"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Mobile Delete - Shows inline */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive sm:hidden"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
