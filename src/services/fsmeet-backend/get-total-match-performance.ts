export async function getTotalMatchPerformance(username: string): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/statistics/matches/${username}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching total match performance.`);
  }
}
