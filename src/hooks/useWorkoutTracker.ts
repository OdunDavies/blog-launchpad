import { useState, useEffect, useCallback } from 'react';
import {
  WorkoutLog,
  LoggedExercise,
  WorkoutSet,
  ExercisePR,
  ActiveWorkoutState,
  WeightUnit,
  WORKOUT_LOGS_KEY,
  ACTIVE_WORKOUT_KEY,
  EXERCISE_PRS_KEY,
  WEIGHT_UNIT_KEY,
} from '@/types/workout-tracker';
import { toast } from '@/hooks/use-toast';

// Brzycki Formula for estimated 1RM
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps > 12) return weight * (1 + reps / 30); // Rough approximation for high reps
  return weight / (1.0278 - 0.0278 * reps);
};

export function useWorkoutTracker() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [exercisePRs, setExercisePRs] = useState<Record<string, ExercisePR>>({});
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(WORKOUT_LOGS_KEY);
      if (savedLogs) setWorkoutLogs(JSON.parse(savedLogs));

      const savedActive = localStorage.getItem(ACTIVE_WORKOUT_KEY);
      if (savedActive) setActiveWorkout(JSON.parse(savedActive));

      const savedPRs = localStorage.getItem(EXERCISE_PRS_KEY);
      if (savedPRs) setExercisePRs(JSON.parse(savedPRs));

      const savedUnit = localStorage.getItem(WEIGHT_UNIT_KEY);
      if (savedUnit) setWeightUnit(savedUnit as WeightUnit);
    } catch (e) {
      console.error('Failed to load workout data:', e);
    }
  }, []);

  // Save workout logs
  useEffect(() => {
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // Save active workout
  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, [activeWorkout]);

  // Save PRs
  useEffect(() => {
    localStorage.setItem(EXERCISE_PRS_KEY, JSON.stringify(exercisePRs));
  }, [exercisePRs]);

  // Save weight unit
  useEffect(() => {
    localStorage.setItem(WEIGHT_UNIT_KEY, weightUnit);
  }, [weightUnit]);

  // Start a new workout
  const startWorkout = useCallback((name?: string, templateId?: string, exercises?: LoggedExercise[]) => {
    const newWorkout: ActiveWorkoutState = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      workoutName: name,
      templateId,
      exercises: exercises || [],
    };
    setActiveWorkout(newWorkout);
    return newWorkout;
  }, []);

  // Cancel the active workout
  const cancelWorkout = useCallback(() => {
    setActiveWorkout(null);
  }, []);

  // Add an exercise to the active workout
  const addExercise = useCallback((exerciseId: string, exerciseName: string) => {
    if (!activeWorkout) return;

    const newExercise: LoggedExercise = {
      exerciseId,
      exerciseName,
      sets: [{
        setNumber: 1,
        weight: 0,
        weightUnit,
        reps: 0,
        completed: false,
      }],
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise],
    });
  }, [activeWorkout, weightUnit]);

  // Remove an exercise from the active workout
  const removeExercise = useCallback((exerciseIndex: number) => {
    if (!activeWorkout) return;

    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((_, i) => i !== exerciseIndex),
    });
  }, [activeWorkout]);

  // Add a set to an exercise
  const addSet = useCallback((exerciseIndex: number, isWarmup?: boolean) => {
    if (!activeWorkout) return;

    const exercise = activeWorkout.exercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];

    const newSet: WorkoutSet = {
      setNumber: exercise.sets.filter(s => !s.isWarmup).length + 1,
      weight: lastSet?.weight || 0,
      weightUnit,
      reps: lastSet?.reps || 0,
      isWarmup,
      completed: false,
    };

    const newExercises = [...activeWorkout.exercises];
    newExercises[exerciseIndex] = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };

    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
  }, [activeWorkout, weightUnit]);

  // Update a set
  const updateSet = useCallback((exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;

    const newExercises = [...activeWorkout.exercises];
    const exercise = newExercises[exerciseIndex];
    const newSets = [...exercise.sets];
    newSets[setIndex] = { ...newSets[setIndex], ...updates };
    newExercises[exerciseIndex] = { ...exercise, sets: newSets };

    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
  }, [activeWorkout]);

  // Remove a set
  const removeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const newExercises = [...activeWorkout.exercises];
    const exercise = newExercises[exerciseIndex];
    newExercises[exerciseIndex] = {
      ...exercise,
      sets: exercise.sets.filter((_, i) => i !== setIndex),
    };

    setActiveWorkout({ ...activeWorkout, exercises: newExercises });
  }, [activeWorkout]);

  // Check and update PRs
  const checkAndUpdatePRs = useCallback((exercises: LoggedExercise[]) => {
    const newPRs = { ...exercisePRs };
    let prUpdated = false;

    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.isWarmup || !set.completed || set.weight === 0) return;

        const estimated1RM = calculate1RM(set.weight, set.reps);
        const currentPR = newPRs[exercise.exerciseId];

        if (!currentPR || estimated1RM > currentPR.estimated1RM) {
          newPRs[exercise.exerciseId] = {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            weight: set.weight,
            weightUnit: set.weightUnit,
            reps: set.reps,
            estimated1RM,
            date: new Date().toISOString(),
          };
          set.isPR = true;
          prUpdated = true;
        }
      });
    });

    if (prUpdated) {
      setExercisePRs(newPRs);
    }

    return prUpdated;
  }, [exercisePRs]);

  // Finish the workout
  const finishWorkout = useCallback((mood?: WorkoutLog['mood'], notes?: string) => {
    if (!activeWorkout) return null;

    const endTime = new Date().toISOString();
    const startDate = new Date(activeWorkout.startTime);
    const endDate = new Date(endTime);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    // Check for PRs before saving
    const prUpdated = checkAndUpdatePRs(activeWorkout.exercises);

    const completedWorkout: WorkoutLog = {
      id: activeWorkout.id,
      date: activeWorkout.startTime.split('T')[0],
      startTime: activeWorkout.startTime,
      endTime,
      duration,
      workoutName: activeWorkout.workoutName,
      templateId: activeWorkout.templateId,
      exercises: activeWorkout.exercises,
      mood,
      notes,
    };

    setWorkoutLogs(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);

    if (prUpdated) {
      toast({
        title: "🎉 New Personal Record!",
        description: "Congratulations! You've set a new PR!",
      });
    }

    return completedWorkout;
  }, [activeWorkout, checkAndUpdatePRs]);

  // Get exercise history
  const getExerciseHistory = useCallback((exerciseId: string) => {
    return workoutLogs
      .flatMap(log => log.exercises
        .filter(e => e.exerciseId === exerciseId)
        .map(e => ({
          date: log.date,
          sets: e.sets,
          bestSet: e.sets.reduce((best, set) => {
            if (set.isWarmup) return best;
            const current1RM = calculate1RM(set.weight, set.reps);
            const best1RM = best ? calculate1RM(best.weight, best.reps) : 0;
            return current1RM > best1RM ? set : best;
          }, null as WorkoutSet | null),
        }))
      )
      .filter(entry => entry.bestSet !== null);
  }, [workoutLogs]);

  // Delete a workout log
  const deleteWorkoutLog = useCallback((logId: string) => {
    setWorkoutLogs(prev => prev.filter(log => log.id !== logId));
  }, []);

  // Get workout duration in formatted string
  const getWorkoutDuration = useCallback(() => {
    if (!activeWorkout) return '0:00';
    const start = new Date(activeWorkout.startTime);
    const now = new Date();
    const minutes = Math.floor((now.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}:${remainingMinutes.toString().padStart(2, '0')}` 
      : `${minutes}m`;
  }, [activeWorkout]);

  // Get stats
  const getStats = useCallback(() => {
    const totalWorkouts = workoutLogs.length;
    const totalVolume = workoutLogs.reduce((sum, log) => {
      return sum + log.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + exercise.sets.reduce((setSum, set) => {
          if (set.isWarmup) return setSum;
          return setSum + (set.weight * set.reps);
        }, 0);
      }, 0);
    }, 0);

    const thisWeekWorkouts = workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length;

    return {
      totalWorkouts,
      totalVolume,
      thisWeekWorkouts,
      totalPRs: Object.keys(exercisePRs).length,
    };
  }, [workoutLogs, exercisePRs]);

  return {
    // State
    workoutLogs,
    activeWorkout,
    exercisePRs,
    weightUnit,
    
    // Actions
    setWeightUnit,
    startWorkout,
    cancelWorkout,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
    finishWorkout,
    deleteWorkoutLog,
    
    // Helpers
    getExerciseHistory,
    getWorkoutDuration,
    getStats,
  };
}
