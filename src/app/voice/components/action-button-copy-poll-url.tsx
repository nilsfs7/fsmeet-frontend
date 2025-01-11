'use client';

import { Toaster, toast } from 'sonner';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';

export const ActionButtonCopyPollUrl = () => {
  const handleCopyClicked = async () => {
    copyToClipboard(window.location.toString());
    toast.info('Poll URL copied to clipboard.');
  };

  return (
    <>
      <Toaster richColors />
      <ActionButton action={Action.SHARE} onClick={handleCopyClicked} />
    </>
  );
};
