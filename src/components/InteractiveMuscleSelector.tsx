import { MuscleGroup, muscleGroups } from '@/data/exercises';
import { MuscleMap } from './MuscleMap';
import { Button } from '@/components/ui/button';
import { X, MousePointerClick } from 'lucide-react';

interface InteractiveMuscleSelectorProps {
  selectedMuscles: MuscleGroup[];
  onMuscleToggle: (muscle: MuscleGroup) => void;
  onClear?: () => void;
}

export function InteractiveMuscleSelector({
  selectedMuscles,
  onMuscleToggle,
  onClear
}: InteractiveMuscleSelectorProps) {
  const selectedMuscle = selectedMuscles.length > 0 ? selectedMuscles[selectedMuscles.length - 1] : null;
  
  const getSelectedMuscleNames = () => {
    return selectedMuscles
      .map(m => muscleGroups.find(mg => mg.id === m)?.name || m)
      .join(', ');
  };

  return (
    <div className="flex items-center justify-center gap-4 p-3 bg-muted/30 rounded-lg border flex-wrap">
      <div className="flex items-center gap-2 text-sm">
        <MousePointerClick className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {selectedMuscles.length > 0 ? (
          <span className="text-primary font-medium">
            {getSelectedMuscleNames()}
          </span>
        ) : (
          <span className="text-muted-foreground">
            Click muscles to filter
          </span>
        )}
      </div>
      
      <MuscleMap
        highlightedMuscles={selectedMuscles}
        size="sm"
        interactive
        onMuscleClick={onMuscleToggle}
        selectedMuscle={selectedMuscle}
      />
      
      {selectedMuscles.length > 0 && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
