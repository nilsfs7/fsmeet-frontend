'use client';

import TextButton from '@/components/common/text-button';
import { createEvent, updateEventPoster } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Event } from '@/domain/types/event';
import { routeEventSubs } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

export const TextButtonCreateEvent = () => {
  const t = useTranslations('/events/create');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateEventClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    const imgEventPoster = sessionStorage.getItem('imgEventPoster');

    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);

      try {
        const response = await createEvent(event, session);

        if (imgEventPoster) {
          await updateEventPoster(response.id, imgEventPoster, session);
        }

        router.push(`${routeEventSubs}/?tab=myevents`);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <TextButton text={t('btnCreate')} onClick={handleCreateEventClicked} />
    </>
  );
};
