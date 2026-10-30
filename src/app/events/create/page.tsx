import { EventCreationProcess } from './components/event-creation-process';
import { auth } from '../../../auth';
import LoadingSpinner from '../../../components/animation/loading-spinner';
import { getUser } from '../../../infrastructure/clients/user.client';

export default async function EventCreation() {
  const session = await auth();

  if (!session?.user.username) {
    return <LoadingSpinner />;
  }

  const eventAdmin = await getUser(session.user.username, session);

  return <EventCreationProcess eventAdmin={eventAdmin} />;
}
