import { cn } from '@/lib/utils';

const NOT_LISTED_CHIP = cn(
  'mr-1.5 inline-block align-middle rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5',
  'text-2xs font-medium text-muted-foreground sm:text-xs',
);

/**
 * Status chip shown when an event is not in a public / listed state.
 */
export function NotListedLabel({ className }: { className?: string }) {
  return <span className={cn(NOT_LISTED_CHIP, className)}>NOT LISTED</span>;
}
