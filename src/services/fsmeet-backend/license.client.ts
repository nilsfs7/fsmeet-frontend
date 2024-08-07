import { License } from '@/types/license';
import { Session } from 'next-auth';

export async function getLicense(session: Session | null, username: string): Promise<any> {
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

export async function getLicenses(session: Session | null): Promise<License[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/licenses`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return await response.json();
}

export async function updateLicense(session: Session | null, license: License): Promise<void> {
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

  if (response.ok) {
    console.info('Updating license successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
