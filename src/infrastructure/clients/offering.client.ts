import { Session } from 'next-auth';
import { CreateOfferingResponseDto } from './dtos/offering/create-offering.response.dto';
import { CreateOfferingBodyDto } from './dtos/offering/create-offering.body.dto';
import { ReadOfferingResponseDto } from './dtos/offering/read-offering.response.dto';
import { PatchOfferingBodyDto } from './dtos/offering/patch-offering.body.dto';
import { DeleteOfferingBodyDto } from './dtos/offering/delete-offering.body.dto';

export async function getOfferings(eventId: string | null): Promise<ReadOfferingResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings/?`;

  if (eventId) {
    url = url + `eventId=${eventId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching offerings.`);
  }
}

export async function getOffering(offeringId: string): Promise<ReadOfferingResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings/${offeringId}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching offering.`);
  }
}

export async function createOffering(
  eventId: string,
  description: string,
  cost: number,
  mandatoryForParticipant: boolean,
  includesShirt: boolean,
  enabled: boolean,
  session: Session | null
): Promise<CreateOfferingResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings`;

  const body = new CreateOfferingBodyDto(eventId, description, cost, mandatoryForParticipant, includesShirt, enabled);

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
    console.info('Creating offering successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateOffering(
  id: string,
  description: string,
  cost: number,
  mandatoryForParticipant: boolean,
  includesShirt: boolean,
  enabled: boolean,
  session: Session | null
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings`;

  const body = new PatchOfferingBodyDto(id, description, cost, mandatoryForParticipant, includesShirt, enabled);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating offering successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateOfferingPreview(id: string, image: File, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings/${id}/logo`;

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
    console.info('Updating offering logo successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteOffering(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/offerings`;

  const body = new DeleteOfferingBodyDto(id);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting offering successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
