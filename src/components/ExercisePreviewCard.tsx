import { Exercise } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dumbbell, Play } from 'lucide-react';

interface ExercisePreviewCardProps {
  exercise: Exercise;
  children: React.ReactNode;
}

export function ExercisePreviewCard({ exercise, children }: ExercisePreviewCardProps) {
  // Extract video thumbnail from YouTube URL
  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/embed\/([^?]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  const thumbnail = getYouTubeThumbnail(exercise.videoUrl);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 p-0 overflow-hidden" side="right" align="start">
        {thumbnail && (
          <div className="relative aspect-video bg-muted">
            <img
              src={thumbnail}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center">
                <Play className="w-5 h-5 text-foreground ml-0.5" />
              </div>
            </div>
          </div>
        )}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{exercise.equipment}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs capitalize">
              {exercise.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {exercise.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Click to view full details</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
