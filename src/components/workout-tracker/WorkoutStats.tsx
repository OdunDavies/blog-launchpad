import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Clock, 
  Trophy, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { WorkoutStats as StatsType } from '@/types/workout-tracker';

interface WorkoutStatsProps {
  stats: StatsType;
}

export function WorkoutStats({ stats }: WorkoutStatsProps) {
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
    return `${kg} kg`;
  };

  const statCards = [
    {
      label: 'Total Workouts',
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
      label: 'Time Training',
      value: formatDuration(stats.totalDuration),
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Personal Records',
      value: stats.prCount,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Exercises Done',
      value: stats.exerciseCount,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
