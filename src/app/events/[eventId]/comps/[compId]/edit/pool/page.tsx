import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { Participants } from './components/participants';
import { getCompetition, getCompetitionParticipants } from '@/infrastructure/clients/competition.client';
import { getTranslations } from 'next-intl/server';
import { getEvent, getEventRegistrations } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { PageInset } from '@/components/layout/page-inset';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { EventRegistrationType } from '@/domain/types/event-registration-type';

export default async function CompetitionPool(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/comps/compid/edit/pool'), auth()]);

  const [eventResult, competitionResult, registrationsResult, poolResult] = await Promise.allSettled([
    getEvent(params.eventId, session),
    getCompetition(params.compId),
    getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session),
    getCompetitionParticipants(params.compId),
  ]);

  const loaded = eventResult.status === 'fulfilled' && competitionResult.status === 'fulfilled' && registrationsResult.status === 'fulfilled' && poolResult.status === 'fulfilled';

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title={t('pageTitle')} className="mb-1 sm:mb-2" />
      {competitionResult.status === 'fulfilled' && <p className="px-4 text-center text-sm font-medium text-muted-foreground sm:px-6 md:px-8">{competitionResult.value.name}</p>}

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        <PageInset>
          {loaded ? (
            <Participants event={eventResult.value} competition={competitionResult.value} registrations={registrationsResult.value} initialPool={poolResult.value} />
          ) : (
            <AppDataStateError title={t('errorLoadTitle')} message={t('errorLoadText')} className="mx-auto" />
          )}
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}/comps`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
