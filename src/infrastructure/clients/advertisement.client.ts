import { defaultHeaders } from './default-headers';
import { ReadAdvertisementResponseDto } from './dtos/advertisement/read-advertisement-response-dto';

export async function getAdvertisements(username: string | null): Promise<ReadAdvertisementResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements?`;

  if (username) {
    url += `username=${username}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching advertisements.`);
  }
}
