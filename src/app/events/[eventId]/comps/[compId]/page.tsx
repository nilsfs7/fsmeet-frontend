import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { getCompetition, getRounds } from '@/infrastructure/clients/competition.client';
import { TabsMenu } from './components/tabs-menu';
import Link from 'next/link';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { routeEvents } from '@/domain/constants/routes';
import { ActionButtonDownloadResults } from './components/action-button-download-results';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { Round } from '@/domain/types/round';
import { auth } from '@/auth';

export default async function CompetitionDetails({ params }: { params: { eventId: string; compId: string } }) {
  const session = await auth();

  const event: Event = await getEvent(params.eventId, session);
  const comp = await getCompetition(params.compId);
  const rounds: Round[] = JSON.parse(JSON.stringify(await getRounds(params.compId)));

  return (
    <>
      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={comp.name} />

        <TabsMenu comp={comp} event={event} />

        <Navigation>
          <Link href={`${routeEvents}/${comp.eventId}?tab=competitions`}>
            <ActionButton action={Action.BACK} />
          </Link>

          <ActionButtonDownloadResults event={event} comp={comp} rounds_plain={rounds} />
        </Navigation>
      </div>
    </>
  );
}
