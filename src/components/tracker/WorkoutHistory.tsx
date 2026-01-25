import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Dumbbell, Trophy, Trash2, Smile, Meh, Frown, Zap, Battery, ChevronRight } from 'lucide-react';
import { WorkoutLog, calculateLogVolume, WorkoutMood } from '@/types/workout-tracker';

interface WorkoutHistoryProps {
  logs: WorkoutLog[];
  onDeleteLog: (logId: string) => void;
}

const moodIcons: Record<WorkoutMood, React.ReactNode> = {
  great: <Zap className="w-4 h-4 text-green-500" />,
  good: <Smile className="w-4 h-4 text-blue-500" />,
  okay: <Meh className="w-4 h-4 text-yellow-500" />,
  tired: <Frown className="w-4 h-4 text-orange-500" />,
  exhausted: <Battery className="w-4 h-4 text-red-500" />,
};

export function WorkoutHistory({ logs, onDeleteLog }: WorkoutHistoryProps) {
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hrs = Math.floor(minutes / 60);
    if (hrs > 0) {
      return `${hrs}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Workouts Yet</h3>
          <p className="text-muted-foreground">
            Start your first workout to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {logs.map((log) => {
          const volume = calculateLogVolume(log);
          const hasPR = log.exercises.some(ex => ex.sets.some(s => s.isPR));
          const totalSets = log.exercises.reduce((sum, ex) => 
            sum + ex.sets.filter(s => !s.isWarmup).length, 0
          );

          return (
            <Card
              key={log.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedLog(log)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{log.workoutName || 'Workout'}</p>
                      {hasPR && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 text-xs">
                          <Trophy className="w-3 h-3 mr-1" /> PR
                        </Badge>
                      )}
                      {log.mood && moodIcons[log.mood]}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(log.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <p className="font-medium">{formatDuration(log.duration)}</p>
                      <p className="text-muted-foreground">{totalSets} sets</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {log.exercises.slice(0, 3).map((ex) => (
                    <Badge key={ex.exerciseId} variant="secondary" className="text-xs">
                      {ex.exerciseName}
                    </Badge>
                  ))}
                  {log.exercises.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{log.exercises.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog?.workoutName || 'Workout'}
              {selectedLog?.mood && moodIcons[selectedLog.mood]}
            </DialogTitle>
            <DialogDescription>
              {selectedLog && formatDate(selectedLog.date)} • {formatDuration(selectedLog?.duration)}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Stats Row */}
              <div className="flex gap-3 mb-4">
                <Card className="flex-1">
                  <CardContent className="p-3 text-center">
                    <Dumbbell className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-bold">{selectedLog.exercises.length}</p>
                    <p className="text-xs text-muted-foreground">Exercises</p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-3 text-center">
                    <Clock className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-bold">
                      {selectedLog.exercises.reduce((sum, ex) => 
                        sum + ex.sets.filter(s => !s.isWarmup).length, 0
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Sets</p>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-3 text-center">
                    <Trophy className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-bold">
                      {Math.round(calculateLogVolume(selectedLog)).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">kg</p>
                  </CardContent>
                </Card>
              </div>

              {/* Exercises */}
              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-3">
                  {selectedLog.exercises.map((exercise) => (
                    <div key={exercise.exerciseId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{exercise.exerciseName}</p>
                        {exercise.sets.some(s => s.isPR) && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="space-y-1">
                        {exercise.sets.map((set) => (
                          <div
                            key={set.setNumber}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="w-8">{set.isWarmup ? 'W' : set.setNumber}</span>
                            <span>{set.weight} {set.weightUnit} × {set.reps}</span>
                            {set.isPR && <Trophy className="w-3 h-3 text-yellow-500" />}
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {selectedLog.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.notes}</p>
                  </div>
                )}
              </ScrollArea>

              {/* Delete Button */}
              <div className="pt-4 border-t mt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Workout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this workout from your history. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDeleteLog(selectedLog.id);
                          setSelectedLog(null);
                        }}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
