export async function updateMatchSlots(eventId: string, compId: string, matchId: string, slotIndex: number, username: string, result: number | undefined, session: any): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/matches/${matchId}/slots`;

  const body = JSON.stringify({
    eventId: eventId,
    slotIndex: slotIndex,
    name: username,
    result: result,
  });

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (response.ok) {
    console.info(`match ${matchId} updated.`);
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
  return response;
}
