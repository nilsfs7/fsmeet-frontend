import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeWffaFreestylerIdMangement, routeHome, routeRoadmap, routeStatistics, routeVisaRequestManagement } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';

export default async function AdminOverviewWFFA() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Admin Overview (WFFA)" />

      <div className="mx-2 flex items-center flex-col gap-2">
        <Link href={routeWffaFreestylerIdMangement}>
          <TextButton text={'Freestyler IDs'} />
        </Link>

        <Link href={routeStatistics}>
          <TextButton text={'App Statistics'} />
        </Link>

        <Link href={routeRoadmap}>
          <TextButton text={'Roadmap'} />
        </Link>

        <Link href={routeVisaRequestManagement}>
          <TextButton text={'Visa Requests'} />
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
