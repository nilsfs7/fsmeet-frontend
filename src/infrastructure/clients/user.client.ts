import { UserType } from '@/domain/enums/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { User } from '@/domain/types/user';
import { Session } from 'next-auth';
import { DeleteUserBodyDto } from './dtos/user/delete-user.body.dto';
import { Gender } from '@/domain/enums/gender';
import { CreateUserBodyDto } from './dtos/user/create-user.body.dto';
import { UpdateUserBodyDto } from './dtos/user/update-user.body.dto';
import { UpdatePrivateUserInfoBodyDto } from './dtos/user/update-private-user-info.body.dto';
import { PatchWffaIdBodyDto } from './dtos/user/patch-wffa-id.body.dto';
import { CreateStripeAccountOnboardingLinkBodyDto } from './dtos/user/create-stripe-account-onboarding-link.body.dto';
import { ReadAccountOnboardingLinkResponseDto } from './dtos/user/read-stripe-account-link.response.dto';
import { ReadStripeAccountIdResponseDto } from './dtos/user/read-stripe-account-id.response.dto';
import { ReadStripeLoginLinkResponseDto } from './dtos/user/read-stripe-login-link.response.dto';

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
      stripeAccountId: data.private?.stripeAccountId,
      wffaId: data.wffaId,
      isWffaMember: data.isWffaMember,
    };

    return user;
  } else {
    throw Error('Error fetching user.');
  }
}

export async function getUsers(type?: UserType, gender?: Gender, country?: string, hasWffaId?: boolean): Promise<User[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users?`;

  if (type) {
    url = url + `type=${type}`;
  }

  if (gender) {
    url = url + `gender=${gender}`;
  }

  if (country) {
    url = url + `country=${country}`;
  }

  if (hasWffaId !== undefined) {
    url = url + `&hasWffaId=${hasWffaId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  const data: any[] = await response.json();
  const users: User[] = [];

  data.map(data => {
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
      stripeAccountId: data.private?.stripeAccountId,
      wffaId: data.wffaId,
      isWffaMember: data.isWffaMember,
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

export async function createUser(username: string, type: UserType, email: string, password: string, firstName: string, gender?: Gender, country?: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body = new CreateUserBodyDto(username, type, email, password, firstName, gender, country);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
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

  const body = new UpdateUserBodyDto(
    user.username,
    //@ts-ignore TODO
    user.firstName,
    user.lastName,
    user.nickName,
    user.gender,
    user.country,
    user.freestyleSince,
    user.instagramHandle,
    user.tikTokHandle,
    user.youTubeHandle,
    user.website,
    new UpdatePrivateUserInfoBodyDto(
      //@ts-ignore TODO
      user.birthday,
      user.tShirtSize,
      user.houseNumber,
      user.street,
      user.postCode,
      user.city,
      user.exposeLocation,
      user.locLatitude,
      user.locLongitude,
      user.jobAcceptTerms,
      user.jobOfferShows,
      user.jobOfferWalkActs,
      user.jobOfferWorkshops,
      user.jobShowExperience,
      user.phoneCountryCode,
      user.phoneNumber
    )
  );

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
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

export async function updateUserWffaId(session: Session | null, username: string, wffaId: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/wffaid`;

  const body = new PatchWffaIdBodyDto(username, wffaId);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating user WFFA ID successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteUser(username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const body = new DeleteUserBodyDto(username);

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

export async function createStripeAccount(session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/stripe/account`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto: ReadStripeAccountIdResponseDto = await response.json();

    console.info('Creating Stripe account successful');
    return dto.stripeAccountId;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createStripeAccountOnboardingLink(refreshUrl: string, returnUrl: string, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/stripe/accountonboardinglink`;

  const body = new CreateStripeAccountOnboardingLinkBodyDto(refreshUrl, returnUrl);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto: ReadAccountOnboardingLinkResponseDto = await response.json();
    console.info('Creating Stripe account onboarding link successful');
    return dto.onboardingUrl;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createStripeLoginLink(session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/stripe/loginlink`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto: ReadStripeLoginLinkResponseDto = await response.json();
    console.info('Creating Stripe login link successful');
    return dto.loginUrl;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
