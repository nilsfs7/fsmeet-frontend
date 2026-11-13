import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

/** Labeled step indicator; collapses to a bar + current label on small screens. */
export function LabeledStepper({ steps, currentIndex, counterLabel, className }: { steps: string[]; currentIndex: number; counterLabel: string; className?: string }) {
  if (steps.length < 2 || currentIndex < 0) return null;

  return (
    <nav aria-label={counterLabel} className={className}>
      {/* mobile */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold text-foreground">{steps[currentIndex]}</span>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">{counterLabel}</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={cn('h-1.5 flex-1 rounded-full', i <= currentIndex ? 'bg-brand' : 'bg-muted')} />
          ))}
        </div>
      </div>

      {/* desktop */}
      <ol className="hidden items-center gap-2 sm:flex">
        {steps.map((label, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo';
          return (
            <li key={label + i} className="flex min-w-0 flex-1 items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                  state === 'done' && 'bg-brand text-brand-foreground',
                  state === 'current' && 'bg-brand-soft text-brand-strong ring-2 ring-brand',
                  state === 'todo' && 'bg-muted text-muted-foreground',
                )}
              >
                {state === 'done' ? <IconCheck className="h-4 w-4" stroke={2.5} aria-hidden /> : i + 1}
              </span>
              <span className={cn('truncate text-sm', state === 'current' ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{label}</span>
              {i < steps.length - 1 && <span className="h-px min-w-4 flex-1 bg-border" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
