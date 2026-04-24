import type { ReactNode } from 'react';

/** Event detail routes are wrapped by `app/events/layout` (`AppShellColumn`); do not nest another shell here. */
export default function EventIdLayout({ children }: { children: ReactNode }) {
  return children;
}
