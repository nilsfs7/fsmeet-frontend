import { NextRouter } from 'next/router';

export function switchTab(router: NextRouter, newTab: string): void {
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
