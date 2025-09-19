import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import { EventType } from '@/domain/enums/event-type';
import Navigation from '@/components/Navigation';
import { TabsMenu } from './components/tabs-menu';
import { auth } from '@/auth';
import { getComments, getEvent } from '@/infrastructure/clients/event.client';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { ActionButtonCopyEventUrl } from './components/action-button-copy-event-url';
import { ActionButtonStateAction } from './components/action-button-state-action';
import { TextButtonFeedback } from './components/text-button-feedback';
import { isEventAdminOrMaintainer } from '@/functions/is-event-admin-or-maintrainer';
import TextButton from '@/components/common/TextButton';
import moment from 'moment';
import { isArchivedEventState } from '@/functions/event-state';
import { getAttachments } from '@/infrastructure/clients/attachment.client';

export default async function EventDetails({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid');
  const session = await auth();

  const [event, competitions, sponsors, attachments, comments] = await Promise.all([
    getEvent(params.eventId, session),
    getCompetitions(params.eventId),
    getSponsors(params.eventId),
    getAttachments(params.eventId),
    getComments(params.eventId),
  ]);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      {/* admin panel */}
      <div className="mx-2 my-2">
        {isEventAdminOrMaintainer(event, session) && (
          <div className="flex justify-between rounded-lg border border-primary bg-warning p-2 gap-1">
            <div>{t('adminPanelTitle')}</div>
            <div className="flex flex-col sm:flex-row gap-1">
              {/* row 1 */}
              <div className="flex justify-end gap-1">
                {!isArchivedEventState(event.state) && (
                  <>
                    <Link href={`${routeEvents}/${params.eventId}/edit`}>
                      <ActionButton action={Action.EDIT} tooltip={t('adminPanelBtnEditEventToolTip')} />
                    </Link>

                    <Link href={`${routeEvents}/${params.eventId}/participants`}>
                      <ActionButton action={Action.MANAGE_USERS} tooltip={t('adminPanelBtnManageParticipantsToolTip')} />
                    </Link>

                    {(event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE) && (
                      <Link href={`${routeEvents}/${params.eventId}/comps`}>
                        <ActionButton action={Action.MANAGE_COMPETITIONS} tooltip={t('adminPanelBtnManageCompetitionsToolTip')} />
                      </Link>
                    )}
                  </>
                )}

                <ActionButtonStateAction event={event} />
              </div>

              {/* row 2 */}
              <div className="flex justify-end gap-1">
                {!isArchivedEventState(event.state) && (
                  <>
                    {/* todo: restrict im backend falls trotzdem accommodations eingestellt werden */}
                    {event.paymentMethodStripe.enabled && event.type !== EventType.COMPETITION_ONLINE && (
                      <Link href={`${routeEvents}/${params.eventId}/accommodations`}>
                        <ActionButton action={Action.MANAGE_ACCOMMODATIONS} tooltip={t('adminPanelBtnManageAccommodationsToolTip')} />
                      </Link>
                    )}

                    {/* todo: restrict im backend falls trotzdem offerings eingestellt werden */}
                    {event.paymentMethodStripe.enabled && (
                      <Link href={`${routeEvents}/${params.eventId}/offerings`}>
                        <ActionButton action={Action.MANAGE_OFFERINGS} tooltip={t('adminPanelBtnManageOfferingsToolTip')} />
                      </Link>
                    )}

                    <Link href={`${routeEvents}/${params.eventId}/sponsors`}>
                      <ActionButton action={Action.MANAGE_SPONSORS} tooltip={t('adminPanelBtnManageSponsorsToolTip')} />
                    </Link>

                    <Link href={`${routeEvents}/${params.eventId}/attachments`}>
                      <ActionButton action={Action.MANAGE_ATTACHMENTS} tooltip={t('adminPanelBtnManageAttachmentsToolTip')} />
                    </Link>

                    <Link href={`${routeEvents}/${params.eventId}/stats`}>
                      <ActionButton action={Action.STATISTICS} tooltip={t('adminPanelBtnViewStatisticsToolTip')} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-2 overflow-hidden">
        <TabsMenu event={event} competitions={competitions} sponsors={sponsors} attachments={attachments} comments={comments} />
      </div>

      <Navigation>
        <div className="flex justify-start gap-1">
          <Link href={routeEvents}>
            <ActionButton action={Action.BACK} />
          </Link>
        </div>

        <div className="flex justify-end gap-1">
          <ActionButtonCopyEventUrl alias={event.alias} />

          {moment(event?.dateTo).unix() > moment().unix() && (
            <Link href={`${routeEvents}/${event.id}/registration`}>
              <TextButton text={t('btnRegistration')} />
            </Link>
          )}

          <TextButtonFeedback event={event} />
        </div>
      </Navigation>
    </div>
  );
}
