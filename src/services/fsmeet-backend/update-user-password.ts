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
