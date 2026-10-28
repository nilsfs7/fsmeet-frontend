import { PageInset } from '@/components/layout/page-inset';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';

export default function Loading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-20">
      <PageInset>
        <AppDataStateListSkeleton rows={6} className="mx-auto max-w-none" />
      </PageInset>
    </div>
  );
}
