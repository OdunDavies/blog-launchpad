import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Clock, 
  Trophy, 
  TrendingUp,
  Calendar,
  Flame
} from 'lucide-react';
import { WorkoutStats as StatsType, WorkoutLog, ExercisePR } from '@/types/workout-tracker';

interface WorkoutStatsProps {
  stats: StatsType;
  logs: WorkoutLog[];
  prs: Record<string, ExercisePR>;
}

export function WorkoutStats({ stats, logs, prs }: WorkoutStatsProps) {
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    if (hrs > 0) {
      return `${hrs}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatVolume = (kg: number) => {
    if (kg >= 1000000) {
      return `${(kg / 1000000).toFixed(1)}M kg`;
    }
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)}k kg`;
    }
    return `${Math.round(kg)} kg`;
  };

  // Calculate 4-week frequency
  const weeklyFrequency = useMemo(() => {
    const now = new Date();
    const weeks: number[] = [0, 0, 0, 0];

    logs.forEach(log => {
      const logDate = new Date(log.date);
      const diffDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        weeks[3 - weekIndex]++;
      }
    });

    return weeks;
  }, [logs]);

  const maxWeekly = Math.max(...weeklyFrequency, 1);

  // Sort PRs by date (most recent first)
  const recentPRs = useMemo(() => {
    return Object.values(prs)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [prs]);

  const statCards = [
    {
      label: 'Workouts',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Volume',
      value: formatVolume(stats.totalVolume),
      icon: Dumbbell,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Time',
      value: formatDuration(stats.totalDuration),
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Streak',
      value: `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`,
      icon: Flame,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Activity & PRs */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Last 4 Weeks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {weeklyFrequency.map((count, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/20 rounded-t transition-all"
                    style={{ 
                      height: `${(count / maxWeekly) * 100}%`,
                      minHeight: count > 0 ? '8px' : '0px'
                    }}
                  >
                    <div
                      className="w-full h-full bg-primary rounded-t"
                      style={{ opacity: 0.4 + (count / maxWeekly) * 0.6 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">W{index + 1}</span>
                  <span className="text-xs font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent PRs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Recent PRs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPRs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No PRs yet. Keep training!
              </p>
            ) : (
              <div className="space-y-2">
                {recentPRs.map((pr) => (
                  <div key={pr.exerciseId} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1 mr-2">
                      {pr.exerciseName}
                    </span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {pr.weight} {pr.weightUnit} × {pr.reps}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
