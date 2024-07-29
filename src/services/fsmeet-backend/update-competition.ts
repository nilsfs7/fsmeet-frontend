import { Competition } from '@/types/competition';
import { Session } from 'next-auth';

export async function updateCompetition(comp: Competition, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    id: comp.id,
    name: comp?.name.trim(),
    maxAge: comp?.maxAge,
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
