import { routeHome, routeLogin } from '@/domain/constants/routes';
import { auth } from '@/auth';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { ProfilePicture } from './components/profile-picture';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { TabsMenu } from './components/tabs-menu';
import { SaveUserInfoButton } from './components/save-user-info-button';
import { RedirectType, redirect } from 'next/navigation';
import { getUser } from '@/infrastructure/clients/user.client';
import { getTranslations } from 'next-intl/server';

export default async function Account() {
  const t = await getTranslations('/account');
  const session = await auth();

  // TODO: remove because redirect is done by proxy anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  const user = await getUser(session.user.username, session);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} description={t('pageDescription')} />

      <div className="flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <ProfilePicture username={user.username} displayName={[user.firstName, user.lastName].filter(Boolean).join(' ')} imageUrl={user.imageUrl} />
        <TabsMenu user={user} />
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />

        <SaveUserInfoButton />
      </Navigation>
    </div>
  );
}
