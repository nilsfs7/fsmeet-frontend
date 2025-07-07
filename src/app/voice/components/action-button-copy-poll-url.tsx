'use client';

import { Toaster, toast } from 'sonner';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';
import { useTranslations } from 'next-intl';

export const ActionButtonCopyPollUrl = () => {
  const t = useTranslations('/voice');

  const handleCopyClicked = async () => {
    copyToClipboard(window.location.toString());
    toast.info(t('btnCopyUrlToast'));
  };

  return (
    <>
      <Toaster richColors />
      <ActionButton action={Action.SHARE} onClick={handleCopyClicked} tooltip={t('btnCopyUrlToolTip')} />
    </>
  );
};
