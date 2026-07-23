import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { exercises } from '@/data/exercises';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return exercises.map((exercise) => ({ id: exercise.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const exercise = exercises.find((ex) => ex.id === params.id);
  if (!exercise) return {};
  const primaryMuscle = exercise.primaryMuscles[0];
  const title = `How to Do ${exercise.name}: Proper Form & Technique`;
  const description = exercise.instructions[0] ?? '';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: exercise.imageUrl ? [{ url: exercise.imageUrl }] : [],
      type: 'article',
    },
  };
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-600 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/30',
};

export default function ExerciseDetailPage({ params }: Props) {
  const exercise = exercises.find((ex) => ex.id === params.id);
  if (!exercise) notFound();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/exercises" className="hover:text-foreground transition-colors">
          Exercises
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-medium">{exercise.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
            {exercise.difficulty}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {exercise.category}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            {exercise.equipment}
          </Badge>
        </div>
      </header>

      {/* Video */}
      <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-10">
        <iframe
          src={exercise.videoUrl}
          title={`${exercise.name} instructional video`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Muscles */}
      <section className="mb-10">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-1">Primary Muscles</h2>
              <div className="flex flex-wrap gap-1">
                {exercise.primaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
            {exercise.secondaryMuscles.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-1">Secondary Muscles</h2>
                <div className="flex flex-wrap gap-1">
                  {exercise.secondaryMuscles.map((muscle) => (
                    <Badge key={muscle} variant="outline" className="capitalize">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Instructions */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>
        <Card>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground pt-1.5">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/exercises"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to exercises
        </Link>
      </div>
    </div>
  );
}
