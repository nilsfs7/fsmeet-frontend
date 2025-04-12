import { Session } from 'next-auth';
import { CreateAccommodationResponseDto } from './dtos/accommodation/create-accommodation.response.dto';
import { CreateAccommodationBodyDto } from './dtos/accommodation/create-accommodation.body.dto';
import { ReadAccommodationResponseDto } from './dtos/accommodation/read-accommodation.response.dto';
import { PatchAccommodationBodyDto } from './dtos/accommodation/patch-accommodation.body.dto';
import { DeleteAccommodationBodyDto } from './dtos/accommodation/delete-accommodation.body.dto';

export async function getAccommodations(eventId: string | null): Promise<ReadAccommodationResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/?`;

  if (eventId) {
    url = url + `eventId=${eventId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
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
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching accommodation.`);
  }
}

export async function createAccommodation(eventId: string, description: string, cost: number, website: string, session: Session | null): Promise<CreateAccommodationResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations`;

  const body = new CreateAccommodationBodyDto(eventId, description, cost, website);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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

export async function updateAccommodation(id: string, description: string, cost: number, website: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations`;

  const body = new PatchAccommodationBodyDto(id, description, cost, website);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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

export async function updateAccommodationPreview(id: string, image: any, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations/${id}/logo`;

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
    console.info('Updating accommodation logo successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteAccommodation(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accommodations`;

  const body = new DeleteAccommodationBodyDto(id);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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
