import { getCompetition, getRounds } from '@/infrastructure/clients/competition.client';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { CompetitionDetailsView } from './components/competition-details-view';

export default async function CompetitionDetails(props: { params: Promise<{ eventId: string; compId: string }> }) {
  const params = await props.params;
  const session = await auth();

  const [event, comp, rounds] = await Promise.all([getEvent(params.eventId, session), getCompetition(params.compId), getRounds(params.compId)]);

  return <CompetitionDetailsView event={event} comp={comp} rounds={rounds} />;
}
