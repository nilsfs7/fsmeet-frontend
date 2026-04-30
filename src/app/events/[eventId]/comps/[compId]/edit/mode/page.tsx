import PageTitle from '@/components/page-title';
import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { getCompetitionParticipants, getRounds } from '@/infrastructure/clients/competition.client';
import { getTranslations } from 'next-intl/server';
import { GameModeEditor } from './components/game-mode-editor';

export default async function ModeEditing(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([
    getTranslations('/events/eventid/comps/compid/edit/mode'),
    auth(),
  ]);

  const [event, rounds, participants] = await Promise.all([
    getEvent(params.eventId, session),
    getRounds(params.compId),
    getCompetitionParticipants(params.compId),
  ]);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <GameModeEditor event={event} compId={params.compId} roundsInit={rounds} participants={participants} />
    </div>
  );
}
