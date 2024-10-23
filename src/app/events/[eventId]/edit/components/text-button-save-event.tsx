'use client';

import TextButton from '@/components/common/TextButton';
import { updateEvent } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import { routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

export const TextButtonSaveEvent = () => {
  const t = useTranslations('/events/edit');

  const { data: session } = useSession();
  const router = useRouter();

  const handleSaveClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);

      try {
        await updateEvent(event, session);
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

      <TextButton text={t('btnSave')} onClick={handleSaveClicked} />
    </>
  );
};
