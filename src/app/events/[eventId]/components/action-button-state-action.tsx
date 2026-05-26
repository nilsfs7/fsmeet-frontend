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
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import Label from '@/components/label';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'sonner';
import { Competition } from '@/domain/types/competition';
import { isCompetition } from '@/functions/is-competition';

interface IActionButtonStateAction {
  event: Event;
  competitions: Competition[];
}

const eventStateDialogCtaRowClassName = 'mt-2 flex flex-wrap items-center justify-between gap-3 p-1.5 sm:gap-4';

export const ActionButtonStateAction = ({ event, competitions }: IActionButtonStateAction) => {
  const t = useTranslations('/events/eventid');

  const { data: session } = useSession();
  const router = useRouter();

  const [loginRouteWithCallbackUrl, setLoginRouteWithCallbackUrl] = useState<string>('');

  const missingCompetition = isCompetition(event.type) && competitions.length === 0;

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
        toast.error(error.message);
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
          <div className="flex items-center gap-2 pb-1">
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

                  {missingCompetition && <p className="mt-2 rounded-md border border-warning/30 bg-warning/10 p-2 text-sm text-warning-foreground">{t('dlgEventStateNoCompetitionsHint')}</p>}

                  <div className={eventStateDialogCtaRowClassName}>
                    <Button asChild variant="action" className={ctaActionButtonClassName}>
                      <Link href={`${routeEvents}/${event.id}/edit`}>{t('dlgEventStateBtnEditEvent')}</Link>
                    </Button>

                    {missingCompetition && (
                      <Button asChild variant="action" className={ctaActionButtonClassName}>
                        <Link href={`${routeEvents}/${event.id}/comps`}>{t('dlgEventStateBtnManageCompetitions')}</Link>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="action"
                      className={ctaActionButtonClassName}
                      disabled={missingCompetition}
                      onClick={() => {
                        handleUpdateStateClicked(EventState.WAITING_FOR_APPROVAL);
                      }}
                    >
                      {t('dlgEventStateBtnSendToReview')}
                    </Button>
                  </div>
                </>
              )}

              {/* hidden and waiting for approval */}
              {event.state === EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">{t('dlgEventStateWaitingForApprovalText1')}</p>
                  <p>{t('dlgEventStateWaitingForApprovalText2')}</p>
                  <div className={eventStateDialogCtaRowClassName}>
                    <Button asChild variant="action" className={ctaActionButtonClassName}>
                      <Link href={`${routeEvents}/${event.id}/edit`}>{t('dlgEventStateBtnEditEvent')}</Link>
                    </Button>
                  </div>
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
                  <div className={eventStateDialogCtaRowClassName}>
                    <Button asChild variant="action" className={ctaActionButtonClassName}>
                      <Link href={`${routeEvents}/${event.id}/edit`}>{t('dlgEventStateBtnEditEvent')}</Link>
                    </Button>
                  </div>
                </>
              )}

              {/* public and over */}
              {event.state === EventState.APPROVED && moment(event.dateTo) < moment() && (
                <>
                  <p className="mt-2">{t('dlgEventStateApprovedEventOverText')}</p>
                  <div className={eventStateDialogCtaRowClassName}>
                    <Button
                      type="button"
                      variant="action"
                      className={ctaActionButtonClassName}
                      onClick={() => {
                        handleUpdateStateClicked(EventState.ARCHIVED_PUBLIC);
                      }}
                    >
                      {t('dlgEventStateBtnArchive')}
                    </Button>
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
