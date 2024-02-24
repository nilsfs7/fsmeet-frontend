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
