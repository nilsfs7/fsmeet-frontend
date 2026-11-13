'use client';

import { toast } from 'sonner';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { copyToClipboard } from '@/functions/copy-to-clipboard';
import { routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

interface IActionButtonCopyCompUrl {
  eventId?: string;
  eventAlias?: string | null;
  compId?: string;
  compAlias?: string | null;
}

/** Same behavior as the event details copy button: prefer the short alias URL, else the id URL. */
export const ActionButtonCopyCompUrl = ({ eventId, eventAlias, compId, compAlias }: IActionButtonCopyCompUrl) => {
  const t = useTranslations('/events/eventid/comps/compid');

  const handleCopyClicked = async () => {
    let compUrl: string;

    if (eventAlias && compAlias) {
      compUrl = `${window.location.origin}/e/${eventAlias}/c/${compAlias}`;
    } else if (eventId && compId) {
      compUrl = `${window.location.origin}${routeEvents}/${eventId}/comps/${compId}`;
    } else {
      compUrl = window.location.toString();
    }

    copyToClipboard(compUrl);
    toast.info(t('btnCopyUrlToast'));
  };

  // the page's <Toaster /> is rendered by ActionButtonDownloadResults next to this button (a second one would duplicate toasts)
  return <ActionButton action={Action.SHARE} onClick={handleCopyClicked} tooltip={t('btnCopyUrlToolTip')} />;
};
