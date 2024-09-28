import { routeHome, routeLogin } from '@/domain/constants/routes';
import { auth } from '@/auth';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { ProfilePicture } from './components/profile-picture';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { TabsMenu } from './components/tabs-menu';
import { ButtonSaveUserInfo } from './components/text-button-save-user-info';
import { RedirectType, redirect } from 'next/navigation';
import { getUser } from '@/infrastructure/clients/user.client';

export default async function Account() {
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  const user = await getUser(session?.user?.username, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Account Settings" />

      <div className="mx-2 flex flex-col overflow-auto">
        <ProfilePicture />

        <div className="flex flex-col overflow-hidden">
          <div className={'flex flex-col items-center overflow-auto'}>
            <TabsMenu user={user} />
          </div>
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>

        <ButtonSaveUserInfo />
      </Navigation>
    </div>
  );
}
