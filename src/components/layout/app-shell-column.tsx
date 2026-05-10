import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type AppShellColumnProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Default full-viewport column for major app areas (per-route `layout.tsx`).
 * - `relative` so `absolute inset-0` pages (e.g. feedback) layer correctly
 * - `h-full` fills `html` / `body` (see root layout) so the document does not grow past the viewport
 * - `min-h-0` so nested flex + overflow children can scroll
 * - `overflow-hidden` keeps scroll inside route content, not on `body`
 */
export function AppShellColumn({ children, className }: AppShellColumnProps) {
  return <div className={cn('relative flex h-full min-h-0 flex-col overflow-hidden', className)}>{children}</div>;
}
