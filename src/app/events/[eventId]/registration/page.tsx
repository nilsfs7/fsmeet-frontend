import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { EventRegistrationProcess } from './components/event-registration-process';
import { getUser } from '@/infrastructure/clients/user.client';
import { redirect } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { validateSession } from '@/functions/validate-session';
import { getCompetitions } from '@/infrastructure/clients/competition.client';

export default async function EventRegistration({ params }: { params: { eventId: string } }) {
  const session = await auth();

  const loginRouteWithCallbackUrl = `${routeLogin}?callbackUrl=${routeEvents}%2F${params.eventId}%2Fregistration`;

  if (!validateSession(session)) {
    redirect(loginRouteWithCallbackUrl);
  }

  const [event, competitions, user] = await Promise.all([getEvent(params.eventId, session), getCompetitions(params.eventId), getUser(session?.user.username ? session.user.username : '', session)]);

  return <EventRegistrationProcess event={event} competitions={competitions} attendee={user} />;
}
