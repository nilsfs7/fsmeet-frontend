import { auth } from '@/auth';
import NavigateBackButton from '@/components/NavigateBackButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { getTranslations } from 'next-intl/server';
import { RegistrationsList } from './components/registrations-list';
import { getEvent, getEventRegistrations } from '@/infrastructure/clients/event.client';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import { getOfferings } from '@/infrastructure/clients/offering.client';
import { ActionButtonDownloadList } from './components/action-button-download-list';
import { getCompetitions } from '@/infrastructure/clients/competition.client';

export default async function EventParticipants({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid/participants');
  const session = await auth();

  const event = await getEvent(params.eventId);
  const competitions = await getCompetitions(params.eventId);
  const registrations = await getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session);
  const accommodations = await getAccommodations(params.eventId);
  const offerings = await getOfferings(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <RegistrationsList
        eventId={params.eventId}
        registrations={registrations}
        accommodations={accommodations}
        offerings={offerings}
        currency={event.currency}
        paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
      />

      <Navigation>
        <NavigateBackButton />

        <ActionButtonDownloadList event={event} competitions={competitions} registrations={registrations} offerings={offerings} accommodations={accommodations} />
      </Navigation>
    </div>
  );
}
