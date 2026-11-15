'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/header';
import { routeMap } from '@/domain/constants/routes';

/**
 * Embeddable views (e.g. `/map?iframe=1`, embedded on dffb.org) must render without any app chrome.
 * The root layout cannot read search params, so this small client gate decides; it is rendered inside a
 * Suspense boundary (useSearchParams) whose fallback is the regular header.
 */
export const isEmbedView = (pathname: string | null, iframeParam: string | null) => pathname === routeMap && iframeParam === '1';

export function AppHeaderGate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (isEmbedView(pathname, searchParams?.get('iframe') ?? null)) return null;
  return <AppHeader />;
}
