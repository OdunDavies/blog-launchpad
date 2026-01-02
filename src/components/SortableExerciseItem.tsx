import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableExerciseItemProps {
  id: string;
  exercise: { name: string; sets: number; reps: string; rest: string };
  isEditing: boolean;
  onRemove: () => void;
}

export function SortableExerciseItem({ id, exercise, isEditing, onRemove }: SortableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };
  
  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      className={`text-sm group/exercise ${isDragging ? 'bg-muted rounded-md' : ''}`}
    >
      <div className="flex items-start gap-2">
        {isEditing && (
          <button 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing touch-none mt-1 p-1 rounded hover:bg-muted-foreground/10 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <div className="flex-1">
          <p className="font-medium">{exercise.name}</p>
          <p className="text-xs text-muted-foreground">
            {exercise.sets} × {exercise.reps} • Rest: {exercise.rest}
          </p>
        </div>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </li>
  );
}
