import { Event } from '@/types/event';

export async function getEventsUpcoming(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/upcoming/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url);
  return await response.json();
}
