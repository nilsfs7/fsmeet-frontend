'use client';

import { updateEventState } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/dialog';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Event } from '@/domain/types/event';
import { EventState } from '@/domain/enums/event-state';
import { validateSession } from '@/functions/validate-session';
import { isPublicEventState } from '@/functions/event-state';
import Link from 'next/link';
import TextButton from '@/components/common/text-button';
import Label from '@/components/label';
import { useEffect, useState } from 'react';
import moment from 'moment';

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

  const handleUpdateStateClicked = async (state: EventState) => {
    if (!validateSession(session)) {
      router.push(loginRouteWithCallbackUrl);
      return;
    }

    if (event?.id) {
      try {
        await updateEventState(session, event?.id, state);

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
              {/* hidden */}
              {event.state !== EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">{t('dlgEventStateText2')}</p>
                  <p>{t('dlgEventStateText3')}</p>
                  <div className="mt-2 flex justify-between">
                    <Link href={`${routeEvents}/${event.id}/edit`}>
                      <TextButton text={t('dlgEventStateBtnEditEvent')} />
                    </Link>

                    <TextButton
                      text={t('dlgEventStateBtnSendToReview')}
                      onClick={() => {
                        handleUpdateStateClicked(EventState.WAITING_FOR_APPROVAL);
                      }}
                    />
                  </div>

                  {/* <p>why is a review necessary? todo</p> */}
                </>
              )}

              {/* hidden and waiting for approval */}
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
              {/* public and ongoing */}
              {event.state === EventState.APPROVED && moment(event.dateTo) > moment() && (
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

              {/* public and over */}
              {event.state === EventState.APPROVED && moment(event.dateTo) < moment() && (
                <>
                  <p className="mt-2">{t('dlgEventStateApprovedEventOverText')}</p>
                  <div className="mt-2 flex justify-between">
                    <TextButton
                      text={t('dlgEventStateBtnArchive')}
                      onClick={() => {
                        handleUpdateStateClicked(EventState.ARCHIVED_PUBLIC);
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      </Dialog>

      <ActionButton action={isPublicEventState(event.state) ? Action.SHOW : Action.HIDE} onClick={handleStateActionClicked} tooltip={t('adminPanelBtnManageEventStateToolTip')} />
    </>
  );
};
