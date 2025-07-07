'use client';

import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';

export const ActionButtonCopyUrl = () => {
  const t = useTranslations('/map');

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
