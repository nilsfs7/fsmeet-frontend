import { Event } from '@/types/event';

export async function getEvent(eventId: string, session?: any): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`;

  let response;

  if (!session) {
    response = await fetch(url);
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  if (response.ok) {
    console.info('Getting event successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
