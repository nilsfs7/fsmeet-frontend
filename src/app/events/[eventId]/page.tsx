import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import { EventType } from '@/domain/enums/event-type';
import Navigation from '@/components/Navigation';
import { TabsMenu } from './components/tabs-menu';
import { auth } from '@/auth';
import { getComments, getEvent } from '@/infrastructure/clients/event.client';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { ActionButtonCopyEventUrl } from './components/action-button-copy-event-url';
import { TextButtonRegister } from './components/text-button-register';
import { ActionButtonStateAction } from './components/action-button-state-action';
import { TextButtonFeedback } from './components/text-button-feedback';
import { isEventAdminOrMaintainer } from '@/functions/is-event-admin-or-maintrainer';
import TextButton from '@/components/common/TextButton';

export default async function EventDetails({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid');
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const sponsors = await getSponsors(params.eventId);
  const comments = await getComments(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      {/* admin panel */}
      <div className="mx-2 my-2">
        {isEventAdminOrMaintainer(event, session) && (
          <div className="flex justify-between rounded-lg border border-primary bg-warning p-2 gap-1">
            <div className="flex items-center">{t('adminPanelTitle')}</div>
            <div className="flex gap-1">
              <Link href={`${routeEvents}/${params.eventId}/edit`}>
                <ActionButton action={Action.EDIT} />
              </Link>

              <Link href={`${routeEvents}/${params.eventId}/participants`}>
                <ActionButton action={Action.MANAGE_USERS} />
              </Link>

              {(event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE) && (
                <Link href={`${routeEvents}/${params.eventId}/comps`}>
                  <ActionButton action={Action.MANAGE_COMPETITIONS} />
                </Link>
              )}

              {/* todo: restrict im backend falls trotzdem accommodations eingestellt werden */}
              {event.paymentMethodStripe.enabled && event.type !== EventType.COMPETITION_ONLINE && (
                <Link href={`${routeEvents}/${params.eventId}/accommodations`}>
                  <ActionButton action={Action.MANAGE_ACCOMMODATIONS} />
                </Link>
              )}

              {/* todo: restrict im backend falls trotzdem offerings eingestellt werden */}
              {event.paymentMethodStripe.enabled && (
                <Link href={`${routeEvents}/${params.eventId}/offerings`}>
                  <ActionButton action={Action.MANAGE_OFFERINGS} />
                </Link>
              )}

              <Link href={`${routeEvents}/${params.eventId}/sponsors`}>
                <ActionButton action={Action.MANAGE_SPONSORS} />
              </Link>

              {<ActionButtonStateAction event={event} />}
            </div>
          </div>
        )}
      </div>

      <div className="mx-2 overflow-hidden">
        <TabsMenu event={event} sponsors={sponsors} comments={comments} />
      </div>

      <Navigation>
        <div className="flex justify-start gap-1">
          <Link href={routeEvents}>
            <ActionButton action={Action.BACK} />
          </Link>
        </div>

        <div className="flex justify-end gap-1">
          <ActionButtonCopyEventUrl alias={event.alias} />

          {event.paymentMethodStripe.enabled === true && (
            <Link href={`${routeEvents}/${event.id}/registration`}>
              <TextButton text={t('btnRegistration')} />
            </Link>
          )}

          {event.paymentMethodStripe.enabled === false && <TextButtonRegister event={event} />}
          <TextButtonFeedback event={event} />
        </div>
      </Navigation>
    </div>
  );
}
