import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { EventRegistrationProcess } from './components/event-registration-process';
import { getUser } from '@/infrastructure/clients/user.client';

export default async function EventRegistration({ params }: { params: { eventId: string } }) {
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const user = await getUser(session?.user.username ? session.user.username : '', session);

  return <EventRegistrationProcess event={event} user={user} />;
}
