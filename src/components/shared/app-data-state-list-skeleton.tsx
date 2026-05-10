import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type AppDataStateListSkeletonProps = {
  /** Number of card-shaped rows (default tuned for event list) */
  rows?: number;
  className?: string;
};

/** Loading placeholder for vertical card lists (P1: replace ad-hoc spinners). */
export function AppDataStateListSkeleton({ rows = 4, className }: AppDataStateListSkeletonProps) {
  return (
    <div className={cn('grid w-full max-w-lg gap-3', className)} role="status" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-3 rounded-lg border border-border bg-background p-3">
          <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="h-3 w-1/2 max-w-[10rem]" />
            <Skeleton className="h-3 w-2/3 max-w-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
