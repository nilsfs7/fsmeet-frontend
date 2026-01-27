import { Session } from 'next-auth';
import { CreateBroadcastBodyDto } from './dtos/notification/create-broadcast-notification.body.dto';
import { NotificationAction } from '../../domain/enums/notification-action';
import { defaultHeaders } from './default-headers';

export async function createBroadcast(title: string, message: string, action: NotificationAction, arbitraryData: Record<string, string> = {}, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/notification/broadcast`;

  const body = new CreateBroadcastBodyDto(title, message, action, arbitraryData);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating broadcast successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
