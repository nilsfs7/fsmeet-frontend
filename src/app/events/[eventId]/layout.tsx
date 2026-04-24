import type { ReactNode } from 'react';

/** Event detail routes use the single viewport shell from `app/layout` (`AppShellColumn`); do not add another shell here. */
export default function EventIdLayout({ children }: { children: ReactNode }) {
  return children;
}
