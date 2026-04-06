'use client';

import TextButton from '@/components/common/text-button';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { Accommodation } from '@/domain/types/accommodation';
import { createAccommodation } from '@/infrastructure/clients/accommodation.client';
import AccommodationEditor from '@/components/events/accommodation-editor';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { Event } from '@/domain/types/event';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getEvent } from '@/infrastructure/clients/event.client';
import { fileToBase64 } from '../../../../../functions/file-to-base-64';

export default function CreateAccommodation(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/accommodations/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [accommodation, setAccommodation] = useState<Accommodation>();
  const [accommodationPreview, setAccommodationPreview] = useState<string>();

  const handleCreateClicked = async () => {
    if (accommodation) {
      try {
        await createAccommodation(params.eventId, accommodation.description, accommodation.cost, accommodation.website, accommodationPreview || null, accommodation.enabled, session);

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
            onAccommodationPreviewUpdate={async (file: File) => {
              const base64String = await fileToBase64(file);
              setAccommodationPreview(base64String);
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
