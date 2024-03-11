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
