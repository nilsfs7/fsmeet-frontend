import Link from 'next/link';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { routeAccount, routeLogin } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { auth } from '@/auth';
import PageTitle from '@/components/page-title';
import { RedirectType, redirect } from 'next/navigation';
import { ProfilePictureUpload } from './components/profile-picture-upload';
import { getTranslations } from 'next-intl/server';

export default async function AccountImage() {
  const t = await getTranslations('/account/image');
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <ProfilePictureUpload />

      <Navigation>
        <Link href={routeAccount}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
