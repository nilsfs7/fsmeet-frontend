import { User } from '@/types/user';

export async function getUsers(): Promise<User[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;
  const response = await fetch(url, {
    method: 'GET',
  });

  const data: any[] = await response.json();
  const users: User[] = [];

  data.map(d => {
    const user: User = d;
    // user.tShirtSize = user.private?.tShirtSize
    user.city = d.private?.city;
    user.locLatitude = d.private?.locLatitude;
    user.locLongitude = d.private?.locLongitude;

    users.push(user);
  });

  return users;
}
