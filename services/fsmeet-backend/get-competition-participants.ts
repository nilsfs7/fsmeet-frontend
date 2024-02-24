export async function getCompetitionParticipants(compId: string): Promise<{ username: string }[]> {
  const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;

  const response = await fetch(url);
  return await response.json();
}
