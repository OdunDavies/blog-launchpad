import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Dumbbell, Trash2, ChevronRight, Target, Trophy } from 'lucide-react';
import { WorkoutLog, WeightUnit } from '@/types/workout-tracker';
import { format, parseISO } from 'date-fns';
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

interface WorkoutHistoryProps {
  workoutLogs: WorkoutLog[];
  weightUnit: WeightUnit;
  onDeleteLog: (logId: string) => void;
}

const moodEmoji: Record<string, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  tired: '😮‍💨',
  exhausted: '😩',
};

export function WorkoutHistory({ workoutLogs, weightUnit, onDeleteLog }: WorkoutHistoryProps) {
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  const handleDeleteClick = (logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLogToDelete(logId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (logToDelete) {
      onDeleteLog(logToDelete);
      setLogToDelete(null);
      setDeleteDialogOpen(false);
      if (selectedLog?.id === logToDelete) {
        setSelectedLog(null);
      }
    }
  };

  const calculateVolume = (log: WorkoutLog) => {
    return log.exercises.reduce((sum, e) => 
      sum + e.sets.filter(s => !s.isWarmup).reduce((setSum, s) => setSum + s.weight * s.reps, 0), 0
    );
  };

  const countSets = (log: WorkoutLog) => {
    return log.exercises.reduce((sum, e) => 
      sum + e.sets.filter(s => !s.isWarmup).length, 0
    );
  };

  const hasPRs = (log: WorkoutLog) => {
    return log.exercises.some(e => e.sets.some(s => s.isPR));
  };

  if (workoutLogs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No workout history yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your first workout to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {workoutLogs.map((log) => (
        <Card 
          key={log.id}
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setSelectedLog(log)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">
                    {log.workoutName || 'Workout'}
                  </h4>
                  {log.mood && (
                    <span>{moodEmoji[log.mood]}</span>
                  )}
                  {hasPRs(log) && (
                    <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
                      <Trophy className="w-3 h-3 mr-0.5" />
                      PR
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(parseISO(log.date), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {log.duration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5" />
                    {log.exercises.length} exercises
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteClick(log.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Workout Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedLog.workoutName || 'Workout'}
                  {selectedLog.mood && <span>{moodEmoji[selectedLog.mood]}</span>}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(parseISO(selectedLog.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedLog.duration} minutes
                  </span>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-3 my-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{selectedLog.exercises.length}</p>
                    <p className="text-xs text-muted-foreground">Exercises</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{countSets(selectedLog)}</p>
                    <p className="text-xs text-muted-foreground">Sets</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{(calculateVolume(selectedLog) / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">{weightUnit} Volume</p>
                  </CardContent>
                </Card>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {selectedLog.exercises.map((exercise, i) => (
                    <Card key={i}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {exercise.exerciseName}
                          {exercise.sets.some(s => s.isPR) && (
                            <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
                              <Trophy className="w-3 h-3 mr-0.5" />
                              PR
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {exercise.sets.map((set, j) => (
                            <div 
                              key={j} 
                              className="flex items-center gap-4 text-sm py-1 px-2 rounded bg-muted/50"
                            >
                              <span className="text-muted-foreground w-12">
                                {set.isWarmup ? 'Warmup' : `Set ${set.setNumber}`}
                              </span>
                              <span className="font-medium">
                                {set.weight} {weightUnit} × {set.reps}
                              </span>
                              {set.isPR && <Trophy className="w-4 h-4 text-yellow-500" />}
                            </div>
                          ))}
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            {exercise.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {selectedLog.notes && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{selectedLog.notes}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this workout from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
