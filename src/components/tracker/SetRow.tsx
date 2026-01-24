import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Trophy, Flame } from 'lucide-react';
import { WorkoutSet, WeightUnit } from '@/types/workout-tracker';
import { cn } from '@/lib/utils';

interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  weightUnit: WeightUnit;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  previousBest?: { weight: number; reps: number } | null;
}

export function SetRow({ set, setIndex, weightUnit, onUpdate, onRemove, previousBest }: SetRowProps) {
  return (
    <div className={cn(
      "grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 items-center py-2 px-3 rounded-lg",
      set.isWarmup ? "bg-orange-500/10" : "bg-muted/50",
      set.completed && "bg-primary/10"
    )}>
      {/* Set Number */}
      <div className="flex items-center gap-1 min-w-[40px]">
        {set.isWarmup ? (
          <Badge variant="outline" className="text-orange-500 border-orange-500/50 text-xs px-1.5">
            <Flame className="w-3 h-3 mr-0.5" />
            W
          </Badge>
        ) : (
          <span className="text-sm font-medium text-muted-foreground w-6 text-center">
            {set.setNumber}
          </span>
        )}
        {set.isPR && (
          <Trophy className="w-4 h-4 text-yellow-500" />
        )}
      </div>

      {/* Weight Input */}
      <div className="relative">
        <Input
          type="number"
          value={set.weight || ''}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          placeholder={previousBest ? `${previousBest.weight}` : '0'}
          className="h-9 pr-8 text-center"
          min={0}
          step={0.5}
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
          className="h-9 pr-10 text-center"
          min={0}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          reps
        </span>
      </div>

      {/* Completed Checkbox */}
      <Checkbox
        checked={set.completed}
        onCheckedChange={(checked) => onUpdate({ completed: checked as boolean })}
        className="h-5 w-5"
      />

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
