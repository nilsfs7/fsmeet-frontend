import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { getUser, getUsers } from '@/infrastructure/clients/user.client';
import { routeHome, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { ActionButtonCopyUrl } from './components/action-button-copy-url';
import { createTranslator } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { getMessagesByLocale } from '@/functions/get-messages-forced-locale';
import { UserType } from '@/domain/enums/user-type';
import { FreestylerMap } from '@/components/freestyler-map';
import { AddMapPinButton } from './components/add-map-pin-button';
import { getSupportedlanguages } from '../../functions/get-supported-languages';
import { cn } from '@/lib/utils';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function Map(props: { searchParams: Promise<{ iframe: string; locale: string; user: string; lat: string; lng: string; zoom: string; sv: string }> }) {
  const searchParams = await props.searchParams;
  let t = await getTranslations('/map');
  const session = await auth();

  const supportedLanguages = getSupportedlanguages();

  const streetViewEnabled = searchParams?.sv === '1';
  const iframeView = searchParams?.iframe === '1';

  const [users, actingUser] = await Promise.all([
    getUsers(undefined, undefined, undefined, undefined, undefined, true),
    session?.user.username ? getUser(session.user.username) : Promise.resolve(undefined),
  ]);

  // overwrite translation
  const messages = await getMessagesByLocale(searchParams?.locale || 'gb');
  if (searchParams?.locale) {
    if (supportedLanguages.includes(searchParams?.locale.toUpperCase())) {
      t = createTranslator({ locale: searchParams?.locale, messages, namespace: '/map' });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!iframeView && (
        <>
          <Header />

          <div className={cn('mt-2', constrainedContentClass)}>
            <PageTitle title={t('pageTitle')} />
          </div>
        </>
      )}

      <div className={cn('min-h-0 flex flex-1 flex-col', !iframeView && 'mt-2')}>
        <FreestylerMap
          userList={users.filter(u => u.type !== UserType.ADMINISTRATIVE)}
          selectedUsernames={[searchParams?.user || '']}
          region={actingUser?.countryCode || searchParams?.locale || 'DE'} // todo: causes second map render
          language={actingUser?.countryCode || searchParams?.locale || 'EN'} // todo: causes second map render
          lat={+searchParams?.lat || 54.5259614}
          lng={+searchParams?.lng || 15.2551187}
          zoom={+searchParams?.zoom || 4}
          streetViewEnabled={streetViewEnabled}
          isIframe={iframeView}
        />
      </div>

      {iframeView && (
        <Navigation reverse>
          <div className="flex justify-end gap-1">
            <Button asChild variant="action" className={ctaActionButtonClassName}>
              <a href={routeMap} target="_blank" rel="noopener noreferrer">
                {t('btnViewOnFSMeet')}
              </a>
            </Button>
          </div>
        </Navigation>
      )}
      {!iframeView && (
        <Navigation>
          <ActionButton href={routeHome} action={Action.BACK} />

          <div className="flex justify-end gap-1">
            <ActionButtonCopyUrl />

            {(!actingUser || (actingUser && !actingUser.locLatitude)) && actingUser?.type !== UserType.FAN && <AddMapPinButton />}
          </div>
        </Navigation>
      )}
    </div>
  );
}
