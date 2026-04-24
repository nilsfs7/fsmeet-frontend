import { AppShellColumn } from '@/components/layout/app-shell-column';
import type { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AppShellColumn>{children}</AppShellColumn>;
}
