import { EventCreationProcess } from './components/event-creation-process';
import { getLicense } from '../../../infrastructure/clients/license.client';
import { auth } from '../../../auth';
import LoadingSpinner from '../../../components/animation/loading-spinner';
import { getUser } from '../../../infrastructure/clients/user.client';

export default async function EventCreation() {
  const session = await auth();

  if (!session?.user.username) {
    return <LoadingSpinner />;
  }

  const eventAdmin = await getUser(session.user.username, session);
  const license = await getLicense(session, session.user.username);

  return <EventCreationProcess eventAdmin={eventAdmin} licenses={license.amountEventLicenses} />;
}
