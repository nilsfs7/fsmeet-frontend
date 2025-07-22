'use client';

import { deleteEvent } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Event } from '@/domain/types/event';
import { routeEvents, routeEventSubs } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/Dialog';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';

export const ActionButtonDeleteEvent = () => {
  const t = useTranslations('/events/edit');

  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);
      router.replace(`${routeEvents}/${event.id}/edit?delete=1`);
    }
  };

  const handleConfirmDeleteClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      try {
        const event: Event = JSON.parse(eventInfoObject);
        if (event.id) {
          await deleteEvent(event.id, session);
          router.push(routeEventSubs);
        }
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleCancelDeleteClicked = async () => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      const event: Event = JSON.parse(eventInfoObject);
      router.replace(`${routeEvents}/${event.id}/edit`);
    }
  };

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgEventDeletionTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgEventDeletionText')}</p>
      </Dialog>

      <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
    </>
  );
};
