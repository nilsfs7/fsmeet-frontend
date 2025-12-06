import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import { EventType } from '@/domain/enums/event-type';
import Navigation from '@/components/navigation';
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
import TextButton from '@/components/common/text-button';
import moment from 'moment';
import { getAttachments } from '@/infrastructure/clients/attachment.client';
import AdminPanel from './components/admin-panel';

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
    <div className="h-[calc(100dvh)] flex flex-col">
      {/* admin panel */}
      {isEventAdminOrMaintainer(event, session) && (
        <div className="mt-2 mx-2">
          <AdminPanel event={event} />
        </div>
      )}

      <div className="mt-2 mx-2 overflow-hidden">
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
