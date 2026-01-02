import { Zap } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { muscleGroups, MuscleGroup } from '@/data/exercises';

interface StepMusclesProps {
  targetMuscles: MuscleGroup[];
  toggleMuscle: (muscle: MuscleGroup) => void;
}

export function StepMuscles({ targetMuscles, toggleMuscle }: StepMusclesProps) {
  const groupedMuscles = muscleGroups.reduce(
    (acc, muscle) => {
      if (!acc[muscle.category]) {
        acc[muscle.category] = [];
      }
      acc[muscle.category].push(muscle);
      return acc;
    },
    {} as Record<string, typeof muscleGroups>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold">Any muscles you want to emphasize?</h3>
        <p className="text-muted-foreground">Leave empty for a balanced full-body approach</p>
      </div>

      {targetMuscles.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {targetMuscles.map((muscle) => (
            <Badge key={muscle} variant="default" className="text-sm">
              {muscleGroups.find(m => m.id === muscle)?.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedMuscles).map(([category, muscles]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {muscles.map((muscle) => (
                <div
                  key={muscle.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary ${
                    targetMuscles.includes(muscle.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => toggleMuscle(muscle.id)}
                >
                  <Checkbox
                    id={muscle.id}
                    checked={targetMuscles.includes(muscle.id)}
                    onCheckedChange={() => toggleMuscle(muscle.id)}
                  />
                  <Label htmlFor={muscle.id} className="cursor-pointer text-sm flex-1">
                    {muscle.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
