import { Session } from 'next-auth';
import { ReadSponsorResponseDto } from './dtos/sponsor/read-sponsor.response.dto';
import { CreateSponsorBodyDto } from './dtos/sponsor/create-sponsor.body.dto';
import { PatchSponsorBodyDto } from './dtos/sponsor/patch-sponsor.body.dto';
import { DeleteSponsorBodyDto } from './dtos/sponsor/delete-sponsor.body.dto';
import { CreateSponsorResponseDto } from './dtos/sponsor/create-sponsor.response.dto';

export async function getSponsors(eventId: string | null): Promise<ReadSponsorResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors/?`;

  if (eventId) {
    url = url + `eventId=${eventId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching sponsors.`);
  }
}

export async function getSponsor(sponsorId: string): Promise<ReadSponsorResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors/${sponsorId}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching sponsor.`);
  }
}

export async function createSponsor(eventId: string, name: string, website: string, isPublic: boolean, session: Session | null): Promise<CreateSponsorResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors`;

  const body = new CreateSponsorBodyDto(eventId, name, website, isPublic);

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
    console.info('Creating sponsor successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateSponsor(id: string, name: string, website: string, isPublic: boolean, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors`;

  const body = new PatchSponsorBodyDto(id, name, website, isPublic);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating sponsor successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateSponsorLogo(id: string, image: any, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors/${id}/logo`;

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
    console.info('Updating sponsor logo successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteSponsor(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/sponsors`;

  const body = new DeleteSponsorBodyDto(id);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting sponsor successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
