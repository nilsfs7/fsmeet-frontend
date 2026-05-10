import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type AppDataStateEmptyProps = {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

/** Centered empty list / detail placeholder (P1: consistent empty state). */
export function AppDataStateEmpty({ title, description, className, children }: AppDataStateEmptyProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-lg border border-border bg-secondary-light/60 px-6 py-10 text-center',
        className,
      )}
    >
      {title ? <p className="text-heading-4 text-foreground">{title}</p> : null}
      {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
      {children}
    </div>
  );
}
