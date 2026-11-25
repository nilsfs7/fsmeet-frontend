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
import { ActionButtonAddRegistration } from './components/action-button-add-registration';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { getUsers } from '@/infrastructure/clients/user.client';
import { UserType } from '@/domain/enums/user-type';
import { compareByIndex } from '@/functions/compare-by-index';
import { cn } from '@/lib/utils';
import { AdministrativeUser } from '@/domain/enums/administrative-user';

const constrainedContentClass = 'mx-auto w-full max-w-4xl min-w-0 px-4 sm:px-6';

export default async function EventAttendees(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/attendees'), auth()]);

  const [event, fetchedCompetitions, registrations, fetchedAccommodations, fetchedOfferings, users] = await Promise.all([
    getEvent(params.eventId, session),
    getCompetitions(params.eventId, null),
    getEventRegistrations(params.eventId, null, session),
    getAccommodations(params.eventId),
    getOfferings(params.eventId),
    getUsers(),
  ]);
  const competitions = [...fetchedCompetitions].sort(compareByIndex);
  const accommodations = [...fetchedAccommodations].sort(compareByIndex);
  const offerings = [...fetchedOfferings].sort(compareByIndex);
  const registeredUsernames = new Set(registrations.map(registration => registration.user.username));
  const addableUsers = users.filter(user => user.type !== UserType.ADMINISTRATIVE && !registeredUsernames.has(user.username));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} description={event.name} />
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

        <div className="flex justify-end gap-1">
          {session?.user?.username === AdministrativeUser.ADMIN && <ActionButtonAddRegistration eventId={params.eventId} eventType={event.type} users={addableUsers} />}
          <ActionButtonDownloadList event={event} competitions={competitions} registrations={registrations} offerings={offerings} accommodations={accommodations} />
        </div>
      </Navigation>
    </div>
  );
}
