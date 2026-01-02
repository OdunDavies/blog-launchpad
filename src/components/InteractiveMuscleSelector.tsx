import { useState } from 'react';
import { MuscleGroup, muscleGroups } from '@/data/exercises';
import { MuscleMap } from './MuscleMap';
import { Button } from '@/components/ui/button';
import { X, MousePointerClick, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedMuscle = selectedMuscles.length > 0 ? selectedMuscles[selectedMuscles.length - 1] : null;
  
  const getSelectedMuscleNames = () => {
    return selectedMuscles
      .map(m => muscleGroups.find(mg => mg.id === m)?.name || m)
      .join(', ');
  };

  return (
    <>
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
        
        <div 
          className="relative cursor-pointer group"
          onClick={() => setIsExpanded(true)}
        >
          <MuscleMap
            highlightedMuscles={selectedMuscles}
            size="sm"
            interactive
            onMuscleClick={(e) => e} // Disable direct clicks, use dialog
            selectedMuscle={selectedMuscle}
          />
          <div className="absolute bottom-0 right-0 p-1 bg-background/80 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        
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

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Muscle Groups</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <MuscleMap
              highlightedMuscles={selectedMuscles}
              size="lg"
              interactive
              onMuscleClick={onMuscleToggle}
              selectedMuscle={selectedMuscle}
            />
            {selectedMuscles.length > 0 ? (
              <p className="text-sm text-primary font-medium text-center">
                {getSelectedMuscleNames()}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Click on muscle groups to filter exercises
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
