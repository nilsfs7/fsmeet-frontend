import { Event } from '@/types/event';

export async function getEvent(eventId: string, needsAuthorization?: boolean, session?: any): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`;

  let response;

  if (!needsAuthorization) {
    response = await fetch(url);
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  return await response.json();
}
