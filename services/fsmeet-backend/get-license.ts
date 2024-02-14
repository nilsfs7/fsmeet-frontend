export async function getLicense(session: any, username: string): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/licenses/${username}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return await response.json();
}
