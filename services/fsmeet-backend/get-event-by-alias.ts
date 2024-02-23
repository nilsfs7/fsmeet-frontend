import { Event } from '@/types/event';

export async function getEventByAlias(alias: string): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/alias/${alias}`;

  const response = await fetch(url);
  return await response.json();
}
