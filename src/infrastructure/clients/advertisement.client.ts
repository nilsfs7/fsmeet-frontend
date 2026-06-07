import { Session } from 'next-auth';
import type { Advertisement } from '@/domain/types/advertisement';
import { defaultHeaders } from './default-headers';
import { Platform } from '@/domain/enums/platform';
import { ReadAdvertisementResponseDto } from './dtos/advertisement/read-advertisement-response-dto';
import { CreateAdvertisementBodyDto } from './dtos/advertisement/create-advertisement.body.dto';
import { CreateAdvertisementResponseDto } from './dtos/advertisement/create-advertisement.response.dto';
import { PatchAdvertisementBodyDto } from './dtos/advertisement/patch-advertisement.body.dto';
import { CreateActivityBodyDto } from './dtos/advertisement/create-activity.body.dto';
import { UserActivity } from '@/domain/enums/user-activity';
import { ReadAdvertisementActivityResponseDto } from './dtos/advertisement/read-activity.response.dto';

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

export async function getAdvertisement(advertisementId: string): Promise<ReadAdvertisementResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${advertisementId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching advertisement.`);
  }
}

export async function createAdvertisement(advertisement: Advertisement, session: Session | null): Promise<CreateAdvertisementResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements`;

  const body = new CreateAdvertisementBodyDto(advertisement.title, advertisement.description, advertisement.targetUrl, advertisement.displayOrder, advertisement.enabled, advertisement.username);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateAdvertisement(advertisementId: string, advertisement: Advertisement, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${advertisementId}`;

  const body = new PatchAdvertisementBodyDto(advertisement.title, advertisement.description, advertisement.targetUrl, advertisement.displayOrder, advertisement.enabled, advertisement.username);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating advertisement successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateAdvertisementImage(id: string, image: File, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${id}/image`;

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
    console.info('Updating advertisement image successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteAdvertisement(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting advertisement successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getAdvertisementActivity(advertisementId: string, session: Session | null): Promise<ReadAdvertisementActivityResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${advertisementId}/activity`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching advertisement.`);
  }
}

export async function createActivity(advertisementId: string, userActivity: UserActivity, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/advertisements/${advertisementId}/activity`;

  const body = new CreateActivityBodyDto(userActivity);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw Error(error.message);
  }
}
