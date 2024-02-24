import { License } from '@/types/license';

export async function getLicenses(session?: any): Promise<License[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/licenses`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return await response.json();
}
