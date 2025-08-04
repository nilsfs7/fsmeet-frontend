'use client';

import { Toaster, toast } from 'sonner';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';
import { useTranslations } from 'next-intl';

interface IActionButtonCopyEventUrl {
  alias?: string;
}

export const ActionButtonCopyEventUrl = ({ alias }: IActionButtonCopyEventUrl) => {
  const t = useTranslations('/events/eventid');

  const handleCopyClicked = async () => {
    let eventUrl: string;

    if (alias) {
      eventUrl = `${window.location.origin}/e/${alias}`;
    } else {
      eventUrl = window.location.toString();
    }

    copyToClipboard(eventUrl);
    toast.info(t('btnCopyUrlToast'));
  };

  return (
    <>
      <Toaster richColors />
      <ActionButton action={Action.SHARE} onClick={handleCopyClicked} tooltip={t('btnCopyUrlToolTip')} />
    </>
  );
};
