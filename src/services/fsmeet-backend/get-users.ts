import { User } from '@/types/user';

export async function getUsers(): Promise<User[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const data: any[] = await response.json();
  const users: User[] = [];

  data.map((d) => {
    const user: User = {
      username: d.username,
      type: d.type,
      imageUrl: d.imageUrl,
      firstName: d.firstName,
      lastName: d.lastName,
      gender: d.gender,
      country: d.country,
      instagramHandle: d.instagramHandle,
      tikTokHandle: d.tikTokHandle,
      youTubeHandle: d.youTubeHandle,
      website: d.website,
      verificationState: d.verificationState,
      tShirtSize: d.private?.tShirtSize,
      houseNumber: d.private?.houseNumber,
      street: d.private?.street,
      postCode: d.private?.postCode,
      city: d.private?.city,
      exposeLocation: d.private?.exposeLocation,
      locLatitude: d.private?.locLatitude,
      locLongitude: d.private?.locLongitude,
    };

    users.push(user);
  });

  return users;
}
