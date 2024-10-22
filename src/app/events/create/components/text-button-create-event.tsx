'use client';

import TextButton from '@/components/common/TextButton';
import { createEvent } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import { routeEventSubs } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

export const TextButtonCreateEvent = () => {
  const t = useTranslations('/events/create');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateEventClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);

      try {
        await createEvent(event, session);
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
