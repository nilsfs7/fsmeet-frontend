import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminEvents, routeAdminLicenses, routeStatistics, routeAdminUserVerification, routeHome, routeRoadmap, routeAdminBroadcast, routePushNotification } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import PageTitle from '@/components/page-title';

export default async function AdminOverview() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title="Admin Overview" />

      <div className="mx-2 flex items-center flex-col gap-2">
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeAdminEvents}>Events</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeAdminLicenses}>Licenses</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeAdminUserVerification}>User Verification</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routePushNotification}>Push Notification</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeAdminBroadcast}>Broadcast</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeStatistics}>App Statistics</Link>
        </Button>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeRoadmap}>Roadmap</Link>
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
