import { auth } from '@/auth';
import NavigateBackButton from '@/components/NavigateBackButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { getTranslations } from 'next-intl/server';
import { ParticipantsList } from './components/participants-list';
import { getEvent } from '@/infrastructure/clients/event.client';

export default async function EventParticipants({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid/participants');
  const session = await auth();

  const event = await getEvent(params.eventId, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <ParticipantsList event={event} />

      <Navigation>
        <NavigateBackButton />
      </Navigation>
    </div>
  );
}
