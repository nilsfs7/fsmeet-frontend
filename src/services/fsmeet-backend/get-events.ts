import moment from 'moment';
import { Event } from '@/types/event';

export async function getEvents(admin: string | null, participant: string | null, from: moment.Moment | null, to: moment.Moment | null, session?: any): Promise<Event[]> {
  const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?`;

  if (admin) {
    url = url + `admin=${admin}`;
  }

  if (participant) {
    url = url + `&participant=${participant}`;
  }

  if (from) {
    const fromString = `${from.format(format)}Z`;
    url = url + `&dateFrom=${fromString}`;
  }

  if (to) {
    const toString = `${to.format(format)}Z`;
    url = url + `&dateTo=${toString}`;
  }

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

  return await response.json();
}
