'use client';

import { updateEventState } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/Dialog';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Event } from '@/types/event';
import { EventState } from '@/domain/enums/event-state';
import { validateSession } from '@/functions/validate-session';
import { isPublicEventState } from '@/functions/is-public-event-state';
import Link from 'next/link';
import TextButton from '@/components/common/TextButton';
import Label from '@/components/Label';
import { useEffect, useState } from 'react';

interface IActionButtonStateAction {
  event: Event;
}

export const ActionButtonStateAction = ({ event }: IActionButtonStateAction) => {
  const t = useTranslations('/events/eventid');

  const { data: session } = useSession();
  const router = useRouter();

  const [loginRouteWithCallbackUrl, setLoginRouteWithCallbackUrl] = useState<string>('');

  const handleCancelDialogClicked = async () => {
    let url = `${routeEvents}/${event.id}`;
    router.replace(url);
  };

  const handleStateActionClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    router.replace(`${routeEvents}/${event.id}?state=1`);
  };

  const handleSendToReviewClicked = async () => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (event?.id) {
      try {
        await updateEventState(session, event?.id, EventState.WAITING_FOR_APPROVAL);

        // toast.success(`todo`);
        router.refresh();
      } catch (error: any) {
        // toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    setLoginRouteWithCallbackUrl(`${routeLogin}?callbackUrl=${window.location.origin}${routeEvents}%2F${event.id}`);
  }, []);

  return (
    <>
      <Dialog title={t(`dlgEventStateTitle`)} queryParam="state" onCancel={handleCancelDialogClicked}>
        <>
          <div className="flex gap-2 items-center">
            <div>{`${t('dlgEventStateText1')}:`}</div>
            <Label text={event?.state} />
          </div>

          {!isPublicEventState(event.state) && (
            <>
              {event.state !== EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">{t('dlgEventStateText2')}</p>
                  <p>{t('dlgEventStateText3')}</p>
                  <div className="mt-2 flex justify-between">
                    <Link href={`${routeEvents}/${event.id}/edit`}>
                      <TextButton text={t('dlgEventStateBtnEditEvent')} />
                    </Link>

                    <TextButton text={t('dlgEventStateBtnSendToReview')} onClick={handleSendToReviewClicked} />
                  </div>

                  {/* <p>why is a review necessary? todo</p> */}
                </>
              )}
              {event.state === EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">{t('dlgEventStateWaitingForApprovalText1')}</p>
                  <p>{t('dlgEventStateWaitingForApprovalText2')}</p>
                  <div className="mt-2 flex justify-between">
                    <Link href={`${routeEvents}/${event.id}/edit`}>
                      <TextButton text={t('dlgEventStateBtnEditEvent')} />
                    </Link>
                  </div>

                  {/* <p>why is a review necessary? todo</p> */}
                </>
              )}
            </>
          )}
          {isPublicEventState(event.state) && (
            <>
              <p className="mt-2">{t('dlgEventStateApprovedText1')}</p>
              <p>{t('dlgEventStateApprovedText2')}</p>
              <div className="mt-2 flex justify-between">
                <Link href={`${routeEvents}/${event.id}/edit`}>
                  <TextButton text={t('dlgEventStateBtnEditEvent')} />
                </Link>
              </div>
            </>
          )}
        </>
      </Dialog>

      <ActionButton action={isPublicEventState(event.state) ? Action.SHOW : Action.HIDE} onClick={handleStateActionClicked} />
    </>
  );
};
