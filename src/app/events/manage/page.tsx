import { Event } from '@/domain/types/event';
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
    actingUser = await getUser(session?.user.username);
    eventsOwning = await getEvents(session?.user.username, null, null, null, null, session);
    eventsMaintaining = await getEvents(null, session?.user.username, null, null, null, session);
    eventsSubscribed = await getEvents(null, null, session?.user.username, null, null);
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

          {actingUser?.type !== UserType.FAN && <TextButtonCreateEvent />}
        </Navigation>
      </div>
    </>
  );
}
