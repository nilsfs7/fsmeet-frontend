import { Event } from '@/types/event';

export async function getEventByAlias(alias: string, session?: any): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/alias/${alias}`;

  let response;

  if (!session) {
    response = await fetch(url, { cache: 'no-store' });
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      cache: 'no-store',
    });
  }

  if (response.ok) {
    console.info('Getting event by alias successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
