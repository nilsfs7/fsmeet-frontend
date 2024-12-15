'use client';

import TextButton from '@/components/common/TextButton';
import { useSession } from 'next-auth/react';
import { createPoll } from '@/infrastructure/clients/poll.client';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';

export const TextButtonCreatePoll = () => {
  const t = useTranslations('/voice/manage');

  const { data: session } = useSession();

  async function handleCreatePollClicked() {
    try {
      await createPoll('...', ['.', ',', '&'], session);

      toast.success('Poll created.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  return (
    <>
      <Toaster richColors />

      <TextButton text={t('btnCreatePoll')} onClick={handleCreatePollClicked} />
    </>
  );
};
