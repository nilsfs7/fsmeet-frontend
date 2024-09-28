import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { routeAccount, routeLogin } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { auth } from '@/auth';
import PageTitle from '@/components/PageTitle';
import { RedirectType, redirect } from 'next/navigation';
import { ProfilePictureUpload } from './components/profile-picture-upload';

export default async function AccountImage() {
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!session?.user?.username) {
    redirect(routeLogin, RedirectType.replace);
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Account Settings" />

      <ProfilePictureUpload />

      <Navigation>
        <Link href={routeAccount}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
