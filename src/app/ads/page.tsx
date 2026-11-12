import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeAds, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getAdvertisements } from '@/infrastructure/clients/advertisement.client';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { IconPlus, IconSpeakerphone } from '@tabler/icons-react';
import { auth } from '@/auth';
import AdsList from './components/ads-list';

export default async function Ads() {
  const t = await getTranslations('/ads');
  const session = await auth();

  const advertisements = await getAdvertisements(session?.user?.username ?? null);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title={t('pageTitle')} description={t('pageDescription')} />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {advertisements.length === 0 ? (
            <EmptyState
              icon={<IconSpeakerphone stroke={1.75} aria-hidden />}
              title={t('textNoAds')}
              action={
                <Button asChild variant="action" className={ctaActionButtonClassName}>
                  <Link href={`${routeAds}/create`}>
                    <IconPlus className="h-4 w-4" stroke={2} aria-hidden />
                    {t('btnCreate')}
                  </Link>
                </Button>
              }
            />
          ) : (
            <AdsList key={advertisements.map(ad => `${ad.id}:${ad.displayOrder}`).join(',')} advertisements={advertisements} />
          )}
        </div>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeAds}/create`}>
            <IconPlus className="h-4 w-4" stroke={2} aria-hidden />
            {t('btnCreate')}
          </Link>
        </Button>
      </Navigation>
    </div>
  );
}
