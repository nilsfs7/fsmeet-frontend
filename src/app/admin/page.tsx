import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminEvents, routeAdminLicenses, routeAdminUsers, routeHome, routeLogin } from '@/domain/constants/routes';
import { validateSession } from '@/functions/validate-session';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { RedirectType, redirect } from 'next/navigation';

export default async function AdminOverview() {
  const session = await auth();

  // TODO: remove because redirect is done by middleware anyway
  if (!validateSession(session)) {
    redirect(routeLogin, RedirectType.replace);
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Admin Overview" />

      <div className="mx-2 flex items-center flex-col gap-2">
        <Link href={routeAdminEvents}>
          <TextButton text={'Events'} />
        </Link>

        <Link href={routeAdminLicenses}>
          <TextButton text={'Licences'} />
        </Link>

        <Link href={routeAdminUsers}>
          <TextButton text={'Users'} />
        </Link>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
