import { Session } from 'next-auth';
import { CreateAccommodationResponseDto } from './dtos/accommodation/create-accommodation.response.dto';
import { CreateAccommodationBodyDto } from './dtos/accommodation/create-accommodation.body.dto';
import { ReadAccommodationResponseDto } from './dtos/accommodation/read-accommodation.response.dto';
import { PatchAccommodationBodyDto } from './dtos/accommodation/patch-accommodation.body.dto';
import { PutAccommodationOrderBodyDto } from './dtos/accommodation/put-accommodation-order.body.dto';
import { defaultHeaders } from './default-headers';
import { Platform } from '@/domain/enums/platform';

export async function getAccommodations(eventId: string | null): Promise<ReadAccommodationResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations?`;

  if (eventId) {
    url += `eventId=${eventId}`;
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
    throw Error(`Error fetching accommodations.`);
  }
}

export async function getAccommodation(accommodationId: string): Promise<ReadAccommodationResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/${accommodationId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching accommodation.`);
  }
}

export async function createAccommodation(
  eventId: string,
  description: string,
  cost: number,
  website: string | null,
  enabled: boolean,
  session: Session | null,
): Promise<CreateAccommodationResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations`;

  const body = new CreateAccommodationBodyDto(eventId, description, cost, website, enabled);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const responseDto = await response.json();
    console.info('Creating accommodation successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateAccommodation(id: string, description: string, cost: number, website: string | null, enabled: boolean, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/${id}`;

  const body = new PatchAccommodationBodyDto(description, cost, website, enabled);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating accommodation successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

/** Replaces the listing order of every accommodation of an event. The first id receives index 0. */
export async function updateAccommodationOrder(eventId: string, accommodationIds: string[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/order`;

  const body = new PutAccommodationOrderBodyDto(eventId, accommodationIds);

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating accommodation order successful');
    return;
  }

  const error = await response.json();
  throw Error(error.message);
}

export async function updateAccommodationPreview(id: string, image: File, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/${id}/preview`;

  const body = new FormData();
  body.append('file', image);

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'x-platform': Platform.WEB,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating accommodation preview successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteAccommodation(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting accommodation successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
