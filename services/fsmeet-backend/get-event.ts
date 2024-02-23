import { Event } from '@/types/event';

export async function getEvent(eventId: string, needsAuthorization?: boolean, session?: any): Promise<Event> {
  let response;

  if (!needsAuthorization) {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
  } else {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/manage`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  return await response.json();
}
