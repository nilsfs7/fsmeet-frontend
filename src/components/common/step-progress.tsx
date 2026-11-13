import { cn } from '@/lib/utils';

/** Compact multi-step progress indicator for wizard-like flows. `current` is 1-based. */
export function StepProgress({ current, total, className }: { current: number; total: number; className?: string }) {
  if (total < 2 || current < 1) return null;
  return (
    <div className={cn('flex w-full max-w-2xl items-center gap-3', className)} aria-label={`${current} / ${total}`} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', i < current ? 'bg-brand' : 'bg-neutral-200 dark:bg-neutral-700')} />
        ))}
      </div>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
        {current}/{total}
      </span>
    </div>
  );
}
