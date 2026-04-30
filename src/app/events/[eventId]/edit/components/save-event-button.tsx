'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { dataUrlToFile } from '@/functions/base-64';
import { updateEvent, updateEventPoster } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Event } from '@/domain/types/event';
import { routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

export const SaveEventButton = () => {
  const t = useTranslations('/events/edit');

  const { data: session } = useSession();
  const router = useRouter();

  const handleSaveClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    const imgEventPoster = sessionStorage.getItem('imgEventPoster');

    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);

      try {
        await updateEvent(event, session);

        if (imgEventPoster && event.id) {
          await updateEventPoster(event.id, dataUrlToFile(imgEventPoster), session);
        }

        router.replace(`${routeEvents}/${event.id}`);
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

      <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSaveClicked}>
        {t('btnSave')}
      </Button>
    </>
  );
};
