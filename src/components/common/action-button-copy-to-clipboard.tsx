'use client';

import { Toaster, toast } from 'sonner';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';

interface IActionButtonCopyToClipboard {
  value: string;
  toastMessage: string;
  toolTipMessage?: string;
  action?: Action;
}

export const ActionButtonCopyToClipboard = ({ value, toastMessage, toolTipMessage = undefined, action = Action.SHARE }: IActionButtonCopyToClipboard) => {
  const handleCopyClicked = async () => {
    copyToClipboard(value);
    toast.info(toastMessage);
  };

  return (
    <div>
      <Toaster richColors />
      <ActionButton action={action} onClick={handleCopyClicked} tooltip={toolTipMessage} />
    </div>
  );
};
