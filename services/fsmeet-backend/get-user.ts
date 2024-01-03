import { User } from '@/types/user';

export async function getUser(username: string): Promise<User> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${username}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    const user: any = await response.json();

    // user.tShirtSize = user.private?.tShirtSize
    user.city = user?.private?.city;
    user.locLatitude = user?.private?.locLatitude;
    user.locLongitude = user?.private?.locLongitude;

    return user;
  } else {
    throw Error('Error fetching acting user.');
  }
}
