import { Session } from 'next-auth';

export async function deleteRounds(compId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting rounds successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
