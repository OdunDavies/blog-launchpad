import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, X, Check, Plus, Dumbbell } from 'lucide-react';
import { ActiveWorkoutState, WorkoutSet, WeightUnit, ExercisePR, ExerciseHistory, calculate1RM } from '@/types/workout-tracker';
import { ExerciseLogger } from './ExerciseLogger';
import { WorkoutSummary } from './WorkoutSummary';
import { ExercisePickerModal } from '@/components/ExercisePickerModal';

interface ActiveWorkoutProps {
  workout: ActiveWorkoutState;
  weightUnit: WeightUnit;
  prs: Record<string, ExercisePR>;
  getExerciseHistory: (exerciseId: string) => ExerciseHistory[];
  onAddSet: (exerciseId: string, set: Omit<WorkoutSet, 'setNumber'>) => void;
  onUpdateSet: (exerciseId: string, setNumber: number, updates: Partial<WorkoutSet>) => void;
  onRemoveSet: (exerciseId: string, setNumber: number) => void;
  onAddExercise: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onFinish: (notes?: string, mood?: import('@/types/workout-tracker').WorkoutMood) => { log: any; newPRs: ExercisePR[] } | null;
  onCancel: () => void;
}

export function ActiveWorkout({
  workout,
  weightUnit,
  prs,
  getExerciseHistory,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onAddExercise,
  onRemoveExercise,
  onFinish,
  onCancel,
}: ActiveWorkoutProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pendingPRs, setPendingPRs] = useState<ExercisePR[]>([]);

  // Timer
  useEffect(() => {
    const startTime = new Date(workout.startTime).getTime();
    
    const updateTimer = () => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [workout.startTime]);

  // Calculate potential PRs when showing summary
  const calculatePendingPRs = useMemo(() => {
    const newPRs: ExercisePR[] = [];

    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.isWarmup || set.reps === 0 || set.weight === 0) return;

        const estimated1RM = calculate1RM(set.weight, set.reps);
        const existingPR = prs[exercise.exerciseId];

        if (!existingPR || estimated1RM > existingPR.estimated1RM) {
          const existingNew = newPRs.find(pr => pr.exerciseId === exercise.exerciseId);
          if (!existingNew || estimated1RM > existingNew.estimated1RM) {
            const idx = newPRs.findIndex(pr => pr.exerciseId === exercise.exerciseId);
            if (idx >= 0) newPRs.splice(idx, 1);

            newPRs.push({
              exerciseId: exercise.exerciseId,
              exerciseName: exercise.exerciseName,
              weight: set.weight,
              weightUnit: set.weightUnit,
              reps: set.reps,
              estimated1RM,
              date: new Date().toISOString().split('T')[0],
              workoutLogId: workout.id,
            });
          }
        }
      });
    });

    return newPRs;
  }, [workout, prs]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishClick = () => {
    setPendingPRs(calculatePendingPRs);
    setShowSummary(true);
  };

  const handleSaveWorkout = (notes: string, mood?: import('@/types/workout-tracker').WorkoutMood) => {
    onFinish(notes, mood);
    setShowSummary(false);
  };

  const handleContinue = () => {
    setShowSummary(false);
  };

  const handleAddExercise = (exercise: { name: string }) => {
    onAddExercise(exercise.name);
    setShowExercisePicker(false);
  };

  const duration = Math.floor(elapsedTime / 60);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{workout.workoutName || 'Workout'}</CardTitle>
            </div>
            <Badge variant="secondary" className="gap-1 text-base font-mono">
              <Clock className="w-4 h-4" />
              {formatTime(elapsedTime)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(workout.startTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-destructive">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Workout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will discard all your progress for this workout. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Going</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground">
                    Cancel Workout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleFinishClick} size="sm" className="gap-1 ml-auto">
              <Check className="w-4 h-4" />
              Finish Workout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-3">
        {workout.exercises.map((exercise) => (
          <ExerciseLogger
            key={exercise.exerciseId}
            exercise={exercise}
            weightUnit={weightUnit}
            history={getExerciseHistory(exercise.exerciseId)}
            onAddSet={(set) => onAddSet(exercise.exerciseId, set)}
            onUpdateSet={(setNumber, updates) => onUpdateSet(exercise.exerciseId, setNumber, updates)}
            onRemoveSet={(setNumber) => onRemoveSet(exercise.exerciseId, setNumber)}
            onRemoveExercise={() => onRemoveExercise(exercise.exerciseId)}
          />
        ))}
      </div>

      {/* Add Exercise Button */}
      <Button
        variant="outline"
        onClick={() => setShowExercisePicker(true)}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Exercise
      </Button>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        open={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleAddExercise}
      />

      {/* Workout Summary Modal */}
      <WorkoutSummary
        open={showSummary}
        onOpenChange={setShowSummary}
        workout={workout}
        duration={duration}
        newPRs={pendingPRs}
        weightUnit={weightUnit}
        onSave={handleSaveWorkout}
        onContinue={handleContinue}
      />
    </div>
  );
}
