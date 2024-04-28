import { UserType } from '@/types/enums/user-type';

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
