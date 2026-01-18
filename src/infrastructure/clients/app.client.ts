import { Session } from 'next-auth';
import { CreatePushNotificationBodyDto } from './dtos/create-push-notification.body.dto';
import { defaultHeaders } from './default-headers';

export async function createPushNotification(token: string, title: string, message: string, action: string, arbitraryData: Record<string, string> | undefined, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/app/test/notification`;

  const body = new CreatePushNotificationBodyDto(token, title, message, action, arbitraryData);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating push notification successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
