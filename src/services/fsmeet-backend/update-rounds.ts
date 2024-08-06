import { Round } from '@/types/round';
import { Session } from 'next-auth';

export async function updateRounds(compId: string, rounds: Round[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const body = JSON.stringify(rounds);

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
