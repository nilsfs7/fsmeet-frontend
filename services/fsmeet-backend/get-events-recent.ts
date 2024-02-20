import { Event } from '@/types/event';

export async function getEventsRecent(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/recent/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url);
  return await response.json();
}
