import { EventState } from '@/types/enums/event-state';

export async function updateEventState(session: any, eventId: string, state: EventState): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/state`;

  const body = JSON.stringify({
    id: eventId,
    state: state,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating event state successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
