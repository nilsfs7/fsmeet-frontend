import { routeEventNotFound, routeEvents } from '@/domain/constants/routes';
import { auth } from '@/auth';
import { RedirectType, redirect } from 'next/navigation';
import { getEventByAlias } from '@/infrastructure/clients/event.client';

export default async function EventAlias(props: { params: Promise<{ eventalias: string }> }) {
  const params = await props.params;
  const session = await auth();

  let destination = routeEventNotFound;

  try {
    const event = await getEventByAlias(params.eventalias, session);

    if (event) {
      destination = `${routeEvents}/${event.id}`;
    }
  } catch (error: any) {
    console.error('Error fetching event by alias.');
  }

  redirect(destination, RedirectType.replace);
}
