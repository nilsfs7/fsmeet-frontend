export async function deleteCompetition(compId: string, session: any): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions`;

  const body = JSON.stringify({
    id: `${compId}`,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting competition successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
