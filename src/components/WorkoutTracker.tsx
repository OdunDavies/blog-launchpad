import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, History, BarChart3, Settings } from 'lucide-react';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';
import { ActiveWorkout } from './tracker/ActiveWorkout';
import { WorkoutHistory } from './tracker/WorkoutHistory';
import { WorkoutStats } from './tracker/WorkoutStats';
import { StartWorkoutModal } from './tracker/StartWorkoutModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LoggedExercise, WeightUnit } from '@/types/workout-tracker';

export function WorkoutTracker() {
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'stats'>('active');
  
  const {
    workoutLogs,
    activeWorkout,
    exercisePRs,
    weightUnit,
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
    getExerciseHistory,
    getStats,
  } = useWorkoutTracker();

  const stats = getStats();

  const handleStartBlank = (name?: string) => {
    startWorkout(name);
    setStartModalOpen(false);
    setActiveTab('active');
  };

  const handleStartFromTemplate = (
    templateId: string, 
    name: string, 
    exercises: Array<{ exerciseId: string; exerciseName: string }>
  ) => {
    const loggedExercises: LoggedExercise[] = exercises.map(e => ({
      exerciseId: e.exerciseId,
      exerciseName: e.exerciseName,
      sets: [{
        setNumber: 1,
        weight: 0,
        weightUnit,
        reps: 0,
        completed: false,
      }],
    }));
    
    startWorkout(name, templateId, loggedExercises);
    setStartModalOpen(false);
    setActiveTab('active');
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm py-1 px-3">
            {stats.totalWorkouts} workouts
          </Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">
            {stats.thisWeekWorkouts} this week
          </Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">
            {stats.totalPRs} PRs
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-sm text-muted-foreground">Unit:</Label>
          <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as WeightUnit)}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      {activeWorkout ? (
        <ActiveWorkout
          workout={activeWorkout}
          weightUnit={weightUnit}
          exercisePRs={exercisePRs}
          onAddExercise={addExercise}
          onRemoveExercise={removeExercise}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onRemoveSet={removeSet}
          onFinish={finishWorkout}
          onCancel={cancelWorkout}
          getExerciseHistory={getExerciseHistory}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history' | 'stats')}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="mt-0">
            <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-8 text-center">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Work Out?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start a new workout session to track your exercises, sets, and reps. 
                  We'll automatically detect and celebrate your personal records!
                </p>
                <Button size="lg" onClick={() => setStartModalOpen(true)}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <WorkoutHistory
              workoutLogs={workoutLogs}
              weightUnit={weightUnit}
              onDeleteLog={deleteWorkoutLog}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <WorkoutStats
              workoutLogs={workoutLogs}
              exercisePRs={exercisePRs}
              weightUnit={weightUnit}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Start Workout Modal */}
      <StartWorkoutModal
        open={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        onStartBlank={handleStartBlank}
        onStartFromTemplate={handleStartFromTemplate}
      />
    </div>
  );
}
