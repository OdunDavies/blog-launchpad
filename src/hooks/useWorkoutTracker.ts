import { useState, useEffect, useCallback } from 'react';
import { 
  WorkoutSession, 
  PersonalRecord, 
  TrackedExercise, 
  ExerciseSet,
  calculateEstimated1RM,
  calculateSessionVolume
} from '@/types/workout-tracker';

const SESSIONS_KEY = 'muscleatlas-workout-sessions';
const PRS_KEY = 'muscleatlas-personal-records';

export function useWorkoutTracker() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(SESSIONS_KEY);
    const savedPRs = localStorage.getItem(PRS_KEY);
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedPRs) {
      setPersonalRecords(JSON.parse(savedPRs));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(PRS_KEY, JSON.stringify(personalRecords));
  }, [personalRecords]);

  // Start a new workout session
  const startSession = useCallback((
    name: string,
    exercises: { name: string; targetSets: number; targetReps: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => {
    const now = new Date().toISOString();
    const newSession: WorkoutSession = {
      id: crypto.randomUUID(),
      name,
      date: now.split('T')[0],
      startTime: now,
      exercises: exercises.map((ex, idx) => ({
        id: `${Date.now()}-${idx}`,
        name: ex.name,
        sets: [],
      })),
      source,
      sourceId,
      sourceDayIndex,
    };
    setActiveSession(newSession);
    return newSession;
  }, []);

  // Add a set to an exercise in the active session
  const addSet = useCallback((exerciseId: string, set: Omit<ExerciseSet, 'setNumber'>) => {
    if (!activeSession) return;
    
    setActiveSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const newSet: ExerciseSet = {
              ...set,
              setNumber: ex.sets.length + 1,
            };
            return { ...ex, sets: [...ex.sets, newSet] };
          }
          return ex;
        }),
      };
    });
  }, [activeSession]);

  // Update a set in the active session
  const updateSet = useCallback((exerciseId: string, setNumber: number, updates: Partial<ExerciseSet>) => {
    if (!activeSession) return;
    
    setActiveSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(s => 
                s.setNumber === setNumber ? { ...s, ...updates } : s
              ),
            };
          }
          return ex;
        }),
      };
    });
  }, [activeSession]);

  // Remove a set from the active session
  const removeSet = useCallback((exerciseId: string, setNumber: number) => {
    if (!activeSession) return;
    
    setActiveSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.id === exerciseId) {
            const newSets = ex.sets
              .filter(s => s.setNumber !== setNumber)
              .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
            return { ...ex, sets: newSets };
          }
          return ex;
        }),
      };
    });
  }, [activeSession]);

  // Add exercise to active session
  const addExercise = useCallback((name: string) => {
    if (!activeSession) return;
    
    setActiveSession(prev => {
      if (!prev) return prev;
      const newExercise: TrackedExercise = {
        id: `${Date.now()}-${prev.exercises.length}`,
        name,
        sets: [],
      };
      return {
        ...prev,
        exercises: [...prev.exercises, newExercise],
      };
    });
  }, [activeSession]);

  // Remove exercise from active session
  const removeExercise = useCallback((exerciseId: string) => {
    if (!activeSession) return;
    
    setActiveSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
      };
    });
  }, [activeSession]);

  // Check and update PRs
  const checkForPRs = useCallback((session: WorkoutSession): PersonalRecord[] => {
    const newPRs: PersonalRecord[] = [];
    
    session.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.isWarmup || set.reps === 0 || set.weight === 0) return;
        
        const estimated1RM = calculateEstimated1RM(set.weight, set.reps);
        const existingPR = personalRecords.find(pr => pr.exerciseName === exercise.name);
        
        if (!existingPR || estimated1RM > existingPR.estimated1RM) {
          newPRs.push({
            exerciseName: exercise.name,
            weight: set.weight,
            reps: set.reps,
            estimated1RM,
            date: session.date,
            sessionId: session.id,
          });
        }
      });
    });
    
    return newPRs;
  }, [personalRecords]);

  // Finish the active session
  const finishSession = useCallback((notes?: string) => {
    if (!activeSession) return null;
    
    const now = new Date();
    const startTime = new Date(activeSession.startTime);
    const duration = Math.round((now.getTime() - startTime.getTime()) / 60000);
    
    const completedSession: WorkoutSession = {
      ...activeSession,
      endTime: now.toISOString(),
      duration,
      notes,
    };
    
    // Check for PRs
    const newPRs = checkForPRs(completedSession);
    
    // Mark sets as PRs
    if (newPRs.length > 0) {
      completedSession.exercises = completedSession.exercises.map(ex => {
        const prForExercise = newPRs.find(pr => pr.exerciseName === ex.name);
        if (prForExercise) {
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.weight === prForExercise.weight && set.reps === prForExercise.reps) {
                return { ...set, isPR: true };
              }
              return set;
            }),
          };
        }
        return ex;
      });
      
      // Update PRs
      setPersonalRecords(prev => {
        const updated = [...prev];
        newPRs.forEach(newPR => {
          const existingIdx = updated.findIndex(pr => pr.exerciseName === newPR.exerciseName);
          if (existingIdx >= 0) {
            updated[existingIdx] = newPR;
          } else {
            updated.push(newPR);
          }
        });
        return updated;
      });
    }
    
    setSessions(prev => [completedSession, ...prev]);
    setActiveSession(null);
    
    return { session: completedSession, newPRs };
  }, [activeSession, checkForPRs]);

  // Cancel active session
  const cancelSession = useCallback(() => {
    setActiveSession(null);
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    return {
      totalSessions: sessions.length,
      totalVolume: sessions.reduce((sum, s) => sum + calculateSessionVolume(s), 0),
      totalDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      exerciseCount: new Set(sessions.flatMap(s => s.exercises.map(e => e.name))).size,
      prCount: personalRecords.length,
    };
  }, [sessions, personalRecords]);

  // Get exercise history
  const getExerciseHistory = useCallback((exerciseName: string) => {
    return sessions
      .filter(s => s.exercises.some(e => e.name === exerciseName))
      .map(s => ({
        date: s.date,
        sessionId: s.id,
        sets: s.exercises.find(e => e.name === exerciseName)?.sets || [],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions]);

  return {
    sessions,
    personalRecords,
    activeSession,
    startSession,
    addSet,
    updateSet,
    removeSet,
    addExercise,
    removeExercise,
    finishSession,
    cancelSession,
    deleteSession,
    getStats,
    getExerciseHistory,
  };
}
