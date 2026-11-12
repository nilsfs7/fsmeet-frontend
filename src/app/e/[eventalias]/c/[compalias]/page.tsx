import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import type { Competition } from '@/domain/types/competition';
import type { Event } from '@/domain/types/event';
import { getEventByAlias } from '@/infrastructure/clients/event.client';
import { getCompetitions, getRounds } from '@/infrastructure/clients/competition.client';
import { CompetitionDetailsView } from '@/app/events/[eventId]/comps/[compId]/components/competition-details-view';

/** Short competition URL: `/e/<event_alias>/c/<competition_alias>` renders the regular competition page (incl. `?tab=`). */
export default async function CompetitionAlias(props: { params: Promise<{ eventalias: string; compalias: string }> }) {
  const params = await props.params;
  const session = await auth();

  const eventAlias = decodeURIComponent(params.eventalias).toLowerCase();
  const compAlias = decodeURIComponent(params.compalias).toLowerCase();

  // resolve the event the same way /e/<alias> does
  let event: Event | undefined;
  try {
    event = await getEventByAlias(eventAlias, session);
  } catch {
    console.error('Error fetching event by alias.');
  }
  if (!event?.id) {
    notFound();
  }

  // no dedicated backend endpoint for a competition by alias: pick it from the event's competitions
  let comp: Competition | undefined;
  try {
    const comps = await getCompetitions(event.id, null);
    comp = comps.find(c => !!c.alias && c.alias.toLowerCase() === compAlias);
  } catch {
    console.error('Error fetching competitions.');
  }
  if (!comp?.id) {
    notFound();
  }

  const rounds = await getRounds(comp.id);

  return <CompetitionDetailsView event={event} comp={{ ...comp, eventId: comp.eventId ?? event.id }} rounds={rounds} />;
}
