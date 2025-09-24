'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Accommodation } from '@/domain/types/accommodation';
import { createAccommodation, updateAccommodationPreview } from '@/infrastructure/clients/accommodation.client';
import AccommodationEditor from '@/components/events/accommodation-editor';
import NavigateBackButton from '@/components/NavigateBackButton';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { Event } from '@/domain/types/event';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getEvent } from '@/infrastructure/clients/event.client';

export default function CreateAccommodation({ params }: { params: { eventId: string } }) {
  const t = useTranslations('/events/eventid/accommodations/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [accommodation, setAccommodation] = useState<Accommodation>();
  const [accommodationPreview, setAccommodationPreview] = useState<File>();

  const handleCreateClicked = async () => {
    if (params.eventId && accommodation) {
      try {
        const accommodationId = (await createAccommodation(params.eventId, accommodation.description, accommodation.cost, accommodation.website, accommodation.enabled, session)).id;

        if (accommodationPreview) {
          await updateAccommodationPreview(accommodationId, accommodationPreview, session);
        }

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
  }, [event === undefined]);

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AccommodationEditor
            currency={event?.currency || CurrencyCode.EUR}
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
          <TextButton text={t('btnCreate')} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
}
