import { auth } from '@/auth';
import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import TextButton from '@/components/common/TextButton';
import { getUser, getUsers } from '@/infrastructure/clients/user.client';
import { routeAccount, routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { User } from '@/types/user';
import Link from 'next/link';
import { MapContainer } from './components/map-container';
import { ActionButtonCopyUrl } from './components/action-button-copy-url';
import { getTranslations } from 'next-intl/server';

export default async function Map() {
  const t = await getTranslations('/map');
  const session = await auth();

  let actingUser: User | null = null;
  if (session?.user?.username) {
    actingUser = await getUser(session.user.username);
  }

  const users: User[] = await getUsers();

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <MapContainer users={users} />

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <div className="flex justify-end gap-1">
          <ActionButtonCopyUrl />

          {(!actingUser || (actingUser && !actingUser.locLatitude)) && (
            <Link href={`${routeAccount}?tab=map`}>
              <TextButton text={t('btnAddPin')} />
            </Link>
          )}
        </div>
      </Navigation>
    </div>
  );
}
