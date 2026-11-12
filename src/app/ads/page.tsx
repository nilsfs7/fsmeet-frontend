import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeAds, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getAdvertisements } from '@/infrastructure/clients/advertisement.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { IconPlus, IconSpeakerphone } from '@tabler/icons-react';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { auth } from '@/auth';

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

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
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {advertisements.map((advertisement, index) => (
                <li key={advertisement.id ?? index} className="flex min-w-0 gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs">
                  <img
                    src={advertisement.imageUrl || imgImagePlaceholder}
                    alt=""
                    className={cn('h-20 w-20 shrink-0 rounded-xl bg-muted', advertisement.imageUrl ? 'object-cover' : 'object-contain p-5 opacity-40 dark:invert')}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate font-semibold text-foreground">{advertisement.title}</p>
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold', advertisement.enabled ? 'bg-brand-soft text-brand-strong' : 'bg-muted text-muted-foreground')}>
                        {advertisement.enabled ? t('chipActive') : t('chipInactive')}
                      </span>
                    </div>
                    {advertisement.description && <p className="line-clamp-2 text-sm text-muted-foreground">{advertisement.description}</p>}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                      <span className="min-w-0 truncate text-xs text-muted-foreground">
                        {hostOf(advertisement.targetUrl)} · {t('lblOrder', { order: advertisement.displayOrder })}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        <ActionButton href={`${routeAds}/${advertisement.id}/stats`} action={Action.STATISTICS} tooltip={t('tooltipViewStats')} />
                        <ActionButton href={`${routeAds}/${advertisement.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditAd')} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
