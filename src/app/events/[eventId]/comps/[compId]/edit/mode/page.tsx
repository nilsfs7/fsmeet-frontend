import PageTitle from '@/components/page-title';
import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { getCompetitionParticipants, getRounds } from '@/infrastructure/clients/competition.client';
import { getTranslations } from 'next-intl/server';
import { GameModeEditor } from './components/game-mode-editor';

export default async function ModeEditing(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/comps/compid/edit/mode');
  const session = await auth();

  const event = JSON.parse(JSON.stringify(await getEvent(params.eventId, session)));
  const rounds = JSON.parse(JSON.stringify(await getRounds(params.compId)));
  const participants = await getCompetitionParticipants(params.compId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <GameModeEditor event={event} compId={params.compId} roundsInit={rounds} participants={participants} />
    </div>
  );
}
