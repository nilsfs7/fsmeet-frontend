import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { Competition } from '@/domain/types/competition';
import { Participants } from './components/participants';
import { getCompetition } from '@/infrastructure/clients/competition.client';
import { getTranslations } from 'next-intl/server';
import { getEvent } from '@/infrastructure/clients/event.client';

export default async function CompetitionPool({ params }: { params: { eventId: string; compId: string } }) {
  const t = await getTranslations('/events/eventid/comps/compid/edit/pool');

  const event = JSON.parse(JSON.stringify(await getEvent(params.eventId)));
  const competition: Competition = JSON.parse(JSON.stringify(await getCompetition(params.compId)));

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <Participants event={event} competition={competition} />

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}/comps`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
