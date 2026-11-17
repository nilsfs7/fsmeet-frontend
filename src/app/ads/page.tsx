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
import { AdsAdminList, type AdOwner } from './components/ads-admin-list';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import { getUser } from '@/infrastructure/clients/user.client';
import { withImageVersion } from '@/functions/image-cache';
import type { ReadAdvertisementResponseDto } from '@/infrastructure/clients/dtos/advertisement/read-advertisement-response-dto';

/** Replaced images keep their URL: version them per request so the list never shows a stale cached file. */
function withFreshImageUrls(advertisements: ReadAdvertisementResponseDto[]): ReadAdvertisementResponseDto[] {
  const version = Date.now();
  return advertisements.map(ad => ({ ...ad, imageUrl: withImageVersion(ad.imageUrl, version) ?? '' }));
}

/** Owner name + avatar for the admin overview (one lookup per distinct owner; failures fall back to the username). */
async function getAdOwners(advertisements: ReadAdvertisementResponseDto[]): Promise<AdOwner[]> {
  const usernames = [...new Set(advertisements.map(ad => ad.username).filter(Boolean))];
  return Promise.all(
    usernames.map(async name => {
      try {
        const user = await getUser(name);
        const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || name;
        return { username: name, displayName, imageUrl: user.imageUrl };
      } catch {
        return { username: name, displayName: name };
      }
    }),
  );
}

export default async function Ads() {
  const t = await getTranslations('/ads');
  const session = await auth();

  const username = session?.user?.username ?? null;
  // same app-admin check as the event admin panel
  const isAdmin = username === AdministrativeUser.ADMIN;

  // GET /v1/advertisements without `username` returns every ad: only the app admin gets that overview.
  // Everyone else sees their own ads; logged-out visitors none (previously they got the full list).
  const advertisements = isAdmin ? await getAdvertisements(null) : username ? await getAdvertisements(username) : [];
  const owners = isAdmin ? await getAdOwners(advertisements) : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title={isAdmin ? t('adminPageTitle') : t('pageTitle')} description={isAdmin ? t('adminPageDescription') : t('pageDescription')} />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {isAdmin && advertisements.length > 0 ? (
            <AdsAdminList advertisements={withFreshImageUrls(advertisements)} owners={owners} currentUsername={username ?? ''} />
          ) : advertisements.length === 0 ? (
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
            <AdsList key={advertisements.map(ad => `${ad.id}:${ad.displayOrder}`).join(',')} advertisements={withFreshImageUrls(advertisements)} />
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
