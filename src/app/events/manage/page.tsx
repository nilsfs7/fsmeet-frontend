import { Event } from '@/types/event';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { Header } from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import { getEvents } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { TabsMenu } from './components/tabs-menu';
import { TextButtonCreateEvent } from './components/text-button-create-event';

export default async function MyEventsOverview() {
  const session = await auth();

  let eventsOwning: Event[] = [];
  let eventsSubscribed: Event[] = [];

  if (session) {
    eventsOwning = await getEvents(session?.user.username, null, null, null, session);
    eventsSubscribed = await getEvents(null, session?.user.username, null, null);
  }

  return (
    <>
      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <PageTitle title="Manage Events" />

        <div className="mx-2 flex flex-col overflow-auto">
          <div className={'w-full overflow-auto'}>
            <TabsMenu eventsOwning={eventsOwning} eventsSubscribed={eventsSubscribed} />
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButtonCreateEvent />
        </Navigation>
      </div>
    </>
  );
}
