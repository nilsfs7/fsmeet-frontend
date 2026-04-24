import { Event } from '@/domain/types/event';
import Link from 'next/link';
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
    <>
      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <PageTitle title={t('pageTitle')} />

        <div className="mx-2 flex flex-col overflow-auto">
          <div className={'w-full overflow-auto'}>
            <TabsMenu actingUser={actingUser} eventsOwning={eventsOwning} eventsMaintaining={eventsMaintaining} eventsSubscribed={eventsSubscribed} />
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          {actingUser?.type !== UserType.FAN && <EventManageCreateEventButton />}
        </Navigation>
      </div>
    </>
  );
}
