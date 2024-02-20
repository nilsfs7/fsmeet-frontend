import { Event } from '@/types/event';

export async function getEventsOngoing(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/ongoing/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url);
  return await response.json();
}
