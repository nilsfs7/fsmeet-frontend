import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { getUser, getUsers } from '@/infrastructure/clients/user.client';
import { routeAccount, routeHome, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { User } from '@/domain/types/user';
import Link from 'next/link';
import { ActionButtonCopyUrl } from './components/action-button-copy-url';
import { createTranslator } from 'next-intl';
import { supportedLanguages } from '@/domain/constants/supported-languages';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { MapOfFreestylers } from '@/components/MapOfFreestylers';
import { getMessagesByLocale } from '@/functions/get-messages-forced-locale';
import { UserType } from '@/domain/enums/user-type';

export default async function Map({ searchParams }: { searchParams: { iframe: string; locale: string; user: string; lat: string; lng: string; zoom: string; sv: string } }) {
  let t = await getTranslations(routeMap);
  const session = await auth();

  const streetViewEnabled = searchParams?.sv === '1';
  const iframeView = searchParams?.iframe === '1';

  const users = await getUsers();
  let actingUser: User | undefined;
  if (session?.user.username) {
    actingUser = await getUser(session?.user.username);
  }

  // overwrite translation
  const messages = await getMessagesByLocale(searchParams?.locale || 'gb');
  if (searchParams?.locale) {
    if (supportedLanguages.includes(searchParams?.locale.toUpperCase())) {
      t = createTranslator({ locale: searchParams?.locale, messages, namespace: '/map' });
    }
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      {!iframeView && (
        <>
          <Header />

          <PageTitle title={t('pageTitle')} />
        </>
      )}

      <MapOfFreestylers
        userList={users}
        selectedUsernames={[searchParams?.user || '']}
        region={actingUser?.country || searchParams?.locale || 'DE'}
        language={actingUser?.country || searchParams?.locale || 'EN'}
        lat={+searchParams?.lat || 54.5259614}
        lng={+searchParams?.lng || 15.2551187}
        zoom={+searchParams?.zoom || 4}
        streetViewEnabled={streetViewEnabled}
        isIframe={iframeView}
      />

      {iframeView && (
        <Navigation reverse>
          <div className="flex justify-end gap-1">
            <a href={routeMap} target="_blank" rel="noopener noreferrer">
              <TextButton text={t('btnViewOnFSMeet')} />
            </a>
          </div>
        </Navigation>
      )}
      {!iframeView && (
        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          <div className="flex justify-end gap-1">
            <ActionButtonCopyUrl />

            {(!actingUser || (actingUser && !actingUser.locLatitude)) && actingUser?.type !== UserType.FAN && (
              <Link href={`${routeAccount}?tab=map`}>
                <TextButton text={t('btnAddPin')} />
              </Link>
            )}
          </div>
        </Navigation>
      )}
    </div>
  );
}
