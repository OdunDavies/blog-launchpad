import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Trophy
} from 'lucide-react';
import { WorkoutSession, calculateSessionVolume } from '@/types/workout-tracker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
  onDeleteSession: (sessionId: string) => void;
}

export function WorkoutHistory({ sessions, onDeleteSession }: WorkoutHistoryProps) {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (id: string) => {
    setExpandedSessions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Workouts Yet</h3>
          <p className="text-muted-foreground">
            Start your first workout to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const volume = calculateSessionVolume(session);
        const hasPRs = session.exercises.some(ex => ex.sets.some(s => s.isPR));
        
        return (
          <Collapsible
            key={session.id}
            open={expandedSessions.has(session.id)}
            onOpenChange={() => toggleSession(session.id)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3 px-3 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className="text-sm sm:text-base truncate">{session.name}</CardTitle>
                        {hasPRs && (
                          <Badge variant="default" className="text-xs gap-1 shrink-0">
                            <Trophy className="w-3 h-3" />
                            PR
                          </Badge>
                        )}
                      </div>
                      {/* Mobile: Stack metadata vertically */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {formatDate(session.date)}
                        </span>
                        <div className="flex items-center gap-3 sm:gap-4">
                          {session.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {formatDuration(session.duration)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" />
                            {(volume / 1000).toFixed(1)}k kg
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="mx-4 sm:mx-auto max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this workout session. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDeleteSession(session.id)}
                              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {expandedSessions.has(session.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 px-3 sm:px-6 space-y-4">
                  {session.exercises.map((exercise) => (
                    <div key={exercise.id} className="space-y-2">
                      <h4 className="font-medium text-sm">{exercise.name}</h4>
                      <div className="grid gap-1">
                        {exercise.sets.map((set) => (
                          <div
                            key={set.setNumber}
                            className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/50 rounded px-2 sm:px-3 py-1.5"
                          >
                            <span className="text-muted-foreground w-10 sm:w-12">
                              Set {set.setNumber}
                            </span>
                            <span className="font-medium">
                              {set.weight} kg × {set.reps}
                            </span>
                            {set.isWarmup && (
                              <Badge variant="secondary" className="text-xs">
                                Warmup
                              </Badge>
                            )}
                            {set.isPR && (
                              <Badge variant="default" className="text-xs gap-1">
                                <Trophy className="w-3 h-3" />
                                PR
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {session.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {session.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
