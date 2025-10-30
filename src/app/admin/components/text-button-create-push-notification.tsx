'use client';

import TextButton from '@/components/common/text-button';
import { useSession } from 'next-auth/react';
import { createPushNotification } from '../../../infrastructure/clients/app.client';

export const TextButtonCreatePushNotification = () => {
  const { data: session } = useSession();

  const handleClicked = async () => {
    await createPushNotification(
      'ecJzMzqei0HOptD1O3Fpe2:APA91bGma4eX1Av1IyfXSHzA_rVkb5-IlkRn5MQaeTeoL48trpzMHbPuh51iPp7ee5fhRT2AQu8kCsMOoi8T6h6sNbuKeYiXuPDutiwXpB5qYCVRtoCwieM',
      'New Event on FSMeet!',
      'Nils created GFFC 2026. Check now...',
      'event',
      {
        eventId: '5d137824-3fba-4e05-97e8-3b2491e7beea',
      },
      session
    );
  };

  return <TextButton text={'Create Push Notification'} onClick={handleClicked} />;
};
