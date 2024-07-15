import { Round } from '@/types/round';
import { Session } from 'next-auth';

export async function createRounds(compId: string, rounds: Round[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const body = JSON.stringify({
    rounds: rounds,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
