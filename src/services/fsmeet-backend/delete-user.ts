export async function deleteUser(session: any): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('deleting user info successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
