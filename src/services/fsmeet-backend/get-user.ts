import { User } from '@/types/user';

export async function getUser(username: string, session?: any): Promise<User> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${username}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const data: any = await response.json();

    const user: User = {
      username: data.username,
      type: data.type,
      imageUrl: data.imageUrl,
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
      gender: data.gender,
      country: data.country,
      instagramHandle: data.instagramHandle,
      tikTokHandle: data.tikTokHandle,
      youTubeHandle: data.youTubeHandle,
      website: data.website,
      verificationState: data.verificationState,
      tShirtSize: data.private?.tShirtSize,
      houseNumber: data.private?.houseNumber,
      street: data.private?.street,
      postCode: data.private?.postCode,
      city: data.private?.city,
      exposeLocation: data.private?.exposeLocation,
      locLatitude: data.private?.locLatitude,
      locLongitude: data.private?.locLongitude,
    };

    return user;
  } else {
    throw Error('Error fetching user.');
  }
}
