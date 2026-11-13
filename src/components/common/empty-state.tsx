import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IEmptyState {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Dashed placeholder card for lists without entries. */
export function EmptyState({ icon, title, description, action, className }: IEmptyState) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-background/60 px-6 py-10 text-center', className)}>
      {icon && <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground [&>svg]:h-6 [&>svg]:w-6">{icon}</span>}
      <div className="max-w-sm">
        <div className="font-semibold text-foreground">{title}</div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
