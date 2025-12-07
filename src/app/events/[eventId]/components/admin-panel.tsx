'server component';

import ActionButton from '../../../../components/common/action-button';
import { isArchivedEventState } from '../../../../functions/event-state';
import Link from 'next/link';
import { Action } from '../../../../domain/enums/action';
import { routeEvents } from '../../../../domain/constants/routes';
import { EventType } from '../../../../domain/enums/event-type';
import { ActionButtonStateAction } from './action-button-state-action';
import { Event } from '@/domain/types/event';
import { getTranslations } from 'next-intl/server';

interface IAttachmentCardProps {
  event: Event;
}

const AdminPanel = async ({ event }: IAttachmentCardProps) => {
  const t = await getTranslations('/events/eventid');

  return (
    <div className="flex justify-between rounded-lg border border-primary bg-warning p-2 gap-1">
      <div>{t('adminPanelTitle')}</div>
      <div className="flex flex-col sm:flex-row gap-1">
        {/* row 1 */}
        <div className="flex justify-end gap-1">
          {!isArchivedEventState(event.state) && (
            <>
              <Link href={`${routeEvents}/${event.id}/edit`}>
                <ActionButton action={Action.EDIT} tooltip={t('adminPanelBtnEditEventToolTip')} />
              </Link>

              <Link href={`${routeEvents}/${event.id}/participants`}>
                <ActionButton action={Action.MANAGE_USERS} tooltip={t('adminPanelBtnManageParticipantsToolTip')} />
              </Link>

              {(event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE) && (
                <Link href={`${routeEvents}/${event.id}/comps`}>
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
                <Link href={`${routeEvents}/${event.id}/accommodations`}>
                  <ActionButton action={Action.MANAGE_ACCOMMODATIONS} tooltip={t('adminPanelBtnManageAccommodationsToolTip')} />
                </Link>
              )}

              {/* todo: restrict im backend falls trotzdem offerings eingestellt werden */}
              {event.paymentMethodStripe.enabled && (
                <Link href={`${routeEvents}/${event.id}/offerings`}>
                  <ActionButton action={Action.MANAGE_OFFERINGS} tooltip={t('adminPanelBtnManageOfferingsToolTip')} />
                </Link>
              )}

              <Link href={`${routeEvents}/${event.id}/sponsors`}>
                <ActionButton action={Action.MANAGE_SPONSORS} tooltip={t('adminPanelBtnManageSponsorsToolTip')} />
              </Link>

              <Link href={`${routeEvents}/${event.id}/attachments`}>
                <ActionButton action={Action.MANAGE_ATTACHMENTS} tooltip={t('adminPanelBtnManageAttachmentsToolTip')} />
              </Link>

              <Link href={`${routeEvents}/${event.id}/stats`}>
                <ActionButton action={Action.STATISTICS} tooltip={t('adminPanelBtnViewStatisticsToolTip')} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
