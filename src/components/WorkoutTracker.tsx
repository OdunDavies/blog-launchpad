import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, History, Trophy, BarChart3, Scale } from 'lucide-react';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';
import { ActiveWorkout } from '@/components/tracker/ActiveWorkout';
import { WorkoutHistory } from '@/components/tracker/WorkoutHistory';
import { WorkoutStats } from '@/components/tracker/WorkoutStats';
import { ProgressCharts } from '@/components/tracker/ProgressCharts';
import { StartWorkoutModal } from '@/components/tracker/StartWorkoutModal';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function WorkoutTracker() {
  const [showStartModal, setShowStartModal] = useState(false);
  const [activeTrackerTab, setActiveTrackerTab] = useState('history');
  
  const {
    logs,
    prs,
    activeWorkout,
    weightUnit,
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
    getStats,
    getExerciseHistory,
  } = useWorkoutTracker();

  const stats = getStats();

  const handleStartWorkout = (
    name: string,
    exercises: { name: string; targetSets?: number; targetReps?: string }[],
    source?: 'template' | 'ai-generated' | 'custom',
    sourceId?: string,
    sourceDayIndex?: number
  ) => {
    startSession(name, exercises, source, sourceId, sourceDayIndex);
    toast.success('Workout started! Let\'s go! 💪');
  };

  const handleFinishWorkout = (notes?: string, mood?: import('@/types/workout-tracker').WorkoutMood) => {
    const result = finishSession(notes, mood);
    if (result) {
      const { newPRs } = result;
      if (newPRs.length > 0) {
        toast.success(`🏆 ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}! Great work!`);
      } else {
        toast.success('Workout complete! Nice work! 💪');
      }
    }
    return result;
  };

  const handleCancelWorkout = () => {
    cancelSession();
    toast.info('Workout cancelled');
  };

  const toggleWeightUnit = () => {
    setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg');
  };

  // If there's an active workout, show the active workout view
  if (activeWorkout) {
    return (
      <ActiveWorkout
        workout={activeWorkout}
        weightUnit={weightUnit}
        prs={prs}
        getExerciseHistory={getExerciseHistory}
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
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-muted/50 gap-1"
            onClick={toggleWeightUnit}
          >
            <Scale className="w-3 h-3" />
            {weightUnit.toUpperCase()}
          </Badge>
          <Button size="lg" onClick={() => setShowStartModal(true)} className="gap-2">
            <Play className="w-5 h-5" />
            Start Workout
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <WorkoutStats stats={stats} logs={logs} prs={prs} />

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
          <WorkoutHistory logs={logs} onDeleteLog={deleteSession} />
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          {Object.keys(prs).length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">No PRs Yet</h3>
              <p className="text-muted-foreground">
                Complete workouts to start tracking your personal records.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(prs)
                .sort((a, b) => b.estimated1RM - a.estimated1RM)
                .map((pr) => (
                  <div key={pr.exerciseId} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">{pr.exerciseName}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{pr.weight}</span>
                      <span className="text-muted-foreground">{pr.weightUnit} × {pr.reps}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>Est. 1RM: {pr.estimated1RM} {pr.weightUnit}</span>
                      <span>{new Date(pr.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <ProgressCharts logs={logs} />
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
