'use client';

import { Toaster, toast } from 'sonner';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';

interface IActionButtonCopyEventUrl {
  alias?: string;
}

export const ActionButtonCopyEventUrl = ({ alias }: IActionButtonCopyEventUrl) => {
  const handleCopyClicked = async () => {
    let eventUrl: string;

    if (alias) {
      eventUrl = `${window.location.host.toString()}/e/${alias}`;
    } else {
      eventUrl = window.location.toString();
    }

    copyToClipboard(eventUrl);
    toast.info('Event URL copied to clipboard.');
  };

  return (
    <>
      <Toaster richColors />
      <ActionButton action={Action.COPY} onClick={handleCopyClicked} />
    </>
  );
};
