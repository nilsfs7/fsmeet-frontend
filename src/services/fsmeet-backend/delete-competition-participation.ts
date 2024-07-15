import { Session } from 'next-auth';

export async function deleteCompetitionParticipation(compId: string, username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;

  const body = JSON.stringify({
    username: `${username}`,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Removing competition participation successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
