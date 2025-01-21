'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function switchTab(router: AppRouterInstance, newTab: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', newTab);
  router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
}
