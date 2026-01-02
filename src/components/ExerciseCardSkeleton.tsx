import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ExerciseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-1.5 mt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-20 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-12" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-16 mt-2" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
