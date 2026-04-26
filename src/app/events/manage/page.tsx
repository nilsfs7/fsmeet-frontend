import { Event } from '@/domain/types/event';
import Navigation from '@/components/navigation';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { Header } from '@/components/header';
import PageTitle from '@/components/page-title';
import { getEvents } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { TabsMenu } from './components/tabs-menu';
import { EventManageCreateEventButton } from './components/create-event-button';
import { getTranslations } from 'next-intl/server';
import { User } from '@/domain/types/user';
import { getUser } from '@/infrastructure/clients/user.client';
import { UserType } from '@/domain/enums/user-type';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { appShellContentClass } from '@/components/layout/app-shell-content';
import { cn } from '@/lib/utils';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

export default async function MyEventsOverview() {
  const t = await getTranslations('/events/manage');

  const session = await auth();

  let eventsOwning: Event[] = [];
  let eventsMaintaining: Event[] = [];
  let eventsSubscribed: Event[] = [];
  let actingUser: User | undefined;

  if (session) {
    const u = await getUser(session.user.username, session);
    actingUser = u;
    if (u) {
      const [a, b, c] = await Promise.allSettled([
        getEvents(session.user.username, null, null, null, null, session),
        getEvents(null, session.user.username, null, null, null, session),
        getEvents(null, null, session.user.username, null, null, session),
      ]);
      if (a.status === 'fulfilled' && Array.isArray(a.value)) {
        eventsOwning = a.value;
      }
      if (b.status === 'fulfilled' && Array.isArray(b.value)) {
        eventsMaintaining = b.value;
      }
      if (c.status === 'fulfilled' && Array.isArray(c.value)) {
        eventsSubscribed = c.value;
      }
    }
  }

  if (!actingUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
      <Header showMenu />

      <div className={cn('mt-2', constrainedContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden', constrainedContentClass)}>
        <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto scrollbar-none">
          <TabsMenu actingUser={actingUser} eventsOwning={eventsOwning} eventsMaintaining={eventsMaintaining} eventsSubscribed={eventsSubscribed} />
        </div>
      </div>

      <Navigation noTopGap>
        <div className="flex min-w-0 flex-wrap justify-start gap-1">
          <ActionButton href={routeHome} action={Action.BACK} />
        </div>

        <div className="flex min-w-0 flex-wrap justify-end gap-1">
          {actingUser?.type !== UserType.FAN && <EventManageCreateEventButton />}
        </div>
      </Navigation>
    </div>
  );
}
