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
    <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg border">
      <div className="text-center space-y-1">
        <h3 className="text-sm font-medium flex items-center gap-2 justify-center">
          <MousePointerClick className="w-4 h-4" />
          Click a muscle to filter exercises
        </h3>
        {selectedMuscles.length > 0 ? (
          <p className="text-sm text-primary font-medium">
            Selected: {getSelectedMuscleNames()}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Select one or more muscles to see targeted exercises
          </p>
        )}
      </div>
      
      <MuscleMap
        highlightedMuscles={selectedMuscles}
        size="lg"
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
          <X className="w-4 h-4 mr-1" />
          Clear muscle selection
        </Button>
      )}
    </div>
  );
}
