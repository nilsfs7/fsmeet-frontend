'use client';

import TextButton from '@/components/common/text-button';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { deleteAccommodation, getAccommodation, updateAccommodation, updateAccommodationPreview } from '@/infrastructure/clients/accommodation.client';
import AccommodationEditor from '@/components/events/accommodation-editor';
import Dialog from '@/components/dialog';
import NavigateBackButton from '@/components/navigate-back-button';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { Accommodation } from '@/domain/types/accommodation';
import { useTranslations } from 'next-intl';

export default function EditEventAccommodation(props: { params: Promise<{ eventId: string; accommodationId: string }> }) {
  const t = useTranslations('/events/eventid/accommodations/edit');
  const params = use(props.params);
  const { data: session, status } = useSession();

  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [accommodation, setAccommodation] = useState<Accommodation>();
  const [accommodationPreview, setAccommodationPreview] = useState<File>();

  const handleSaveClicked = async () => {
    if (accommodation) {
      try {
        await updateAccommodation(params.accommodationId, accommodation.description, accommodation.cost, accommodation.website, accommodation.enabled, session);

        if (accommodationPreview) {
          await updateAccommodationPreview(params.accommodationId, accommodationPreview, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/accommodations`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/accommodations/${params.accommodationId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/accommodations/${params.accommodationId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    if (accommodation) {
      try {
        await deleteAccommodation(params.accommodationId, session);
        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/accommodations`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getEvent(params.eventId, session).then(event => {
      setEvent(event);
    });

    getAccommodation(params.accommodationId).then(accommodation => {
      setAccommodation(accommodation);
    });
  }, [session]);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgDeleteTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgDeleteText')}</p>
      </Dialog>

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AccommodationEditor
            currency={event?.currency || CurrencyCode.EUR}
            accommodation={accommodation}
            onAccommodationUpdate={(accommodation: Accommodation) => {
              setAccommodation(accommodation);
            }}
            onAccommodationPreviewUpdate={async (file: File) => {
              setAccommodationPreview(file);
            }}
          />
        </div>

        <Navigation>
          <NavigateBackButton />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <TextButton text={t('btnSave')} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
