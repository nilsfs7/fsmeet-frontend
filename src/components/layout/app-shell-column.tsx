import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type AppShellColumnProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Default full-viewport column for major app areas (per-route `layout.tsx`).
 * - `relative` so `absolute inset-0` pages (e.g. feedback) layer correctly
 * - `min-h-0` so nested flex + overflow children can scroll
 */
export function AppShellColumn({ children, className }: AppShellColumnProps) {
  return <div className={cn('relative flex h-[calc(100dvh)] min-h-0 flex-col', className)}>{children}</div>;
}
