import { cn } from '@/lib/utils';

/**
 * Table shell: matches event-creation `EDITOR_CARD_CLASS` and `CompetitionList` — max width, horizontal scroll, rounded border.
 * @see `app/events/create/components/event-creation-process.tsx`
 */
export const registrationListShellClass = cn(
  'w-full min-w-0 max-w-2xl overflow-hidden rounded-xl',
  'border border-border/60 bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/50 dark:supports-[backdrop-filter]:bg-background/50',
  'mx-auto',
);

export const registrationListScrollClass = 'w-full min-w-0 max-w-full overflow-x-auto scrollbar-none';
