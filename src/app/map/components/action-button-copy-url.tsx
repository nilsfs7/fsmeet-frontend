'use client';

import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';
import { Toaster, toast } from 'sonner';

export const ActionButtonCopyUrl = () => {
  const handleCopyClicked = async () => {
    copyToClipboard(window.location.toString());
    toast.info('Map URL copied to clipboard.');
  };

  return (
    <>
      <Toaster richColors />
      <ActionButton action={Action.SHARE} onClick={handleCopyClicked} />
    </>
  );
};
