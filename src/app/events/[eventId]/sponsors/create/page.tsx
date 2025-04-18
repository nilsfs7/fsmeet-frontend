'use client';

import TextButton from '@/components/common/TextButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { useSession } from 'next-auth/react';
import { Sponsor } from '@/types/sponsor';
import { createSponsor, updateSponsorLogo } from '@/infrastructure/clients/sponsor.client';
import SponsorEditor from '@/components/events/SponsorEditor';
import NavigateBackButton from '@/components/NavigateBackButton';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';

export default function CreateEventSponsor({ params }: { params: { eventId: string } }) {
  const t = useTranslations('/events/eventid/sponsors/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor>();
  const [sponsorLogo, setSponsorLogo] = useState<File>();

  const handleCreateClicked = async () => {
    if (params.eventId && sponsor) {
      try {
        const sponsorId = (await createSponsor(params.eventId, sponsor.name, sponsor.website, sponsor.isPublic, session)).id;

        if (sponsorLogo) {
          await updateSponsorLogo(sponsorId, sponsorLogo, session);
        }

        router.replace(addFetchTrigger(`${routeEvents}/${params.eventId}/sponsors`));
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
          <SponsorEditor
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
          <TextButton text={t('btnCreate')} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
}
