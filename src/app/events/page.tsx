import { getTranslations } from 'next-intl/server';
import { CreateEventButton } from '@/components/events/create-event-button';
import { routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Header } from '@/components/header';
import { EventsList } from './components/events-list';

export default async function EventsOverview() {
  const t = await getTranslations('/events');

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Header showMenu={true} />

      <EventsList />

      <Navigation>
        <div className="flex min-w-0 flex-wrap justify-start gap-1">
          <ActionButton href={routeHome} action={Action.BACK} />
        </div>

        <div className="flex min-w-0 flex-wrap justify-end gap-1">
          <CreateEventButton label={t('btnCreateEvent')} />
        </div>
      </Navigation>
    </div>
  );
}
