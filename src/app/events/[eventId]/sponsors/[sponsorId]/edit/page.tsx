'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { routeEvents } from '@/types/consts/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Sponsor } from '@/types/sponsor';
import { deleteSponsor, getSponsor, updateSponsor, updateSponsorLogo } from '@/infrastructure/clients/sponsor.client';
import SponsorEditor from '@/components/events/SponsorEditor';
import Dialog from '@/components/Dialog';

export default function EditEventSponsor({ params }: { params: { eventId: string; sponsorId: string } }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor>();
  const [sponsorLogo, setSponsorLogo] = useState<any>(null);

  const handleSaveClicked = async () => {
    if (params.eventId && sponsor) {
      try {
        await updateSponsor(params.sponsorId, sponsor.name, sponsor.website, session);

        if (sponsorLogo && sponsor.id) {
          await updateSponsorLogo(sponsor.id.toString(), sponsorLogo, session);
        }

        router.replace(`${routeEvents}/${params.eventId}/sponsors?timestamp=${new Date().getTime()}`); // add query param -> triggers refetching data
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/sponsors/${params.sponsorId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${params.eventId}/sponsors/${params.sponsorId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    if (params.eventId && sponsor) {
      try {
        await deleteSponsor(params.sponsorId, session);
        router.replace(`${routeEvents}/${params.eventId}/sponsors?timestamp=${new Date().getTime()}`); // add query param -> triggers refetching data
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getSponsor(params.sponsorId).then((sponsor) => {
      setSponsor(sponsor);
    });
  }, [sponsor === undefined]);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Sponsor" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this sponsor?</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Edit Sponsor" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <SponsorEditor
            sponsor={sponsor}
            onSponsorUpdate={(sponsor: Sponsor) => {
              setSponsor(sponsor);
            }}
            onSponsorLogoUpdate={(image: any) => {
              setSponsorLogo(image);
            }}
          />
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.back()} />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <TextButton text={'Save'} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
}
