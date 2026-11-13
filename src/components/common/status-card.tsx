import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IStatusCard {
  title: string;
  description?: ReactNode;
  /** Optional icon shown in a tinted tile above the title. */
  icon?: ReactNode;
  tone?: 'brand' | 'danger';
  children?: ReactNode;
  footer?: ReactNode;
}

/** Centered result card (success, thank-you, pending, error) shared by the auth flows and confirmation pages; matches the login card. */
export function StatusCard({ title, description, icon, tone = 'brand', children, footer }: IStatusCard) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-lg">
        <div className="h-1.5 w-full bg-linear-to-r from-brand via-emerald-400 to-sky-400" aria-hidden />
        <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="mb-6 flex flex-col items-center text-center">
            {icon && (
              <div
                className={cn(
                  'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl [&>svg]:h-7 [&>svg]:w-7',
                  tone === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-brand-soft text-brand-strong',
                )}
              >
                {icon}
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            {description && <div className="mt-2 text-balance text-sm text-muted-foreground sm:text-base">{description}</div>}
          </div>
          {children && <div className="flex flex-col gap-4">{children}</div>}
        </div>
      </div>
      {footer && <div className="mt-5 w-full max-w-md px-1 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
