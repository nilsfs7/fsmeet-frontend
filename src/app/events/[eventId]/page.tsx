import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { TabsMenu } from './components/tabs-menu';
import { auth } from '@/auth';
import { getComments, getEvent } from '@/infrastructure/clients/event.client';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { ActionButtonCopyEventUrl } from './components/action-button-copy-event-url';
import { EventFeedbackButton } from './components/event-feedback-button';
import { isEventAdminOrMaintainer } from '@/functions/is-event-admin-or-maintrainer';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import moment from 'moment';
import { getAttachments } from '@/infrastructure/clients/attachment.client';
import AdminPanel from './components/admin-panel';
import { cn } from '@/lib/utils';

const eventDetailsContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventDetails(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
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
    <div className="flex min-h-0 flex-1 flex-col">
      {isEventAdminOrMaintainer(event, session) && (
        <div className={cn('mt-2', eventDetailsContentClass)}>
          <AdminPanel event={event} />
        </div>
      )}

      <div className={cn('mt-2 flex-1 overflow-hidden', eventDetailsContentClass)}>
        <TabsMenu event={event} competitions={competitions} sponsors={sponsors} attachments={attachments} comments={comments} />
      </div>

      <Navigation>
        <div className="flex justify-start gap-1">
          <Link href={routeEvents}>
            <ActionButton action={Action.BACK} />
          </Link>
        </div>

        <div className="flex min-w-0 flex-wrap justify-end gap-1">
          <ActionButtonCopyEventUrl alias={event.alias} />

          {moment(event?.dateTo).unix() > moment().unix() && (
            <Button asChild variant="action" className={ctaActionButtonClassName}>
              <Link href={`${routeEvents}/${event.id}/registration`}>{t('btnRegistration')}</Link>
            </Button>
          )}

          <EventFeedbackButton event={event} />
        </div>
      </Navigation>
    </div>
  );
}
