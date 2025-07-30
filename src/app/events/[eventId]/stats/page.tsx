import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import Separator from '@/components/Seperator';
import { getTranslations } from 'next-intl/server';
import { getEventRegistrations } from '../../../../infrastructure/clients/event.client';
import { EventRegistrationType } from '../../../../domain/types/event-registration-type';
import { auth } from '../../../../auth';
import { ChartPie } from './chart-pie';
import { Gender } from '../../../../domain/enums/gender';

export default async function Statistics({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/eventid/stats');
  const session = await auth();

  const registeredParticipants = await getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session);
  const registeredVisitors = await getEventRegistrations(params.eventId, EventRegistrationType.VISITOR, session);

  const maleParticipants = registeredParticipants.filter(p => {
    if (p.user.gender === Gender.MALE) {
      return p;
    }
  });
  const femaleParticipants = registeredParticipants.filter(p => {
    if (p.user.gender === Gender.FEMALE) {
      return p;
    }
  });

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <ChartPie data={[maleParticipants.length, femaleParticipants.length]} labels={['Male', 'Female']} colors={['--chart-1', '--chart-5']} title={'Participant Gender Share'} />
          <ChartPie data={[registeredParticipants.length, registeredVisitors.length]} labels={['Participants', 'Visitors']} colors={['--chart-1', '--chart-2']} title={'Participant / Visitor Share'} />
        </div>
      </div>

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
