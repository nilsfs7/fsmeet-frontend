import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminEvents, routeAdminLicenses, routeStatistics, routeAdminUserVerification, routeHome, routeRoadmap } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';

export default async function AdminOverview() {
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

        <Link href={routeAdminUserVerification}>
          <TextButton text={'User Verification'} />
        </Link>

        <Link href={routeStatistics}>
          <TextButton text={'App Statistics'} />
        </Link>

        <Link href={routeRoadmap}>
          <TextButton text={'Roadmap'} />
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
