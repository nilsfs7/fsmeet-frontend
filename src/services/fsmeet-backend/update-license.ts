import { License } from '@/types/license';

export async function updateLicense(session: any, license: License): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/licenses`;

  const body = JSON.stringify({
    username: license.username,
    amountEventLicenses: license.amountEventLicenses,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return response;
}
