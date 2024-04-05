import { EventRegistration } from '@/types/event-registration';

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;

  const response = await fetch(url);
  return await response.json();
}
