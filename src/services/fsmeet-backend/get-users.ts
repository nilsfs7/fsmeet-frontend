import { User } from '@/types/user';

export async function getUsers(): Promise<User[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const response = await fetch(url, {
    method: 'GET',
  });

  const data: any[] = await response.json();
  const users: User[] = [];

  data.map((data) => {
    const user: User = {
      username: data.username,
      type: data.type,
      imageUrl: data.imageUrl,
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
      gender: data.gender,
      country: data.country,
      age: data.age,
      freestyleSince: data.freestyleSince,
      instagramHandle: data.instagramHandle,
      tikTokHandle: data.tikTokHandle,
      youTubeHandle: data.youTubeHandle,
      website: data.website,
      verificationState: data.verificationState,
      birthday: data.private?.birthday,
      tShirtSize: data.private?.tShirtSize,
      houseNumber: data.private?.houseNumber,
      street: data.private?.street,
      postCode: data.private?.postCode,
      city: data.private?.city,
      exposeLocation: data.private?.exposeLocation,
      locLatitude: data.private?.locLatitude,
      locLongitude: data.private?.locLongitude,
      phoneCountryCode: data.private?.phoneCountryCode,
      phoneNumber: data.private?.phoneNumber,
      wffaId: data.wffaId,
    };

    users.push(user);
  });

  return users;
}
