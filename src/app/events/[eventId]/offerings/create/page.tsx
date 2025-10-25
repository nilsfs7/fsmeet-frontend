'use client';

import TextButton from '@/components/common/text-button';
import { useParams, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { Offering } from '@/domain/types/offering';
import { createOffering, updateOfferingPreview } from '@/infrastructure/clients/offering.client';
import OfferingEditor from '@/components/events/offering-editor';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { Event } from '@/domain/types/event';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getEvent } from '@/infrastructure/clients/event.client';

export default function CreateOffering(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/offerings/create');

  const { data: session } = useSession();

  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [offering, setOffering] = useState<Offering>();
  const [offeringPreview, setOfferingPreview] = useState<File>();

  const handleCreateClicked = async () => {
    if (offering) {
      try {
        const offeringId = (await createOffering(params.eventId, offering.description, offering.cost, offering.mandatoryForParticipant, offering.includesShirt, offering.enabled, session)).id;

        if (offeringPreview) {
          await updateOfferingPreview(offeringId, offeringPreview, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/offerings`));
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
          <OfferingEditor
            currency={event?.currency || CurrencyCode.EUR}
            onOfferingUpdate={(offering: Offering) => {
              setOffering(offering);
            }}
            onOfferingPreviewUpdate={(image: any) => {
              setOfferingPreview(image);
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
