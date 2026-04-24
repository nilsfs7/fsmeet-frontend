'use client';

import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { createPoll } from '@/infrastructure/clients/poll.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { routeVoiceManage } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import moment from 'moment';

export const TextButtonCreatePoll = () => {
  const t = useTranslations('/voice/manage/create');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreatePollClicked = async () => {
    const pollInfoObject = sessionStorage.getItem('pollInfo');

    if (pollInfoObject) {
      const pollInfo = JSON.parse(pollInfoObject);

      try {
        await createPoll(pollInfo.question, pollInfo.description, pollInfo.options, pollInfo.deadline ? moment(pollInfo.deadline) : null, pollInfo.targetGroup, session);

        router.push(`${routeVoiceManage}`);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCreatePollClicked}>
        {t('btnCreate')}
      </Button>
    </>
  );
};
