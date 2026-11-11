import type { ReactNode } from 'react';
import type { Icon } from '@tabler/icons-react';
import { IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface IChoiceCard {
  title: string;
  description?: string;
  Icon: Icon;
  tone?: string;
  onClick?: () => void;
  /** Render as a non-button (e.g. when wrapped in a `Link`). */
  asDiv?: boolean;
  children?: ReactNode;
}

/** Large tappable option used for "pick a type" steps (event creation, feedback). */
export function ChoiceCard({ title, description, Icon, tone = 'bg-brand-soft text-brand-strong', onClick, asDiv = false }: IChoiceCard) {
  const className = cn(
    'group flex w-full min-w-0 items-center gap-4 rounded-2xl border border-border bg-background p-4 text-left shadow-xs transition-all duration-150 sm:p-5',
    'hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  );
  const content = (
    <>
      <span className={cn('inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', tone)}>
        <Icon className="h-6 w-6" stroke={1.75} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-base font-semibold text-foreground">{title}</span>
        {description && <span className="mt-0.5 text-sm text-muted-foreground">{description}</span>}
      </span>
      <IconChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" stroke={1.75} aria-hidden />
    </>
  );
  if (asDiv) return <div className={className}>{content}</div>;
  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
