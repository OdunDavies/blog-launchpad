import Link from 'next/link';
import type { Metadata } from 'next';
import { exercises } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Exercise Library',
  description:
    'Browse 100+ exercises with video demonstrations, step-by-step instructions, and muscle group targeting. Filter by difficulty, equipment, and category.',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export default function ExerciseLibraryPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Exercise Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h2 className="font-medium text-sm mb-2">{exercise.name}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${difficultyColors[exercise.difficulty]}`}
                  >
                    {exercise.difficulty}
                  </Badge>
                  <span>{exercise.equipment}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
