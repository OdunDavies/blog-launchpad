import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { muscleGroups, MuscleGroup } from '@/data/exercises';
import { MuscleMap } from '@/components/MuscleMap';

interface StepMusclesProps {
  targetMuscles: MuscleGroup[];
  toggleMuscle: (muscle: MuscleGroup) => void;
}

export function StepMuscles({ targetMuscles, toggleMuscle }: StepMusclesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Any muscles you want to emphasize?</h3>
        <p className="text-muted-foreground">Click on the body to select muscles</p>
      </div>

      {targetMuscles.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {targetMuscles.map((muscle) => (
            <Badge 
              key={muscle} 
              variant="default" 
              className="text-sm cursor-pointer hover:bg-primary/80"
              onClick={() => toggleMuscle(muscle)}
            >
              {muscleGroups.find(m => m.id === muscle)?.name} ×
            </Badge>
          ))}
        </div>
      )}

      <div className="flex justify-center py-4">
        <MuscleMap
          highlightedMuscles={targetMuscles}
          size="lg"
          interactive
          onMuscleClick={toggleMuscle}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {targetMuscles.length === 0 
          ? 'Leave empty for a balanced full-body approach' 
          : `${targetMuscles.length} muscle${targetMuscles.length > 1 ? 's' : ''} selected`}
      </p>
    </div>
  );
}
