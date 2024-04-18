import { UserVerificationState } from '@/types/enums/user-verification-state';

export async function updateUserVerificationState(session: any, username: string, verificationState: UserVerificationState): Promise<void> {
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
