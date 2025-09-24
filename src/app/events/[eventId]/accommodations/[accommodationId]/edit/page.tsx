'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter, useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { deleteAccommodation, getAccommodation, updateAccommodation, updateAccommodationPreview } from '@/infrastructure/clients/accommodation.client';
import AccommodationEditor from '@/components/events/accommodation-editor';
import Dialog from '@/components/Dialog';
import NavigateBackButton from '@/components/NavigateBackButton';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { Accommodation } from '@/domain/types/accommodation';

export default function EditEventAccommodation(props: { params: Promise<{ eventId: string; accommodationId: string }> }) {
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

        if (accommodationPreview && accommodation.id) {
          await updateAccommodationPreview(accommodation.id.toString(), accommodationPreview, session);
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

      <Dialog title="Delete Accommodation" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{`Do you really want to delete this accommodation?`}</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        {/* todo: translations */}
        <PageTitle title="Edit Accommodation" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AccommodationEditor
            currency={event?.currency || CurrencyCode.EUR}
            accommodation={accommodation}
            onAccommodationUpdate={(accommodation: Accommodation) => {
              setAccommodation(accommodation);
            }}
            onAccommodationPreviewUpdate={(image: any) => {
              setAccommodationPreview(image);
            }}
          />
        </div>

        <Navigation>
          <NavigateBackButton />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <TextButton text={'Save'} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
