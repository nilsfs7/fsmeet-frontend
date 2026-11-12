import { Action } from '@/domain/enums/action';
import {
  routeAdminEvents,
  routeStatistics,
  routeAdminUserVerification,
  routeAdminJobProfiles,
  routeHome,
  routeAdminBroadcast,
  routePushNotification,
  routeAdminScheduledMessaging,
} from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { HubLinks } from '@/components/common/hub-links';
import { PageInset } from '@/components/layout/page-inset';
import { IconBellRinging, IconBriefcase, IconCalendarEvent, IconChartBar, IconClockHour4, IconRosetteDiscountCheck, IconSpeakerphone } from '@tabler/icons-react';

const sky = 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300';
const amber = 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
const violet = 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300';

export default async function AdminOverview() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title="Admin Overview" description="Moderation, messaging and statistics." />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="flex max-w-3xl flex-col gap-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Moderation</h2>
            <HubLinks
              links={[
                { href: routeAdminEvents, title: 'Events', description: 'Approve, deny or archive events', Icon: IconCalendarEvent },
                { href: routeAdminUserVerification, title: 'User Verification', description: 'Review verification requests', Icon: IconRosetteDiscountCheck },
                { href: routeAdminJobProfiles, title: 'Job Profiles', description: 'Approve freestyler job listings', Icon: IconBriefcase },
              ]}
            />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Messaging</h2>
            <HubLinks
              links={[
                { href: routePushNotification, title: 'Push Notification', description: 'Send a push to one user', Icon: IconBellRinging, tone: sky },
                { href: routeAdminBroadcast, title: 'Broadcast', description: 'Message many users at once', Icon: IconSpeakerphone, tone: sky },
                { href: routeAdminScheduledMessaging, title: 'Scheduled Messaging', description: 'Plan messages ahead', Icon: IconClockHour4, tone: amber },
              ]}
            />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Insights</h2>
            <HubLinks links={[{ href: routeStatistics, title: 'App Statistics', description: 'Users, events and activity', Icon: IconChartBar, tone: violet }]} />
          </section>
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
