'use client';

import TextButton from '@/components/common/TextButton';
import { createPoll } from '@/infrastructure/clients/poll.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { routeVoiceManage } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import { Poll } from '@/domain/types/poll';
import moment from 'moment';

export const TextButtonCreatePoll = () => {
  const t = useTranslations('/voice/manage/create');

  const { data: session } = useSession();
  const router = useRouter();

  const handleCreatePollClicked = async () => {
    const pollInfoObject = sessionStorage.getItem('pollInfo');

    if (pollInfoObject) {
      const poll: Poll = JSON.parse(pollInfoObject);

      try {
        await createPoll(
          poll.question,
          poll.description,
          poll.options.map(o => o.option),
          poll.deadline ? moment(poll.deadline) : null,
          poll.targetGroup,
          session
        );

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

      <TextButton text={t('btnCreate')} onClick={handleCreatePollClicked} />
    </>
  );
};
