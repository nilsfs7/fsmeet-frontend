'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routeEvents } from '@/types/consts/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Sponsor } from '@/types/sponsor';
import { createSponsor } from '@/infrastructure/clients/sponsor.client';
import SponsorEditor from '@/components/events/SponsorEditor';

export default function CreateEventSponsor({ params }: { params: { eventId: string } }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor>();

  const handleCreateClicked = async () => {
    if (params.eventId && sponsor) {
      try {
        await createSponsor(params.eventId.toString(), sponsor.name, sponsor.website, session);
        router.replace(`${routeEvents}/${params.eventId}/sponsors?timestamp=${new Date().getTime()}`); // add query param -> triggers refetching data
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
        <PageTitle title="Create Sponsor" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <SponsorEditor
            onSponsorUpdate={(sponsor: Sponsor) => {
              setSponsor(sponsor);
            }}
          />
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
          <TextButton text={'Create'} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
}
