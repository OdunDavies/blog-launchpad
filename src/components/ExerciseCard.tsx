import { Exercise } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MuscleMap } from './MuscleMap';
import { ExercisePreviewCard } from './ExercisePreviewCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Play, Heart } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const difficultyColors = {
  beginner: 'bg-secondary text-secondary-foreground',
  intermediate: 'bg-muted text-muted-foreground',
  advanced: 'bg-foreground text-background',
};

export function ExerciseCard({ exercise, isFavorite = false, onToggleFavorite }: ExerciseCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(exercise.id);
  };

  return (
    <Dialog>
      <ExercisePreviewCard exercise={exercise}>
        <DialogTrigger asChild>
          <Card className="exercise-card-hover cursor-pointer group relative">
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'
                  }`}
                />
              </button>
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2 pr-8">
                <CardTitle className="text-base font-semibold leading-tight group-hover:text-foreground/80 transition-colors">
                  {exercise.name}
                </CardTitle>
                <Play className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {exercise.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <MuscleMap
                  highlightedMuscles={exercise.primaryMuscles}
                  secondaryMuscles={exercise.secondaryMuscles}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Primary</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.primaryMuscles.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs capitalize">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                  {exercise.secondaryMuscles.length > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground mb-1 mt-2">Secondary</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.secondaryMuscles.map((muscle) => (
                          <Badge key={muscle} variant="outline" className="text-xs capitalize">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{exercise.equipment}</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
      </ExercisePreviewCard>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{exercise.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Video embed */}
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <iframe
              src={exercise.videoUrl}
              title={exercise.name}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex gap-6 items-start">
            <MuscleMap
              highlightedMuscles={exercise.primaryMuscles}
              secondaryMuscles={exercise.secondaryMuscles}
              size="md"
            />
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Equipment</h4>
                <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Difficulty</h4>
                <Badge className={difficultyColors[exercise.difficulty]}>
                  {exercise.difficulty}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Primary Muscles</h4>
                <div className="flex flex-wrap gap-1">
                  {exercise.primaryMuscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="capitalize">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
              {exercise.secondaryMuscles.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Secondary Muscles</h4>
                  <div className="flex flex-wrap gap-1">
                    {exercise.secondaryMuscles.map((muscle) => (
                      <Badge key={muscle} variant="outline" className="capitalize">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-1.5">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
