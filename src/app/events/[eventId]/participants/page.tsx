import { auth } from '@/auth';
import NavigateBackButton from '@/components/NavigateBackButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { getTranslations } from 'next-intl/server';
import { RegistrationsList } from './components/registrations-list';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import { EventRegistrationType } from '@/types/event-registration-type';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import { getOfferings } from '@/infrastructure/clients/offering.client';

export default async function EventParticipants({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid/participants');
  const session = await auth();

  const registrations = await getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session);
  const accommodations = await getAccommodations(params.eventId);
  const offerings = await getOfferings(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <RegistrationsList eventId={params.eventId} registrations={registrations} accommodations={accommodations} offerings={offerings} />

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
