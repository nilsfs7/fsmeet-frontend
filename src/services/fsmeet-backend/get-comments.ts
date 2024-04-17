import { EventComment } from '@/types/event-comment';

export async function getComments(eventId: string): Promise<EventComment[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const response = await fetch(url, {
    method: 'GET',
  });

  return await response.json();
}
