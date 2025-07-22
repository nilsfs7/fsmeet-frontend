'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Offering } from '@/domain/types/offering';
import { deleteOffering, getOffering, updateOffering, updateOfferingPreview } from '@/infrastructure/clients/offering.client';
import OfferingEditor from '@/components/events/OfferingEditor';
import Dialog from '@/components/Dialog';
import NavigateBackButton from '@/components/NavigateBackButton';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';

export default function EditEventOffering({ params }: { params: { eventId: string; offeringId: string } }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [event, setEvent] = useState<Event>();
  const [offering, setOffering] = useState<Offering>();
  const [offeringPreview, setOfferingPreview] = useState<File>();

  const handleSaveClicked = async () => {
    if (params.eventId && offering) {
      try {
        await updateOffering(params.offeringId, offering.description, offering.cost, offering.mandatoryForParticipant, offering.includesShirt, session);

        if (offeringPreview && offering.id) {
          await updateOfferingPreview(offering.id.toString(), offeringPreview, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/offerings`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/offerings/${params.offeringId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/offerings/${params.offeringId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    if (params.eventId && offering) {
      try {
        await deleteOffering(params.offeringId, session);
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

    getOffering(params.offeringId).then(offering => {
      setOffering(offering);
    });
  }, [event === undefined, offering === undefined]);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Offering" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{`Do you really want to delete this offering?`}</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        {/* todo: translations */}
        <PageTitle title="Edit Offering" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <OfferingEditor
            currency={event?.currency || CurrencyCode.EUR}
            offering={offering}
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

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <TextButton text={'Save'} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
