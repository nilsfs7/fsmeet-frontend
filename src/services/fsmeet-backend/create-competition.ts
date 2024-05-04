import { EventCompetition } from '@/types/event-competition';

export async function createCompetition(eventId: string, comp: EventCompetition, session: any): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`;

  const body = JSON.stringify({
    eventId: eventId,
    name: comp?.name.trim(),
    type: comp.type,
    gender: comp.gender,
    description: comp?.description.trim(),
    rules: comp?.rules.trim(),
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
    console.info('Creating competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
