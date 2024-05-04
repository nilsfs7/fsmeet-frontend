import { EventCompetition } from '@/types/event-competition';

export async function updateCompetition(comp: EventCompetition, session: any): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    id: comp.id,
    name: comp?.name.trim(),
    description: comp?.description.trim(),
    rules: comp?.rules.trim(),
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
