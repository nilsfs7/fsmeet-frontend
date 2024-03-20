import { EventCompetition } from '@/types/event-competition';

export async function updateCompetition(comp: EventCompetition, session: any): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`;

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

  return response;
}
