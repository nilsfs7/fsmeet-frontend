import { statusChipClassName } from '@/components/label';
import { cn } from '@/lib/utils';

/**
 * Status chip shown when an event is not in a public / listed state.
 */
export function NotListedLabel({ className }: { className?: string }) {
  return <span className={cn(statusChipClassName, className)}>NOT LISTED</span>;
}
