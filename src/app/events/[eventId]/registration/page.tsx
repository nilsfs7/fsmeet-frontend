import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { EventRegistrationProcess } from './components/event-registration-process';
import { getUser } from '@/infrastructure/clients/user.client';
import { redirect } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { validateSession } from '@/functions/validate-session';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { compareByIndex } from '@/functions/compare-by-index';

export default async function EventRegistration(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const session = await auth();

  const loginRouteWithCallbackUrl = `${routeLogin}?callbackUrl=${routeEvents}%2F${params.eventId}%2Fregistration`;

  if (!validateSession(session)) {
    redirect(loginRouteWithCallbackUrl);
  }

  const [event, fetchedCompetitions, user] = await Promise.all([getEvent(params.eventId, session), getCompetitions(params.eventId, null), getUser(session?.user.username ? session.user.username : '', session)]);
  const competitions = [...fetchedCompetitions].sort(compareByIndex);

  return <EventRegistrationProcess event={event} competitions={competitions} attendee={user} />;
}
