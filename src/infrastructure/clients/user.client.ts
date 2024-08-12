import { UserType } from '@/types/enums/user-type';
import { UserVerificationState } from '@/types/enums/user-verification-state';
import { User } from '@/types/user';
import { Session } from 'next-auth';
import { DeleteUserBodyDto } from './dtos/delete-user.body.dto';

export async function getUser(username: string, session?: Session | null): Promise<User> {
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
      jobAcceptTerms: data.private?.jobAcceptTerms,
      jobOfferShows: data.private?.jobOfferShows,
      jobOfferWalkActs: data.private?.jobOfferWalkActs,
      jobOfferWorkshops: data.private?.jobOfferWorkshops,
      jobShowExperience: data.private?.jobShowExperience,
      phoneNumber: data.private?.phoneNumber,
      wffaId: data.wffaId,
    };

    return user;
  } else {
    throw Error('Error fetching user.');
  }
}

export async function getUsers(type?: UserType): Promise<User[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users?`;

  if (type) {
    url = url + `type=${type}`;
  }

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
      jobAcceptTerms: data.private?.jobAcceptTerms,
      jobOfferShows: data.private?.jobOfferShows,
      jobOfferWalkActs: data.private?.jobOfferWalkActs,
      jobOfferWorkshops: data.private?.jobOfferWorkshops,
      jobShowExperience: data.private?.jobShowExperience,
      phoneCountryCode: data.private?.phoneCountryCode,
      phoneNumber: data.private?.phoneNumber,
      wffaId: data.wffaId,
    };

    users.push(user);
  });

  return users;
}

// todo: turn into post
export async function getConfirmUser(username: string, requestToken: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/confirm/user?username=${username}&requestToken=${requestToken}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status == 200) {
    return true;
  }

  return false;
}

export async function createUser(username: string, type: UserType, email: string, password: string, firstName: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body = JSON.stringify({
    username: username,
    type: type,
    email: email,
    password: password,
    firstName: firstName.trim(),
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.info('Creating user successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createPasswordReset(usernameOrEmail: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/password/reset`;

  const body = JSON.stringify({
    usernameOrEmail: usernameOrEmail,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.info('Password reset request successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

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
      jobAcceptTerms: user.jobAcceptTerms,
      jobOfferShows: user.jobOfferShows,
      jobOfferWalkActs: user.jobOfferWalkActs,
      jobOfferWorkshops: user.jobOfferWorkshops,
      jobShowExperience: user.jobShowExperience,
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
    user.jobAcceptTerms = user.private?.jobAcceptTerms;
    user.jobOfferShows = user.private?.jobOfferShows;
    user.jobOfferWalkActs = user.private?.jobOfferWalkActs;
    user.jobOfferWorkshops = user.private?.jobOfferWorkshops;
    user.jobShowExperience = user.private?.jobShowExperience;
    user.phoneCountryCode = user.private?.phoneCountryCode;
    user.phoneNumber = user.private?.phoneNumber;

    console.info('Updating user info successful');

    return user;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateUserImage(image: any, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/image`;

  const body = new FormData();
  body.append('file', image);

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating user image successful');

    const resBody = await response.json();
    return resBody.imageUrl;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateUserPassword(requestToken: string, password: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/password/reset`;

  const body = JSON.stringify({ requestToken: requestToken, password: password });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.info('Updating password successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateUserVerificationState(session: Session | null, username: string, verificationState: UserVerificationState): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/state`;

  const body = JSON.stringify({
    username: username,
    verificationState: verificationState,
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
    console.info('Updating user verification state successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteUser(username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body: DeleteUserBodyDto = {
    username: username,
  };

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting user info successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteUserImage(session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/image`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting user image successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
