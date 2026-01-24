import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Timer, 
  X,
  Check,
  Trophy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WorkoutSession, ExerciseSet } from '@/types/workout-tracker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ActiveWorkoutProps {
  session: WorkoutSession;
  onAddSet: (exerciseId: string, set: Omit<ExerciseSet, 'setNumber'>) => void;
  onUpdateSet: (exerciseId: string, setNumber: number, updates: Partial<ExerciseSet>) => void;
  onRemoveSet: (exerciseId: string, setNumber: number) => void;
  onAddExercise: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onFinish: (notes?: string) => void;
  onCancel: () => void;
}

export function ActiveWorkout({
  session,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onAddExercise,
  onRemoveExercise,
  onFinish,
  onCancel,
}: ActiveWorkoutProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set(session.exercises.map(e => e.id))
  );
  const [newExerciseName, setNewExerciseName] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);

  // Timer
  useEffect(() => {
    const startTime = new Date(session.startTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (id: string) => {
    setExpandedExercises(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSet = (exerciseId: string) => {
    // Get last set values as defaults
    const exercise = session.exercises.find(e => e.id === exerciseId);
    const lastSet = exercise?.sets[exercise.sets.length - 1];
    onAddSet(exerciseId, {
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      isWarmup: false,
    });
  };

  const handleAddExercise = () => {
    if (newExerciseName.trim()) {
      onAddExercise(newExerciseName.trim());
      setNewExerciseName('');
      setShowAddExercise(false);
    }
  };

  const handleFinish = () => {
    onFinish(notes || undefined);
  };

  return (
    <div className="space-y-4">
      {/* Header with timer */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{session.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(session.startTime).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xl font-mono">
                <Timer className="w-5 h-5 text-primary" />
                {formatTime(elapsedTime)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleFinish}>
                  <Check className="w-4 h-4 mr-1" />
                  Finish
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-3">
        {session.exercises.map((exercise) => (
          <Collapsible
            key={exercise.id}
            open={expandedExercises.has(exercise.id)}
            onOpenChange={() => toggleExercise(exercise.id)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{exercise.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {exercise.sets.length} sets
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveExercise(exercise.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {expandedExercises.has(exercise.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {/* Sets header */}
                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 text-xs text-muted-foreground mb-2 px-1">
                    <span>Set</span>
                    <span>Weight (kg)</span>
                    <span>Reps</span>
                    <span>Type</span>
                    <span></span>
                  </div>

                  {/* Sets */}
                  <div className="space-y-2">
                    {exercise.sets.map((set) => (
                      <div
                        key={set.setNumber}
                        className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 items-center"
                      >
                        <span className="text-sm font-medium text-center">
                          {set.setNumber}
                        </span>
                        <Input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) =>
                            onUpdateSet(exercise.id, set.setNumber, {
                              weight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-9"
                          placeholder="0"
                        />
                        <Input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) =>
                            onUpdateSet(exercise.id, set.setNumber, {
                              reps: parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-9"
                          placeholder="0"
                        />
                        <Button
                          variant={set.isWarmup ? 'secondary' : 'outline'}
                          size="sm"
                          className="h-9"
                          onClick={() =>
                            onUpdateSet(exercise.id, set.setNumber, {
                              isWarmup: !set.isWarmup,
                            })
                          }
                        >
                          {set.isWarmup ? 'Warmup' : 'Working'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => onRemoveSet(exercise.id, set.setNumber)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add set button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handleAddSet(exercise.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Set
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Add exercise */}
      {showAddExercise ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Exercise name..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
              />
              <Button onClick={handleAddExercise}>Add</Button>
              <Button variant="outline" onClick={() => setShowAddExercise(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAddExercise(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      )}

      {/* Notes */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Workout Notes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the workout feel? Any notes..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Finish workout */}
      <Button className="w-full" size="lg" onClick={handleFinish}>
        <Trophy className="w-5 h-5 mr-2" />
        Finish Workout
      </Button>
    </div>
  );
}
