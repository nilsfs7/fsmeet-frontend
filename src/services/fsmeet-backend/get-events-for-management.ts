import moment from 'moment';
import { Event } from '@/types/event';

export async function getEventsForManagement(session: any, from: moment.Moment, to: moment.Moment): Promise<Event[]> {
  const format = 'YYYY-MM-DDTHH:mm:ss.SSS';

  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/manage?`;

  if (from) {
    const fromString = `${from.format(format)}Z`;
    url = url + `dateFrom=${fromString}`;
  }

  if (to) {
    const toString = `${to.format(format)}Z`;
    url = url + `&dateTo=${toString}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return await response.json();
}
