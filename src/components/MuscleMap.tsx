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

const sizeClasses = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64',
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
    const isSelected = selectedMuscle === muscle || highlightedMuscles.includes(muscle as MuscleGroup);
    const isSecondary = secondaryMuscles.includes(muscle as MuscleGroup);
    
    let fillClass = 'fill-[hsl(var(--muted))]';
    
    if (isSelected) {
      fillClass = 'fill-primary';
    } else if (isSecondary) {
      fillClass = 'fill-primary/40';
    }
    
    let baseClass = `${fillClass} stroke-[hsl(var(--border))] stroke-[1.5] transition-all duration-200`;
    
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

  const renderMusclePath = (muscle: string, path: string, key?: string) => {
    const pathElement = (
      <path
        key={key || muscle}
        d={path}
        className={getMuscleClass(muscle)}
        onClick={() => handleMuscleClick(muscle)}
      />
    );

    if (interactive) {
      return (
        <Tooltip key={key || muscle}>
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
      <div className={`flex gap-3 items-center justify-center ${sizeClasses[size]} w-full`}>
        {/* Front View */}
        <div className="h-full aspect-[1/2]">
          <svg viewBox="0 0 200 400" className="h-full w-auto">
            {/* Body outline - head */}
            <ellipse cx="100" cy="28" rx="22" ry="26" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Neck */}
            <path d="M90,52 L90,62 Q100,65 110,62 L110,52" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Shoulders - left */}
            {renderMusclePath('shoulders', 'M55,68 Q45,72 40,85 L40,100 Q50,98 60,92 L70,78 Q65,68 55,68 Z', 'shoulders-front-left')}
            
            {/* Shoulders - right */}
            {renderMusclePath('shoulders', 'M145,68 Q155,72 160,85 L160,100 Q150,98 140,92 L130,78 Q135,68 145,68 Z', 'shoulders-front-right')}
            
            {/* Chest - left */}
            {renderMusclePath('chest', 'M70,78 L60,92 Q58,105 62,115 L75,125 Q88,128 100,125 L100,78 Q85,72 70,78 Z', 'chest-left')}
            
            {/* Chest - right */}
            {renderMusclePath('chest', 'M130,78 L140,92 Q142,105 138,115 L125,125 Q112,128 100,125 L100,78 Q115,72 130,78 Z', 'chest-right')}
            
            {/* Biceps - left */}
            {renderMusclePath('biceps', 'M40,100 Q35,105 32,120 L30,145 Q32,155 38,158 L48,158 Q52,155 52,145 L55,120 Q55,105 50,98 Q45,98 40,100 Z', 'biceps-left')}
            
            {/* Biceps - right */}
            {renderMusclePath('biceps', 'M160,100 Q165,105 168,120 L170,145 Q168,155 162,158 L152,158 Q148,155 148,145 L145,120 Q145,105 150,98 Q155,98 160,100 Z', 'biceps-right')}
            
            {/* Forearms - left */}
            {renderMusclePath('forearms', 'M30,158 Q25,165 22,185 L20,215 Q22,225 28,228 L38,228 Q44,225 45,215 L48,185 Q50,165 48,158 L38,158 Q34,158 30,158 Z', 'forearms-left')}
            
            {/* Forearms - right */}
            {renderMusclePath('forearms', 'M170,158 Q175,165 178,185 L180,215 Q178,225 172,228 L162,228 Q156,225 155,215 L152,185 Q150,165 152,158 L162,158 Q166,158 170,158 Z', 'forearms-right')}
            
            {/* Abs */}
            {renderMusclePath('abs', 'M80,125 L80,200 Q82,210 100,212 Q118,210 120,200 L120,125 Q110,128 100,125 Q90,128 80,125 Z')}
            
            {/* Abs detail lines */}
            <path d="M100,130 L100,205" className="stroke-[hsl(var(--border))] stroke-[1] fill-none" />
            <path d="M82,145 L118,145" className="stroke-[hsl(var(--border))] stroke-[1] fill-none" />
            <path d="M82,165 L118,165" className="stroke-[hsl(var(--border))] stroke-[1] fill-none" />
            <path d="M82,185 L118,185" className="stroke-[hsl(var(--border))] stroke-[1] fill-none" />
            
            {/* Obliques - left */}
            {renderMusclePath('obliques', 'M62,115 Q58,130 60,160 L65,195 Q70,210 78,212 L80,200 L80,125 L75,125 Q68,120 62,115 Z', 'obliques-left')}
            
            {/* Obliques - right */}
            {renderMusclePath('obliques', 'M138,115 Q142,130 140,160 L135,195 Q130,210 122,212 L120,200 L120,125 L125,125 Q132,120 138,115 Z', 'obliques-right')}
            
            {/* Hip/groin area */}
            <path d="M78,212 Q100,225 122,212 L120,235 Q100,245 80,235 Z" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Quads - left */}
            {renderMusclePath('quads', 'M65,195 Q60,210 58,230 L55,280 Q55,310 60,330 L75,332 Q85,330 88,320 L92,280 L90,240 Q88,225 80,235 L78,212 Q70,210 65,195 Z', 'quads-left')}
            
            {/* Quads - right */}
            {renderMusclePath('quads', 'M135,195 Q140,210 142,230 L145,280 Q145,310 140,330 L125,332 Q115,330 112,320 L108,280 L110,240 Q112,225 120,235 L122,212 Q130,210 135,195 Z', 'quads-right')}
            
            {/* Knees */}
            <ellipse cx="70" cy="338" rx="12" ry="8" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            <ellipse cx="130" cy="338" rx="12" ry="8" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Calves - left */}
            {renderMusclePath('calves', 'M58,345 Q52,355 50,375 L52,395 Q58,400 70,400 Q82,400 85,395 L85,375 Q82,355 78,345 Q70,342 58,345 Z', 'calves-front-left')}
            
            {/* Calves - right */}
            {renderMusclePath('calves', 'M142,345 Q148,355 150,375 L148,395 Q142,400 130,400 Q118,400 115,395 L115,375 Q118,355 122,345 Q130,342 142,345 Z', 'calves-front-right')}
            
            {/* Hands */}
            <ellipse cx="28" cy="240" rx="10" ry="14" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            <ellipse cx="172" cy="240" rx="10" ry="14" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
          </svg>
        </div>

        {/* Back View */}
        <div className="h-full aspect-[1/2]">
          <svg viewBox="0 0 200 400" className="h-full w-auto">
            {/* Body outline - head */}
            <ellipse cx="100" cy="28" rx="22" ry="26" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Neck */}
            <path d="M90,52 L90,62 Q100,65 110,62 L110,52" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            
            {/* Traps */}
            {renderMusclePath('traps', 'M70,62 Q60,65 55,68 L55,85 Q70,90 100,90 Q130,90 145,85 L145,68 Q140,65 130,62 Q115,58 100,58 Q85,58 70,62 Z')}
            
            {/* Rear Delts / Shoulders - left */}
            {renderMusclePath('shoulders', 'M55,68 Q45,72 40,85 L40,105 Q50,100 55,92 L55,85 Q52,78 55,68 Z', 'shoulders-back-left')}
            
            {/* Rear Delts / Shoulders - right */}
            {renderMusclePath('shoulders', 'M145,68 Q155,72 160,85 L160,105 Q150,100 145,92 L145,85 Q148,78 145,68 Z', 'shoulders-back-right')}
            
            {/* Upper Back / Lats - left */}
            {renderMusclePath('lats', 'M55,90 L55,130 Q58,155 65,175 L78,185 Q90,182 100,178 L100,90 Q75,90 55,90 Z', 'lats-left')}
            
            {/* Upper Back / Lats - right */}
            {renderMusclePath('lats', 'M145,90 L145,130 Q142,155 135,175 L122,185 Q110,182 100,178 L100,90 Q125,90 145,90 Z', 'lats-right')}
            
            {/* Back center detail */}
            <path d="M100,90 L100,178" className="stroke-[hsl(var(--border))] stroke-[1] fill-none" />
            
            {/* Triceps - left */}
            {renderMusclePath('triceps', 'M40,105 Q35,115 32,135 L32,160 Q38,165 48,162 L52,140 Q55,120 55,105 Q48,102 40,105 Z', 'triceps-left')}
            
            {/* Triceps - right */}
            {renderMusclePath('triceps', 'M160,105 Q165,115 168,135 L168,160 Q162,165 152,162 L148,140 Q145,120 145,105 Q152,102 160,105 Z', 'triceps-right')}
            
            {/* Forearms - left */}
            {renderMusclePath('forearms', 'M32,160 Q28,170 25,190 L22,220 Q25,230 32,232 L42,230 Q48,225 48,215 L50,185 Q52,168 48,162 L32,160 Z', 'forearms-back-left')}
            
            {/* Forearms - right */}
            {renderMusclePath('forearms', 'M168,160 Q172,170 175,190 L178,220 Q175,230 168,232 L158,230 Q152,225 152,215 L150,185 Q148,168 152,162 L168,160 Z', 'forearms-back-right')}
            
            {/* Lower Back */}
            {renderMusclePath('back', 'M78,185 Q90,182 100,178 Q110,182 122,185 L125,210 Q100,220 75,210 L78,185 Z')}
            
            {/* Glutes - left */}
            {renderMusclePath('glutes', 'M75,210 Q70,215 65,230 L62,260 Q70,275 85,275 Q95,272 100,265 L100,220 Q90,218 75,210 Z', 'glutes-left')}
            
            {/* Glutes - right */}
            {renderMusclePath('glutes', 'M125,210 Q130,215 135,230 L138,260 Q130,275 115,275 Q105,272 100,265 L100,220 Q110,218 125,210 Z', 'glutes-right')}
            
            {/* Hamstrings - left */}
            {renderMusclePath('hamstrings', 'M62,260 Q58,280 55,310 L58,340 Q68,345 78,342 L85,310 Q88,285 85,275 Q70,275 62,260 Z', 'hamstrings-left')}
            
            {/* Hamstrings - right */}
            {renderMusclePath('hamstrings', 'M138,260 Q142,280 145,310 L142,340 Q132,345 122,342 L115,310 Q112,285 115,275 Q130,275 138,260 Z', 'hamstrings-right')}
            
            {/* Calves - left */}
            {renderMusclePath('calves', 'M55,345 Q50,360 50,380 L55,400 Q68,402 78,400 L82,380 Q82,360 78,345 Q68,342 55,345 Z', 'calves-back-left')}
            
            {/* Calves - right */}
            {renderMusclePath('calves', 'M145,345 Q150,360 150,380 L145,400 Q132,402 122,400 L118,380 Q118,360 122,345 Q132,342 145,345 Z', 'calves-back-right')}
            
            {/* Hands */}
            <ellipse cx="32" cy="245" rx="10" ry="14" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
            <ellipse cx="168" cy="245" rx="10" ry="14" className="fill-[hsl(var(--muted))] stroke-[hsl(var(--border))] stroke-[1.5]" />
          </svg>
        </div>
      </div>
    </TooltipProvider>
  );
}
