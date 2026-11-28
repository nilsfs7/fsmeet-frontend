import { redirect } from 'next/navigation';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { getEvent, getEventFeedbacks } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import { isEventAdminOrMaintainer } from '@/functions/is-event-admin-or-maintrainer';
import EventFeedbackList from './components/event-feedback-list';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventFeedbackListPage(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/feedback/list'), auth()]);

  const event = await getEvent(params.eventId, session);

  // Only the event admin, its maintainers and the platform admin may read feedback (the backend enforces this as well).
  if (session?.user?.username !== AdministrativeUser.ADMIN && !isEventAdminOrMaintainer(event, session)) {
    redirect(`${routeEvents}/${params.eventId}`);
  }

  const feedbacks = await getEventFeedbacks(params.eventId, session);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} description={event.name} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto pb-6 scrollbar-none', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto scrollbar-none">
            <EventFeedbackList feedbacks={feedbacks} />
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
