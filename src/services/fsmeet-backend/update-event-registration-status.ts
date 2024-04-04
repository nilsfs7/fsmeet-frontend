import { EventRegistrationStatus } from '@/types/enums/event-registration-status';

export async function updateEventRegistrationStatus(eventId: string, username: string, status: EventRegistrationStatus, session: any): Promise<void> {
  const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/status`;

  const body = JSON.stringify({
    username: `${username}`,
    status: status,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting event registration successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
