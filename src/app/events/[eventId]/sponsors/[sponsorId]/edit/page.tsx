'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Sponsor } from '@/domain/types/sponsor';
import { deleteSponsor, getSponsor, updateSponsor, updateSponsorLogo } from '@/infrastructure/clients/sponsor.client';
import SponsorEditor from '@/components/events/sponsor-editor';
import Dialog from '@/components/Dialog';
import NavigateBackButton from '@/components/NavigateBackButton';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';

export default function EditEventSponsor(props: { params: Promise<{ eventId: string; sponsorId: string }> }) {
  const params = use(props.params);
  const { data: session, status } = useSession();

  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor>();
  const [sponsorLogo, setSponsorLogo] = useState<File>();

  const handleSaveClicked = async () => {
    if (sponsor) {
      try {
        await updateSponsor(params.sponsorId, sponsor.name, sponsor.website, sponsor.isPublic, session);

        if (sponsorLogo && sponsor.id) {
          await updateSponsorLogo(sponsor.id.toString(), sponsorLogo, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/sponsors`));
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
    if (sponsor) {
      try {
        await deleteSponsor(params.sponsorId, session);
        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/sponsors`));
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getSponsor(params.sponsorId).then(sponsor => {
      setSponsor(sponsor);
    });
  }, [sponsor === undefined]);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Sponsor" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{`Do you really want to delete this sponsor?`}</p>
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
