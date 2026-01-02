import { Exercise } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MuscleMap } from './MuscleMap';
import { ExercisePreviewCard } from './ExercisePreviewCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Dumbbell, Heart } from 'lucide-react';

import muscleChest from '@/assets/muscle-chest.jpg';
import muscleBack from '@/assets/muscle-back.jpg';
import muscleShoulders from '@/assets/muscle-shoulders.jpg';
import muscleArms from '@/assets/muscle-arms.jpg';
import muscleLegs from '@/assets/muscle-legs.jpg';
import muscleCore from '@/assets/muscle-core.jpg';
import exerciseBarbell from '@/assets/exercise-barbell.jpg';
import exerciseDumbbell from '@/assets/exercise-dumbbell.jpg';
import exerciseBodyweight from '@/assets/exercise-bodyweight.jpg';
import exerciseCable from '@/assets/exercise-cable.jpg';
import exerciseMachine from '@/assets/exercise-machine.jpg';
import exerciseKettlebell from '@/assets/exercise-kettlebell.jpg';
import exerciseBands from '@/assets/exercise-bands.jpg';
import exerciseEzbar from '@/assets/exercise-ezbar.jpg';
import exerciseSmith from '@/assets/exercise-smith.jpg';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/30',
};

// Map exercise to images based on equipment first, then muscle group
function getExerciseImage(exercise: Exercise): string {
  const equipment = exercise.equipment.toLowerCase();
  
  // First, try to match by equipment for more variety
  if (equipment.includes('barbell')) return exerciseBarbell;
  if (equipment.includes('dumbbell')) return exerciseDumbbell;
  if (equipment.includes('cable')) return exerciseCable;
  if (equipment.includes('machine') || equipment.includes('press machine') || equipment.includes('leg press')) return exerciseMachine;
  if (equipment.includes('kettlebell')) return exerciseKettlebell;
  if (equipment.includes('band') || equipment.includes('resistance')) return exerciseBands;
  if (equipment.includes('ez bar') || equipment.includes('ez-bar')) return exerciseEzbar;
  if (equipment.includes('smith')) return exerciseSmith;
  if (equipment === 'bodyweight' || equipment === 'none' || equipment.includes('pull-up') || equipment.includes('dip')) return exerciseBodyweight;
  
  // Fallback to muscle-based images
  const primary = exercise.primaryMuscles[0];
  if (primary === 'chest') return muscleChest;
  if (['lats', 'traps', 'back'].includes(primary)) return muscleBack;
  if (primary === 'shoulders') return muscleShoulders;
  if (['biceps', 'triceps', 'forearms'].includes(primary)) return muscleArms;
  if (['quads', 'hamstrings', 'glutes', 'calves'].includes(primary)) return muscleLegs;
  if (['abs', 'obliques'].includes(primary)) return muscleCore;
  
  return exerciseBarbell;
}

function getQuickStats(difficulty: string): { sets: string; reps: string } {
  switch (difficulty) {
    case 'beginner':
      return { sets: '3', reps: '10-12' };
    case 'intermediate':
      return { sets: '4', reps: '8-10' };
    case 'advanced':
      return { sets: '4-5', reps: '6-8' };
    default:
      return { sets: '3', reps: '10' };
  }
}

export function ExerciseCard({ exercise, isFavorite = false, onToggleFavorite }: ExerciseCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(exercise.id);
  };

  const exerciseImage = getExerciseImage(exercise);
  const quickStats = getQuickStats(exercise.difficulty);

  return (
    <Dialog>
      <ExercisePreviewCard exercise={exercise}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer relative overflow-hidden border-border/50">
            {/* Image Header */}
            <div className="relative h-32 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${exerciseImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              
              {/* Favorite Button */}
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
              
              {/* Quick Stats */}
              <div className="absolute bottom-2 left-2 flex gap-2">
                <Badge variant="secondary" className="bg-background/80 text-xs">
                  {quickStats.sets} sets
                </Badge>
                <Badge variant="secondary" className="bg-background/80 text-xs">
                  {quickStats.reps} reps
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2 pt-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base font-semibold leading-tight">
                  {exercise.name}
                </CardTitle>
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
            <CardContent className="pt-0 pb-4">
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
                        {exercise.secondaryMuscles.slice(0, 2).map((muscle) => (
                          <Badge key={muscle} variant="outline" className="text-xs capitalize">
                            {muscle}
                          </Badge>
                        ))}
                        {exercise.secondaryMuscles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{exercise.secondaryMuscles.length - 2}
                          </Badge>
                        )}
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
