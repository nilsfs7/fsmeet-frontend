export async function updateUserImage(image: any, session: any): Promise<string> {
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
