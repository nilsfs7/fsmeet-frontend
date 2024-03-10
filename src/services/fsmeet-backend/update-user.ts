import { User } from '@/types/user';

export async function updateUser(user: User, session: any): Promise<User> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body = JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    country: user.country,
    instagramHandle: user.instagramHandle,
    tikTokHandle: user.tikTokHandle,
    youTubeHandle: user.youTubeHandle,
    website: user.website,
    private: {
      tShirtSize: user.tShirtSize,
      city: user.city,
      exposeLocation: user.exposeLocation,
    },
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
    const user: any = await response.json();
    user.tShirtSize = user.private?.tShirtSize;
    user.city = user?.private?.city;
    user.exposeLocation = user?.private?.exposeLocation;
    user.locLatitude = user?.private?.locLatitude;
    user.locLongitude = user?.private?.locLongitude;

    console.info('Updating user info successful');

    return user;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
