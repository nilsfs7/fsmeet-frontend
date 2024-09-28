'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextRouter } from 'next/router';

export function switchTab(router: AppRouterInstance, newTab: string): void {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', newTab);
  router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
}

// TODO: remove after migration to app router
export function switchTab_pages(router: NextRouter, newTab: string): void {
  if (router.asPath.includes('tab=')) {
    const { tab } = router.query;

    router.replace(`${router.asPath}`.replace(`tab=${tab}`, `tab=${newTab}`), undefined, { shallow: true });
  } else {
    if (router.asPath.includes('?')) {
      router.replace(`${router.asPath}&tab=${newTab}`, undefined, { shallow: true });
    } else {
      router.replace(`${router.asPath}?tab=${newTab}`, undefined, { shallow: true });
    }
  }
}
