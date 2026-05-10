'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { routeAds } from '@/domain/constants/routes';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import PageTitle from '@/components/page-title';
import { useSession } from 'next-auth/react';
import { deleteAdvertisement, getAdvertisement, updateAdvertisement, updateAdvertisementImage } from '@/infrastructure/clients/advertisement.client';
import AdvertisementEditor from '@/components/events/advertisement-editor';
import Dialog from '@/components/dialog';
import NavigateBackButton from '@/components/navigate-back-button';
import { addFetchTrigger } from '@/functions/add-fetch-trigger';
import type { Advertisement } from '@/domain/types/advertisement';
import { useTranslations } from 'next-intl';

export default function EditAdvertisementPage(props: { params: Promise<{ advertisementId: string }> }) {
  const t = useTranslations('/ads/edit');
  const params = use(props.params);
  const { data: session } = useSession();

  const router = useRouter();

  const [advertisement, setAdvertisement] = useState<Advertisement>();
  const [advertisementImage, setAdvertisementImage] = useState<File>();

  const username = session?.user?.username ?? '';

  const handleSaveClicked = async () => {
    if (!advertisement?.id) {
      return;
    }

    try {
      await updateAdvertisement(params.advertisementId, { ...advertisement, username: advertisement.username || username }, session);

      if (advertisementImage) {
        await updateAdvertisementImage(params.advertisementId, advertisementImage, session);
      }

      router.replace(addFetchTrigger(routeAds));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('toastSaveFailed');
      toast.error(message);
      console.error(message);
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeAds}/${params.advertisementId}/edit?delete=1`);
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeAds}/${params.advertisementId}/edit`);
  };

  const handleConfirmDeleteClicked = async () => {
    try {
      await deleteAdvertisement(params.advertisementId, session);
      router.replace(addFetchTrigger(routeAds));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('toastDeleteFailed');
      toast.error(message);
      console.error(message);
    }
  };

  useEffect(() => {
    void getAdvertisement(params.advertisementId)
      .then(dto => {
        setAdvertisement(dto);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : t('toastLoadFailed');
        toast.error(message);
        console.error(message);
      });
  }, [params.advertisementId, t]);

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgDeleteTitle')} queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>{t('dlgDeleteText')}</p>
      </Dialog>

      <div className="min-h-0 flex-1 flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          {advertisement ? (
            <AdvertisementEditor
              key={advertisement.id}
              username={advertisement.username || username}
              advertisement={advertisement}
              onAdvertisementUpdate={(next: Advertisement) => {
                setAdvertisement(next);
              }}
              onAdvertisementImageUpdate={async (file: File) => {
                setAdvertisementImage(file);
              }}
            />
          ) : null}
        </div>

        <Navigation>
          <NavigateBackButton />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleSaveClicked}>
              {t('btnSave')}
            </Button>
          </div>
        </Navigation>
      </div>
    </>
  );
}
