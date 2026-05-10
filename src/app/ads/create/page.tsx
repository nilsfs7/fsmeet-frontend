'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routeAds } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import type { Advertisement } from '@/domain/types/advertisement';
import { createAdvertisement, updateAdvertisementImage } from '@/infrastructure/clients/advertisement.client';
import AdvertisementEditor from '@/components/events/advertisement-editor';
import NavigateBackButton from '@/components/navigate-back-button';
import { useTranslations } from 'next-intl';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';

export default function CreateAdvertisementPage() {
  const t = useTranslations('/ads/create');
  const { data: session } = useSession();

  const router = useRouter();

  const [advertisement, setAdvertisement] = useState<Advertisement>();
  const [advertisementImage, setAdvertisementImage] = useState<File>();

  const username = session?.user?.username ?? '';

  const handleCreateClicked = async () => {
    if (!username) {
      toast.error(t('toastNeedLogin'));
      return;
    }
    if (advertisement) {
      try {
        const res = await createAdvertisement(advertisement, session);

        if (advertisementImage) {
          await updateAdvertisementImage(res.id, advertisementImage, session);
        }

        router.replace(addFetchTrigger(routeAds));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : t('toastCreateFailed');
        toast.error(message);
        console.error(message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <AdvertisementEditor
            username={username}
            onAdvertisementUpdate={(next: Advertisement) => {
              setAdvertisement(next);
            }}
            onAdvertisementImageUpdate={async (file: File) => {
              setAdvertisementImage(file);
            }}
          />
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
