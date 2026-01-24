import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { WorkoutSession, calculateSessionVolume } from '@/types/workout-tracker';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface ProgressChartsProps {
  sessions: WorkoutSession[];
}

const chartConfig = {
  volume: {
    label: 'Volume (kg)',
    color: 'hsl(var(--primary))',
  },
  duration: {
    label: 'Duration (min)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ProgressCharts({ sessions }: ProgressChartsProps) {
  const volumeData = useMemo(() => {
    return sessions
      .slice(0, 14) // Last 14 workouts
      .reverse()
      .map((session, index) => ({
        workout: `W${index + 1}`,
        date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.round(calculateSessionVolume(session) / 1000), // in thousands
        duration: session.duration || 0,
      }));
  }, [sessions]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weeks: { week: string; workouts: number; volume: number }[] = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      weeks.push({
        week: `Week ${4 - i}`,
        workouts: weekSessions.length,
        volume: Math.round(weekSessions.reduce((sum, s) => sum + calculateSessionVolume(s), 0) / 1000),
      });
    }
    
    return weeks;
  }, [sessions]);

  if (sessions.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Not Enough Data</h3>
          <p className="text-muted-foreground">
            Complete at least 2 workouts to see progress charts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Volume Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Volume Per Workout (kg in thousands)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="var(--color-volume)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-volume)', r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Weekly Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="workouts" 
                fill="var(--color-volume)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
