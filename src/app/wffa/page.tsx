import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeWffaFreestylerIdManagement, routeHome, routeRoadmap, routeStatistics, routeVisaRequestManagement } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import PageTitle from '@/components/page-title';

export default async function AdminOverviewWFFA() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title="Admin Overview (WFFA)" />

      <div className="mx-2 flex items-center flex-col gap-2">
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeWffaFreestylerIdManagement}>Freestyler IDs</Link>
        </Button>

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeStatistics}>App Statistics</Link>
        </Button>

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeRoadmap}>Roadmap</Link>
        </Button>

        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeVisaRequestManagement}>Visa Requests</Link>
        </Button>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
