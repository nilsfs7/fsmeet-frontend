import { auth } from '@/auth';
import NavigateBackButton from '@/components/navigate-back-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { RegistrationsList } from './components/registrations-list';
import { getEvent, getEventRegistrations } from '@/infrastructure/clients/event.client';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import { getOfferings } from '@/infrastructure/clients/offering.client';
import { ActionButtonDownloadList } from './components/action-button-download-list';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventAttendees(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/attendees');
  const session = await auth();

  const event = await getEvent(params.eventId, session);
  const competitions = await getCompetitions(params.eventId);
  const registrations = await getEventRegistrations(params.eventId, null, session);
  const accommodations = await getAccommodations(params.eventId);
  const offerings = await getOfferings(params.eventId);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex-1 min-h-0 flex flex-col overflow-hidden', constrainedContentClass)}>
        <RegistrationsList
          eventId={params.eventId}
          registrations={registrations}
          accommodations={accommodations}
          offerings={offerings}
          currency={event.currency}
          paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
        />
      </div>

      <Navigation>
        <NavigateBackButton />

        <ActionButtonDownloadList event={event} competitions={competitions} registrations={registrations} offerings={offerings} accommodations={accommodations} />
      </Navigation>
    </div>
  );
}
