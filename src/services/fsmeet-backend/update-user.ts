import { User } from '@/types/user';
import { Session } from 'next-auth';

export async function updateUser(user: User, session: Session | null): Promise<User> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body = JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
    gender: user.gender,
    country: user.country,
    freestyleSince: user.freestyleSince,
    instagramHandle: user.instagramHandle,
    tikTokHandle: user.tikTokHandle,
    youTubeHandle: user.youTubeHandle,
    website: user.website,
    private: {
      birthday: user.birthday,
      tShirtSize: user.tShirtSize,
      houseNumber: user.houseNumber,
      street: user.street,
      postCode: user.postCode,
      city: user.city,
      exposeLocation: user.exposeLocation,
      locLatitude: user.locLatitude,
      locLongitude: user.locLongitude,
      phoneCountryCode: user.phoneCountryCode,
      phoneNumber: user.phoneNumber,
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
    user.houseNumber = user.private?.houseNumber;
    user.street = user.private?.street;
    user.postCode = user.private?.postCode;
    user.city = user.private?.city;
    user.exposeLocation = user.private?.exposeLocation;
    user.locLatitude = user.private?.locLatitude;
    user.locLongitude = user.private?.locLongitude;
    user.phoneCountryCode = user.private?.phoneCountryCode;
    user.phoneNumber = user.private?.phoneNumber;

    console.info('Updating user info successful');

    return user;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
