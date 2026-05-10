import type { ReactNode } from 'react';

/** Viewport shell is `app/layout` (`AppShellColumn`); this segment adds no extra wrapper. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
