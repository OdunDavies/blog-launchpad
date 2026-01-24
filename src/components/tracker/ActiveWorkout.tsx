import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, X, Check, Dumbbell } from 'lucide-react';
import { ExerciseLogger } from './ExerciseLogger';
import { WorkoutSummary } from './WorkoutSummary';
import { ExercisePickerModal } from '@/components/ExercisePickerModal';
import { ActiveWorkoutState, WeightUnit, WorkoutSet, WorkoutLog, ExercisePR } from '@/types/workout-tracker';
import { calculate1RM } from '@/hooks/useWorkoutTracker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ActiveWorkoutProps {
  workout: ActiveWorkoutState;
  weightUnit: WeightUnit;
  exercisePRs: Record<string, ExercisePR>;
  onAddExercise: (exerciseId: string, exerciseName: string) => void;
  onRemoveExercise: (index: number) => void;
  onAddSet: (exerciseIndex: number, isWarmup?: boolean) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
  onFinish: (mood?: WorkoutLog['mood'], notes?: string) => void;
  onCancel: () => void;
  getExerciseHistory: (exerciseId: string) => Array<{ date: string; bestSet: WorkoutSet | null }>;
}

export function ActiveWorkout({
  workout,
  weightUnit,
  exercisePRs,
  onAddExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onFinish,
  onCancel,
  getExerciseHistory,
}: ActiveWorkoutProps) {
  const [duration, setDuration] = useState('0:00');
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Update duration every second
  useEffect(() => {
    const updateDuration = () => {
      const start = new Date(workout.startTime);
      const now = new Date();
      const minutes = Math.floor((now.getTime() - start.getTime()) / 60000);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      setDuration(hours > 0 
        ? `${hours}:${remainingMinutes.toString().padStart(2, '0')}` 
        : `${minutes}m`
      );
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [workout.startTime]);

  const handleAddExercise = (exercise: { name: string; sets: number; reps: string; rest: string }) => {
    const exerciseId = exercise.name.toLowerCase().replace(/\s+/g, '-');
    onAddExercise(exerciseId, exercise.name);
    setExercisePickerOpen(false);
  };

  const handleFinishClick = () => {
    setSummaryOpen(true);
  };

  const handleFinish = (mood?: WorkoutLog['mood'], notes?: string) => {
    onFinish(mood, notes);
    setSummaryOpen(false);
  };

  // Find new PRs for the summary
  const findNewPRs = () => {
    const newPRs: string[] = [];
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.completed && !set.isWarmup && set.weight > 0) {
          const estimated1RM = calculate1RM(set.weight, set.reps);
          const currentPR = exercisePRs[exercise.exerciseId];
          if (!currentPR || estimated1RM > currentPR.estimated1RM) {
            newPRs.push(`${exercise.exerciseName}: ${set.weight}${weightUnit} × ${set.reps}`);
          }
        }
      });
    });
    return [...new Set(newPRs)]; // Remove duplicates
  };

  const getPreviousBest = (exerciseId: string) => {
    const history = getExerciseHistory(exerciseId);
    if (history.length === 0 || !history[0].bestSet) return null;
    return {
      weight: history[0].bestSet.weight,
      reps: history[0].bestSet.reps,
    };
  };

  const totalCompletedSets = workout.exercises.reduce((sum, e) => 
    sum + e.sets.filter(s => s.completed).length, 0
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                {workout.workoutName || 'Active Workout'}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {duration}
                </span>
                <span>{workout.exercises.length} exercises</span>
                <span>{totalCompletedSets} sets completed</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleFinishClick}
                disabled={workout.exercises.length === 0}
              >
                <Check className="w-4 h-4 mr-1" />
                Finish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Dumbbell className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No exercises added yet</p>
              <Button onClick={() => setExercisePickerOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          workout.exercises.map((exercise, index) => (
            <ExerciseLogger
              key={`${exercise.exerciseId}-${index}`}
              exercise={exercise}
              exerciseIndex={index}
              weightUnit={weightUnit}
              onAddSet={(isWarmup) => onAddSet(index, isWarmup)}
              onUpdateSet={(setIndex, updates) => onUpdateSet(index, setIndex, updates)}
              onRemoveSet={(setIndex) => onRemoveSet(index, setIndex)}
              onRemoveExercise={() => onRemoveExercise(index)}
              previousBest={getPreviousBest(exercise.exerciseId)}
              hasPR={exercise.sets.some(s => s.isPR)}
            />
          ))
        )}
      </div>

      {/* Add Exercise Button */}
      {workout.exercises.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setExercisePickerOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      )}

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        open={exercisePickerOpen}
        onClose={() => setExercisePickerOpen(false)}
        onSelectExercise={handleAddExercise}
      />

      {/* Workout Summary Modal */}
      <WorkoutSummary
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        onFinish={handleFinish}
        exercises={workout.exercises}
        duration={duration}
        weightUnit={weightUnit}
        newPRs={findNewPRs()}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this workout? All progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Going</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
