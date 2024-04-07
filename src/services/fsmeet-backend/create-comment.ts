export async function createComment(eventId: string, message: string, session: any): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const body = JSON.stringify({
    eventId: eventId,
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating comment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
