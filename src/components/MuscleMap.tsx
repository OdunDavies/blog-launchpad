import { MuscleGroup, muscleGroups } from '@/data/exercises';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MuscleMapProps {
  highlightedMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onMuscleClick?: (muscle: MuscleGroup) => void;
  selectedMuscle?: MuscleGroup | null;
}

const musclePathsFront: Record<string, string> = {
  chest: 'M35,45 Q50,42 65,45 L65,60 Q50,65 35,60 Z',
  shoulders: 'M25,40 Q30,35 35,40 L35,50 Q30,52 25,50 Z M65,40 Q70,35 75,40 L75,50 Q70,52 65,50 Z',
  biceps: 'M20,52 Q22,50 25,52 L25,70 Q22,72 20,70 Z M75,52 Q78,50 80,52 L80,70 Q78,72 75,70 Z',
  forearms: 'M18,72 Q20,70 22,72 L22,90 Q20,92 18,90 Z M78,72 Q80,70 82,72 L82,90 Q80,92 78,90 Z',
  abs: 'M40,62 L60,62 L60,95 L40,95 Z',
  obliques: 'M35,65 L40,62 L40,95 L35,92 Z M60,62 L65,65 L65,92 L60,95 Z',
  quads: 'M35,100 L45,100 L45,140 L35,140 Z M55,100 L65,100 L65,140 L55,140 Z',
  calves: 'M36,145 L44,145 L44,175 L36,175 Z M56,145 L64,145 L64,175 L56,175 Z',
};

const musclePathsBack: Record<string, string> = {
  traps: 'M40,30 Q50,28 60,30 L58,45 Q50,42 42,45 Z',
  back: 'M38,46 L62,46 L62,70 L38,70 Z',
  lats: 'M32,50 L38,48 L38,72 L32,68 Z M62,48 L68,50 L68,68 L62,72 Z',
  triceps: 'M22,52 Q18,50 20,52 L20,68 Q18,70 22,68 Z M78,52 Q82,50 80,52 L80,68 Q82,70 78,68 Z',
  glutes: 'M38,75 L62,75 L62,100 L38,100 Z',
  hamstrings: 'M36,102 L46,102 L46,140 L36,140 Z M54,102 L64,102 L64,140 L54,140 Z',
};

const sizeClasses = {
  sm: 'w-24 h-32',
  md: 'w-32 h-44',
  lg: 'w-48 h-64',
};

const getMuscleDisplayName = (muscle: string): string => {
  const found = muscleGroups.find(m => m.id === muscle);
  return found ? found.name : muscle.charAt(0).toUpperCase() + muscle.slice(1);
};

export function MuscleMap({ 
  highlightedMuscles, 
  secondaryMuscles = [], 
  size = 'md',
  interactive = false,
  onMuscleClick,
  selectedMuscle
}: MuscleMapProps) {
  const getMuscleClass = (muscle: string) => {
    const isSelected = selectedMuscle === muscle;
    const isHighlighted = highlightedMuscles.includes(muscle as MuscleGroup);
    const isSecondary = secondaryMuscles.includes(muscle as MuscleGroup);
    
    let baseClass = 'fill-muted transition-all duration-200';
    
    if (isSelected) {
      baseClass = 'fill-primary transition-all duration-200';
    } else if (isHighlighted) {
      baseClass = 'fill-foreground transition-all duration-200';
    } else if (isSecondary) {
      baseClass = 'fill-muted-foreground transition-all duration-200';
    }
    
    if (interactive) {
      baseClass += ' cursor-pointer hover:fill-primary/70';
    }
    
    return baseClass;
  };

  const handleMuscleClick = (muscle: string) => {
    if (interactive && onMuscleClick) {
      onMuscleClick(muscle as MuscleGroup);
    }
  };

  const renderMusclePath = (muscle: string, path: string) => {
    const pathElement = (
      <path
        key={muscle}
        d={path}
        className={getMuscleClass(muscle)}
        onClick={() => handleMuscleClick(muscle)}
      />
    );

    if (interactive) {
      return (
        <Tooltip key={muscle}>
          <TooltipTrigger asChild>
            {pathElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMuscleDisplayName(muscle)}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return pathElement;
  };

  return (
    <TooltipProvider>
      <div className="flex gap-4 items-center justify-center">
        {/* Front View */}
        <div className={`${sizeClasses[size]} relative`}>
          <svg viewBox="0 0 100 190" className="w-full h-full">
            {/* Head */}
            <circle cx="50" cy="15" r="12" className="fill-muted stroke-border" />
            {/* Neck */}
            <rect x="45" y="25" width="10" height="8" className="fill-muted" />
            {/* Body outline */}
            <path
              d="M30,33 Q50,30 70,33 L75,50 L82,90 L78,95 L65,95 L65,100 L55,100 L55,145 L64,175 L56,180 L50,175 L44,180 L36,175 L45,145 L45,100 L35,100 L35,95 L22,95 L18,90 L25,50 Z"
              className="fill-muted stroke-border"
            />
            {/* Muscle groups */}
            {Object.entries(musclePathsFront).map(([muscle, path]) => 
              renderMusclePath(muscle, path)
            )}
          </svg>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Front</span>
        </div>

        {/* Back View */}
        <div className={`${sizeClasses[size]} relative`}>
          <svg viewBox="0 0 100 190" className="w-full h-full">
            {/* Head */}
            <circle cx="50" cy="15" r="12" className="fill-muted stroke-border" />
            {/* Neck */}
            <rect x="45" y="25" width="10" height="8" className="fill-muted" />
            {/* Body outline */}
            <path
              d="M30,33 Q50,30 70,33 L75,50 L82,90 L78,95 L65,95 L65,100 L55,100 L55,145 L64,175 L56,180 L50,175 L44,180 L36,175 L45,145 L45,100 L35,100 L35,95 L22,95 L18,90 L25,50 Z"
              className="fill-muted stroke-border"
            />
            {/* Muscle groups */}
            {Object.entries(musclePathsBack).map(([muscle, path]) => 
              renderMusclePath(muscle, path)
            )}
            {/* Calves on back too */}
            {renderMusclePath('calves', 'M36,145 L44,145 L44,175 L36,175 Z M56,145 L64,145 L64,175 L56,175 Z')}
          </svg>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Back</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
