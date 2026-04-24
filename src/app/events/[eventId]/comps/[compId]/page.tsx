import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getCompetition, getRounds } from '@/infrastructure/clients/competition.client';
import { TabsMenu } from './components/tabs-menu';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { routeEvents } from '@/domain/constants/routes';
import { ActionButtonDownloadResults } from './components/action-button-download-results';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { Round } from '@/domain/types/round';
import { auth } from '@/auth';

export default async function CompetitionDetails(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const session = await auth();

  const event: Event = await getEvent(params.eventId, session);
  const comp = await getCompetition(params.compId);
  const rounds: Round[] = await getRounds(params.compId);

  return (
    <>
      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={comp.name} />

        <TabsMenu comp={comp} event={event} />

        <Navigation>
          <ActionButton
            href={`${routeEvents}/${comp.eventId}?tab=competitions`}
            action={Action.BACK}
          />

          <ActionButtonDownloadResults event={event} comp={comp} rounds={rounds} />
        </Navigation>
      </div>
    </>
  );
}
