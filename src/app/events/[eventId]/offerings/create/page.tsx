'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Offering } from '@/types/offering';
import { createOffering, updateOfferingPreview } from '@/infrastructure/clients/offering.client';
import OfferingEditor from '@/components/events/OfferingEditor';
import NavigateBackButton from '@/components/NavigateBackButton';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';

export default function CreateOffering({ params }: { params: { eventId: string } }) {
  const t = useTranslations('/events/eventid/offerings/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [offering, setOffering] = useState<Offering>();
  const [offeringPreview, setOfferingPreview] = useState<any>(null);

  const handleCreateClicked = async () => {
    if (params.eventId && offering) {
      try {
        const offeringId = (await createOffering(params.eventId, offering.description, offering.cost, offering.mandatoryForParticipant, session)).id;

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

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <OfferingEditor
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
