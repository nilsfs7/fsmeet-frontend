import { Session } from 'next-auth';
import { CreateAttachmentResponseDto } from './dtos/attachment/create-attachment.response.dto';
import { CreateAttachmentBodyDto } from './dtos/attachment/create-attachment.body.dto';
import { ReadAttachmentResponseDto } from './dtos/attachment/read-attachment.response.dto';
import { PatchAttachmentBodyDto } from './dtos/attachment/patch-attachment.body.dto';
import { defaultHeaders } from './default-headers';
import { Platform } from '@/domain/enums/platform';

export async function getAttachments(eventId: string | null): Promise<ReadAttachmentResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments/?`;

  if (eventId) {
    url += `eventId=${eventId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching attachments.`);
  }
}

export async function getAttachment(attachmentId: string): Promise<ReadAttachmentResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments/${attachmentId}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching attachment.`);
  }
}

export async function createAttachment(
  eventId: string,
  name: string,
  isExternal: boolean,
  documentUrl: string | null,
  expires: boolean,
  expiryDate: string | null,
  enabled: boolean,
  session: Session | null,
): Promise<CreateAttachmentResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments`;

  const body = new CreateAttachmentBodyDto(eventId, name, isExternal, documentUrl, expires, expiryDate, enabled);

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
    console.info('Creating attachment successful');

    return responseDto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateAttachment(
  id: string,
  name: string,
  isExternal: boolean,
  documentUrl: string | null,
  expires: boolean,
  expiryDate: string | null,
  enabled: boolean,
  session: Session | null,
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments/${id}`;

  const body = new PatchAttachmentBodyDto(name, isExternal, documentUrl, expires, expiryDate, enabled);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating attachment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateAttachmentFile(id: string, file: File, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments/${id}/file`;

  const body = new FormData();
  body.append('file', file);

  const response = await fetch(url, {
    method: 'PUT',
    body,
    headers: {
      'x-platform': Platform.WEB,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating attachment file successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteAttachment(id: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/attachments/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting attachment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
