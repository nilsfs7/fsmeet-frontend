import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { Competition } from '@/domain/types/competition';
import { Participants } from './components/participants';
import { getCompetition } from '@/infrastructure/clients/competition.client';
import { getTranslations } from 'next-intl/server';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';

const eventDetailsContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function CompetitionPool(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/comps/compid/edit/pool');
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const competition: Competition = await getCompetition(params.compId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={cn('mt-2', eventDetailsContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', eventDetailsContentClass)}>
        <Participants event={event} competition={competition} />
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}/comps`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
