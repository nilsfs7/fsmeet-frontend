import type { ReactNode } from 'react';

/** Viewport shell is `app/layout` (`AppShellColumn`); this segment adds no extra wrapper. */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
