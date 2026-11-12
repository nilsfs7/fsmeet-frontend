'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { Sponsor } from '@/domain/types/sponsor';
import { createSponsor, updateSponsorLogo } from '@/infrastructure/clients/sponsor.client';
import SponsorEditor from '@/components/events/sponsor-editor';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';

export default function CreateEventSponsor(props: { params: Promise<{ eventId: string }> }) {
  const params = use(props.params);
  const t = useTranslations('/events/eventid/sponsors/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [sponsor, setSponsor] = useState<Sponsor>();
  const [sponsorLogo, setSponsorLogo] = useState<File>();

  const handleCreateClicked = async () => {
    if (sponsor) {
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

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} description={t('pageDescription')} />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-4">
            <SponsorEditor
              onSponsorUpdate={(sponsor: Sponsor) => {
                setSponsor(sponsor);
              }}
              onSponsorLogoUpdate={(image: any) => {
                setSponsorLogo(image);
              }}
            />
          </div>
        </div>

        <Navigation>
          <NavigateBackButton />
          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCreateClicked}>
            {t('btnCreate')}
          </Button>
        </Navigation>
      </div>
    </>
  );
}
