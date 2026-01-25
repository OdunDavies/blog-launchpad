import { useState, useEffect, useCallback } from 'react';
import {
  WorkoutLog,
  LoggedExercise,
  WorkoutSet,
  ExercisePR,
  ActiveWorkoutState,
  WeightUnit,
  WorkoutMood,
  WorkoutStats,
  ExerciseHistory,
  WORKOUT_LOGS_KEY,
  ACTIVE_WORKOUT_KEY,
  EXERCISE_PRS_KEY,
  WEIGHT_UNIT_KEY,
  LEGACY_SESSIONS_KEY,
  LEGACY_PRS_KEY,
  calculate1RM,
  calculateLogVolume,
  generateExerciseId,
} from '@/types/workout-tracker';

// Migration function for legacy data
function migrateLegacyData(): { logs: WorkoutLog[]; prs: Record<string, ExercisePR> } {
  const legacySessions = localStorage.getItem(LEGACY_SESSIONS_KEY);
  const legacyPRs = localStorage.getItem(LEGACY_PRS_KEY);
  
  let logs: WorkoutLog[] = [];
  let prs: Record<string, ExercisePR> = {};
  
  if (legacySessions) {
    try {
      const oldSessions = JSON.parse(legacySessions);
      logs = oldSessions.map((session: any) => ({
        id: session.id,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        workoutName: session.name,
        templateId: session.sourceId,
        templateDayIndex: session.sourceDayIndex,
        exercises: session.exercises.map((ex: any) => ({
          exerciseId: generateExerciseId(ex.name),
          exerciseName: ex.name,
          sets: ex.sets.map((set: any) => ({
            ...set,
            weightUnit: 'kg' as WeightUnit,
            completed: true,
          })),
          notes: ex.notes,
        })),
        notes: session.notes,
        source: session.source,
        sourceId: session.sourceId,
        sourceDayIndex: session.sourceDayIndex,
      }));
      localStorage.removeItem(LEGACY_SESSIONS_KEY);
    } catch (e) {
      console.error('Failed to migrate legacy sessions:', e);
    }
  }
  
  if (legacyPRs) {
    try {
      const oldPRs = JSON.parse(legacyPRs);
      oldPRs.forEach((pr: any) => {
        const exerciseId = generateExerciseId(pr.exerciseName);
        prs[exerciseId] = {
          exerciseId,
          exerciseName: pr.exerciseName,
          weight: pr.weight,
          weightUnit: 'kg' as WeightUnit,
          reps: pr.reps,
          estimated1RM: pr.estimated1RM,
          date: pr.date,
          workoutLogId: pr.sessionId,
        };
      });
      localStorage.removeItem(LEGACY_PRS_KEY);
    } catch (e) {
      console.error('Failed to migrate legacy PRs:', e);
    }
  }
  
  return { logs, prs };
}

export function useWorkoutTracker() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [prs, setPRs] = useState<Record<string, ExercisePR>>({});
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  // Load from localStorage on mount
  useEffect(() => {
    // Check for legacy data first
    const { logs: migratedLogs, prs: migratedPRs } = migrateLegacyData();
    
    const savedLogs = localStorage.getItem(WORKOUT_LOGS_KEY);
    const savedPRs = localStorage.getItem(EXERCISE_PRS_KEY);
    const savedActiveWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    const savedWeightUnit = localStorage.getItem(WEIGHT_UNIT_KEY);

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else if (migratedLogs.length > 0) {
      setLogs(migratedLogs);
    }

    if (savedPRs) {
      setPRs(JSON.parse(savedPRs));
    } else if (Object.keys(migratedPRs).length > 0) {
      setPRs(migratedPRs);
    }

    if (savedActiveWorkout) {
      setActiveWorkout(JSON.parse(savedActiveWorkout));
    }

    if (savedWeightUnit) {
      setWeightUnit(savedWeightUnit as WeightUnit);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(EXERCISE_PRS_KEY, JSON.stringify(prs));
  }, [prs]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, [activeWorkout]);

  useEffect(() => {
    localStorage.setItem(WEIGHT_UNIT_KEY, weightUnit);
  }, [weightUnit]);

  // Start a new workout
  const startSession = useCallback((
    name: string,
    exercises: { name: string; targetSets?: number; targetReps?: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => {
    const now = new Date().toISOString();
    const newWorkout: ActiveWorkoutState = {
      id: crypto.randomUUID(),
      startTime: now,
      workoutName: name,
      templateId: sourceId,
      templateDayIndex: sourceDayIndex,
      exercises: exercises.map((ex) => ({
        exerciseId: generateExerciseId(ex.name),
        exerciseName: ex.name,
        sets: [],
      })),
      source,
      sourceId,
      sourceDayIndex,
    };
    setActiveWorkout(newWorkout);
    return newWorkout;
  }, []);

  // Check if a set is a PR
  const checkIfPR = useCallback((exerciseId: string, weight: number, reps: number): boolean => {
    if (weight === 0 || reps === 0) return false;
    const estimated1RM = calculate1RM(weight, reps);
    const existingPR = prs[exerciseId];
    return !existingPR || estimated1RM > existingPR.estimated1RM;
  }, [prs]);

  // Add a set to an exercise
  const addSet = useCallback((exerciseId: string, set: Omit<WorkoutSet, 'setNumber'>) => {
    if (!activeWorkout) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId === exerciseId) {
            const newSet: WorkoutSet = {
              ...set,
              setNumber: ex.sets.length + 1,
              isPR: !set.isWarmup && checkIfPR(exerciseId, set.weight, set.reps),
            };
            return { ...ex, sets: [...ex.sets, newSet] };
          }
          return ex;
        }),
      };
    });
  }, [activeWorkout, checkIfPR]);

  // Update a set
  const updateSet = useCallback((exerciseId: string, setNumber: number, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => {
                if (s.setNumber === setNumber) {
                  const updated = { ...s, ...updates };
                  // Re-check PR status when weight/reps change
                  if ((updates.weight !== undefined || updates.reps !== undefined) && !updated.isWarmup) {
                    updated.isPR = checkIfPR(exerciseId, updated.weight, updated.reps);
                  }
                  if (updated.isWarmup) {
                    updated.isPR = false;
                  }
                  return updated;
                }
                return s;
              }),
            };
          }
          return ex;
        }),
      };
    });
  }, [activeWorkout, checkIfPR]);

  // Remove a set
  const removeSet = useCallback((exerciseId: string, setNumber: number) => {
    if (!activeWorkout) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId === exerciseId) {
            const newSets = ex.sets
              .filter(s => s.setNumber !== setNumber)
              .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
            return { ...ex, sets: newSets };
          }
          return ex;
        }),
      };
    });
  }, [activeWorkout]);

  // Add exercise to workout
  const addExercise = useCallback((name: string) => {
    if (!activeWorkout) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;
      const newExercise: LoggedExercise = {
        exerciseId: generateExerciseId(name),
        exerciseName: name,
        sets: [],
      };
      return {
        ...prev,
        exercises: [...prev.exercises, newExercise],
      };
    });
  }, [activeWorkout]);

  // Remove exercise from workout
  const removeExercise = useCallback((exerciseId: string) => {
    if (!activeWorkout) return;

    setActiveWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.exerciseId !== exerciseId),
      };
    });
  }, [activeWorkout]);

  // Collect new PRs from workout
  const collectNewPRs = useCallback((workout: ActiveWorkoutState): ExercisePR[] => {
    const newPRs: ExercisePR[] = [];

    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.isWarmup || set.reps === 0 || set.weight === 0) return;

        const estimated1RM = calculate1RM(set.weight, set.reps);
        const existingPR = prs[exercise.exerciseId];

        if (!existingPR || estimated1RM > existingPR.estimated1RM) {
          // Check if we already have a better PR in newPRs
          const existingNew = newPRs.find(pr => pr.exerciseId === exercise.exerciseId);
          if (!existingNew || estimated1RM > existingNew.estimated1RM) {
            // Remove the old one if exists
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
  }, [prs]);

  // Finish workout
  const finishSession = useCallback((notes?: string, mood?: WorkoutMood) => {
    if (!activeWorkout) return null;

    const now = new Date();
    const startTime = new Date(activeWorkout.startTime);
    const duration = Math.round((now.getTime() - startTime.getTime()) / 60000);

    // Collect PRs
    const newPRs = collectNewPRs(activeWorkout);

    // Mark sets as PRs and complete them
    const completedExercises = activeWorkout.exercises.map(ex => {
      const prForExercise = newPRs.find(pr => pr.exerciseId === ex.exerciseId);
      return {
        ...ex,
        sets: ex.sets.map(set => ({
          ...set,
          completed: true,
          isPR: prForExercise && 
                set.weight === prForExercise.weight && 
                set.reps === prForExercise.reps,
        })),
      };
    });

    const completedLog: WorkoutLog = {
      id: activeWorkout.id,
      date: startTime.toISOString().split('T')[0],
      startTime: activeWorkout.startTime,
      endTime: now.toISOString(),
      duration,
      workoutName: activeWorkout.workoutName,
      templateId: activeWorkout.templateId,
      templateDayIndex: activeWorkout.templateDayIndex,
      exercises: completedExercises,
      notes,
      mood,
      source: activeWorkout.source,
      sourceId: activeWorkout.sourceId,
      sourceDayIndex: activeWorkout.sourceDayIndex,
    };

    // Update PRs
    if (newPRs.length > 0) {
      setPRs(prev => {
        const updated = { ...prev };
        newPRs.forEach(pr => {
          updated[pr.exerciseId] = pr;
        });
        return updated;
      });
    }

    setLogs(prev => [completedLog, ...prev]);
    setActiveWorkout(null);

    return { log: completedLog, newPRs };
  }, [activeWorkout, collectNewPRs]);

  // Cancel workout
  const cancelSession = useCallback(() => {
    setActiveWorkout(null);
  }, []);

  // Delete a log
  const deleteSession = useCallback((logId: string) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  }, []);

  // Get exercise history
  const getExerciseHistory = useCallback((exerciseId: string): ExerciseHistory[] => {
    return logs
      .filter(log => log.exercises.some(e => e.exerciseId === exerciseId))
      .map(log => {
        const exercise = log.exercises.find(e => e.exerciseId === exerciseId);
        const sets = exercise?.sets || [];
        
        // Find best set (highest estimated 1RM)
        let bestSet: ExerciseHistory['bestSet'] = undefined;
        sets.forEach(set => {
          if (!set.isWarmup && set.weight > 0 && set.reps > 0) {
            const est1RM = calculate1RM(set.weight, set.reps);
            if (!bestSet || est1RM > bestSet.estimated1RM) {
              bestSet = { weight: set.weight, reps: set.reps, estimated1RM: est1RM };
            }
          }
        });

        return {
          date: log.date,
          workoutLogId: log.id,
          sets,
          bestSet,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs]);

  // Calculate streak
  const calculateStreak = useCallback((): number => {
    if (logs.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique workout dates sorted descending
    const workoutDates = [...new Set(logs.map(l => l.date))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    let currentDate = new Date(today);

    for (const dateStr of workoutDates) {
      const workoutDate = new Date(dateStr);
      workoutDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  }, [logs]);

  // Get stats
  const getStats = useCallback((): WorkoutStats => {
    return {
      totalSessions: logs.length,
      totalVolume: logs.reduce((sum, l) => sum + calculateLogVolume(l), 0),
      totalDuration: logs.reduce((sum, l) => sum + (l.duration || 0), 0),
      exerciseCount: new Set(logs.flatMap(l => l.exercises.map(e => e.exerciseId))).size,
      prCount: Object.keys(prs).length,
      currentStreak: calculateStreak(),
    };
  }, [logs, prs, calculateStreak]);

  // Get PR for an exercise
  const getExercisePR = useCallback((exerciseId: string): ExercisePR | undefined => {
    return prs[exerciseId];
  }, [prs]);

  return {
    // Data
    sessions: logs, // Alias for backwards compatibility
    logs,
    personalRecords: Object.values(prs), // Array for backwards compatibility
    prs,
    activeSession: activeWorkout, // Alias for backwards compatibility
    activeWorkout,
    weightUnit,

    // Actions
    setWeightUnit,
    startSession,
    addSet,
    updateSet,
    removeSet,
    addExercise,
    removeExercise,
    finishSession,
    cancelSession,
    deleteSession,

    // Queries
    getStats,
    getExerciseHistory,
    getExercisePR,
    checkIfPR,
    calculate1RM,
  };
}
