import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Dumbbell, Calendar, Target, Flame } from 'lucide-react';
import { WorkoutLog, ExercisePR, WeightUnit } from '@/types/workout-tracker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface WorkoutStatsProps {
  workoutLogs: WorkoutLog[];
  exercisePRs: Record<string, ExercisePR>;
  weightUnit: WeightUnit;
}

export function WorkoutStats({ workoutLogs, exercisePRs, weightUnit }: WorkoutStatsProps) {
  // Calculate weekly workout data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const start = subDays(today, 27); // Last 4 weeks
    const weeks: Array<{ week: string; workouts: number; volume: number }> = [];

    for (let i = 0; i < 4; i++) {
      const weekStart = subDays(today, (3 - i) * 7 + 6);
      const weekEnd = subDays(today, (3 - i) * 7);
      
      const weekLogs = workoutLogs.filter(log => {
        const logDate = parseISO(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const volume = weekLogs.reduce((sum, log) => 
        sum + log.exercises.reduce((eSum, e) => 
          eSum + e.sets.filter(s => !s.isWarmup).reduce((sSum, s) => sSum + s.weight * s.reps, 0), 0
        ), 0
      );

      weeks.push({
        week: `Week ${i + 1}`,
        workouts: weekLogs.length,
        volume: Math.round(volume / 1000), // in thousands
      });
    }

    return weeks;
  }, [workoutLogs]);

  // Calculate workout streak
  const streak = useMemo(() => {
    if (workoutLogs.length === 0) return 0;
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasWorkout = workoutLogs.some(log => {
        const logDate = parseISO(log.date);
        logDate.setHours(0, 0, 0, 0);
        return isSameDay(logDate, checkDate);
      });
      
      if (hasWorkout) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return currentStreak;
  }, [workoutLogs]);

  // Stats summary
  const stats = useMemo(() => {
    const totalWorkouts = workoutLogs.length;
    const totalVolume = workoutLogs.reduce((sum, log) => 
      sum + log.exercises.reduce((eSum, e) => 
        eSum + e.sets.filter(s => !s.isWarmup).reduce((sSum, s) => sSum + s.weight * s.reps, 0), 0
      ), 0
    );
    const avgDuration = workoutLogs.length > 0
      ? Math.round(workoutLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / workoutLogs.length)
      : 0;
    const totalPRs = Object.keys(exercisePRs).length;

    return { totalWorkouts, totalVolume, avgDuration, totalPRs };
  }, [workoutLogs, exercisePRs]);

  const chartConfig = {
    workouts: { label: 'Workouts', color: 'hsl(var(--primary))' },
    volume: { label: 'Volume (k)', color: 'hsl(var(--primary))' },
  };

  // Sort PRs by date (most recent first)
  const sortedPRs = useMemo(() => {
    return Object.values(exercisePRs)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [exercisePRs]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Total Workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats.totalVolume / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Total {weightUnit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPRs}</p>
                <p className="text-xs text-muted-foreground">Personal Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workoutLogs.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Complete some workouts to see your progress
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPRs.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2">
              {sortedPRs.map((pr) => (
                <div 
                  key={pr.exerciseId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(pr.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {pr.weight} {pr.weightUnit} × {pr.reps}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No personal records yet</p>
              <p className="text-sm">Complete workouts to set PRs!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
