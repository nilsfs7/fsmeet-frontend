import { ReadAdvertisementResponseDto } from './dtos/advertisement/read-advertisement-response-dto';

/** Public list of ads for the events UI (enabled only, ordered). */
export async function getAdvertisements(): Promise<ReadAdvertisementResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching advertisements.`);
  }
}
