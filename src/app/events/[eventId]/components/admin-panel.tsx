import ActionButton from '../../../../components/common/action-button';
import { isArchivedEventState } from '../../../../functions/event-state';
import { Action } from '../../../../domain/enums/action';
import { routeEvents } from '../../../../domain/constants/routes';
import { EventType } from '../../../../domain/enums/event-type';
import { ActionButtonStateAction } from './action-button-state-action';
import { Event } from '@/domain/types/event';
import { Competition } from '@/domain/types/competition';
import { getTranslations } from 'next-intl/server';
import { LicenseType } from '@/domain/enums/license-type';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Label from '@/components/label';
import { isCompetition } from '@/functions/is-competition';

interface IAttachmentCardProps {
  event: Event;
  competitions: Competition[];
}

const AdminPanel = async ({ event, competitions }: IAttachmentCardProps) => {
  const t = await getTranslations('/events/eventid');

  return (
    <div className={cn('flex justify-between gap-2 rounded-xl border border-primary/25 bg-primary/5 p-2.5 shadow-sm backdrop-blur-sm', 'dark:border-primary/35 dark:bg-primary/10 dark:shadow-xs')}>
      <div
        className={cn(
          'flex min-w-0 flex-1 gap-2',
          'flex-col items-start sm:flex-row sm:flex-wrap sm:items-center'
        )}
      >
        <div className="flex shrink-0 items-center text-sm font-semibold text-primary">{t('adminPanelTitle')}</div>
        {!isArchivedEventState(event.state) &&
          (event.licenseType === LicenseType.PRO ? (
            <Label text={'Pro'} />
          ) : (
            <Button variant="action" size="sm" className="h-8 shrink-0 px-3 text-xs sm:text-sm" asChild>
              <Link href={`${routeEvents}/${event.id}/pro`} title={t('adminPanelBtnUpgradeProToolTip')}>
                {t('adminPanelBtnUpgradePro')}
              </Link>
            </Button>
          ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-1">
        {/* row 1 */}
        <div className="flex justify-end gap-1">
          {!isArchivedEventState(event.state) && (
            <>
              <ActionButton href={`${routeEvents}/${event.id}/edit`} action={Action.EDIT} tooltip={t('adminPanelBtnEditEventToolTip')} />

              <ActionButton href={`${routeEvents}/${event.id}/attendees`} action={Action.MANAGE_USERS} tooltip={t('adminPanelBtnManageAttendeesToolTip')} />

              {(isCompetition(event.type)) && (
                <ActionButton href={`${routeEvents}/${event.id}/comps`} action={Action.MANAGE_COMPETITIONS} tooltip={t('adminPanelBtnManageCompetitionsToolTip')} />
              )}
            </>
          )}

          <ActionButtonStateAction event={event} competitions={competitions} />
        </div>

        {/* row 2 */}
        <div className="flex justify-end gap-1">
          {!isArchivedEventState(event.state) && (
            <>
              {/* todo: restrict im backend falls trotzdem accommodations eingestellt werden */}
              {event.paymentMethodStripe.enabled && event.type !== EventType.COMPETITION_ONLINE && (
                <ActionButton href={`${routeEvents}/${event.id}/accommodations`} action={Action.MANAGE_ACCOMMODATIONS} tooltip={t('adminPanelBtnManageAccommodationsToolTip')} />
              )}

              {/* todo: restrict im backend falls trotzdem offerings eingestellt werden */}
              {event.paymentMethodStripe.enabled && <ActionButton href={`${routeEvents}/${event.id}/offerings`} action={Action.MANAGE_OFFERINGS} tooltip={t('adminPanelBtnManageOfferingsToolTip')} />}

              <ActionButton href={`${routeEvents}/${event.id}/sponsors`} action={Action.MANAGE_SPONSORS} tooltip={t('adminPanelBtnManageSponsorsToolTip')} />

              <ActionButton href={`${routeEvents}/${event.id}/attachments`} action={Action.MANAGE_ATTACHMENTS} tooltip={t('adminPanelBtnManageAttachmentsToolTip')} />

              <ActionButton href={`${routeEvents}/${event.id}/stats`} action={Action.STATISTICS} tooltip={t('adminPanelBtnViewStatisticsToolTip')} />
            </>
          )}
        </div>

        {/* row 3 */}
        <div className="flex justify-end gap-1">
          {!isArchivedEventState(event.state) && (
            <>
              <ActionButton
                href={event.licenseType === LicenseType.PRO ? `${routeEvents}/${event.id}/arena-screen` : undefined}
                disabled={event.licenseType !== LicenseType.PRO}
                action={Action.MANAGE_ARENA_SCREEN}
                tooltip={t('adminPanelBtnManageArenaScreenToolTip')}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
