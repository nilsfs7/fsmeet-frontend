import { Session } from 'next-auth';
import { defaultHeaders } from './default-headers';

export async function createFeedbackBug(message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/bugs`;

  const body = JSON.stringify({
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating bug report successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createFeedbackFeature(message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/features`;

  const body = JSON.stringify({
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating feature request successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createFeedbackGeneral(message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/feedback/general`;

  const body = JSON.stringify({
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating feedback successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
