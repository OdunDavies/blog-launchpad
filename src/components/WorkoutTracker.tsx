import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, History, Trophy, BarChart3 } from 'lucide-react';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';
import { ActiveWorkout } from '@/components/workout-tracker/ActiveWorkout';
import { WorkoutHistory } from '@/components/workout-tracker/WorkoutHistory';
import { WorkoutStats } from '@/components/workout-tracker/WorkoutStats';
import { ProgressCharts } from '@/components/workout-tracker/ProgressCharts';
import { StartWorkoutModal } from '@/components/workout-tracker/StartWorkoutModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function WorkoutTracker() {
  const [showStartModal, setShowStartModal] = useState(false);
  const [activeTrackerTab, setActiveTrackerTab] = useState('history');
  
  const {
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
  } = useWorkoutTracker();

  const stats = getStats();

  const handleStartWorkout = (
    name: string,
    exercises: { name: string; targetSets: number; targetReps: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => {
    startSession(name, exercises, source, sourceId, sourceDayIndex);
    toast.success('Workout started! Let\'s go! 💪');
  };

  const handleFinishWorkout = (notes?: string) => {
    const result = finishSession(notes);
    if (result) {
      const { newPRs } = result;
      if (newPRs.length > 0) {
        toast.success(`🏆 ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}! Great work!`);
      } else {
        toast.success('Workout complete! Nice work! 💪');
      }
    }
  };

  const handleCancelWorkout = () => {
    cancelSession();
    toast.info('Workout cancelled');
  };

  // If there's an active session, show the active workout view
  if (activeSession) {
    return (
      <ActiveWorkout
        session={activeSession}
        onAddSet={addSet}
        onUpdateSet={updateSet}
        onRemoveSet={removeSet}
        onAddExercise={addExercise}
        onRemoveExercise={removeExercise}
        onFinish={handleFinishWorkout}
        onCancel={handleCancelWorkout}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Start Workout Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Ready to train?</h3>
          <p className="text-sm text-muted-foreground">
            Track your sets, reps, and weights in real-time
          </p>
        </div>
        <Button size="lg" onClick={() => setShowStartModal(true)} className="gap-2">
          <Play className="w-5 h-5" />
          Start Workout
        </Button>
      </div>

      {/* Stats Overview */}
      <WorkoutStats stats={stats} />

      {/* Tabs for History, PRs, Progress */}
      <Tabs value={activeTrackerTab} onValueChange={setActiveTrackerTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="prs" className="gap-2">
            <Trophy className="w-4 h-4" />
            PRs
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <WorkoutHistory sessions={sessions} onDeleteSession={deleteSession} />
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          {personalRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No PRs Yet</h3>
                <p className="text-muted-foreground">
                  Complete workouts to start tracking your personal records.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {personalRecords
                .sort((a, b) => b.estimated1RM - a.estimated1RM)
                .map((pr) => (
                  <Card key={pr.exerciseName}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        {pr.exerciseName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{pr.weight}</span>
                        <span className="text-muted-foreground">kg × {pr.reps}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Est. 1RM: {pr.estimated1RM} kg
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(pr.date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <ProgressCharts sessions={sessions} />
        </TabsContent>
      </Tabs>

      {/* Start Workout Modal */}
      <StartWorkoutModal
        open={showStartModal}
        onOpenChange={setShowStartModal}
        onStart={handleStartWorkout}
      />
    </div>
  );
}
