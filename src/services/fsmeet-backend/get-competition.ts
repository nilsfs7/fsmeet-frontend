import { EventCompetition } from '@/types/event-competition';

export async function getCompetition(compId: string): Promise<EventCompetition> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}`;

  const response = await fetch(url, {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.info('Getting competition successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
