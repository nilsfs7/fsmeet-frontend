import { Skeleton } from '@/components/ui/skeleton';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';
import { cn } from '@/lib/utils';

/** Route-level loading placeholder: page title + card list, matching the PageTitle / content container layout. */
export function PageLoading({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col overflow-hidden', className)}>
      <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-4 sm:pt-6">
        <Skeleton className="h-8 w-56 max-w-[70%] rounded-lg" />
        <Skeleton className="h-4 w-40 max-w-[50%]" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-4 sm:px-6 md:px-8">
        <AppDataStateListSkeleton rows={rows} className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
}
