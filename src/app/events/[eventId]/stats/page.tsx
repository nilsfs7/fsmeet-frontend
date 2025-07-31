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
import { ChartPie } from '../../../../components/charts/chart-pie';
import { Gender } from '../../../../domain/enums/gender';
import { ChartParticipantAge } from './chart-participant-age';

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

  const particpantAges = [0, 0, 0, 0, 0];
  registeredParticipants.forEach(p => {
    if (p.user.age) {
      switch (true) {
        case p.user.age < 16:
          particpantAges[0] += 1;
          break;
        case p.user.age >= 16 && p.user.age <= 20:
          particpantAges[1] += 1;
          break;
        case p.user.age >= 21 && p.user.age <= 25:
          particpantAges[2] += 1;
          break;
        case p.user.age >= 26 && p.user.age <= 30:
          particpantAges[3] += 1;
          break;
        case p.user.age > 30:
          particpantAges[4] += 1;
          break;
      }
    }
  });

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <ChartPie data={[maleParticipants.length, femaleParticipants.length]} labels={['Male', 'Female']} colors={['--chart-1', '--chart-5']} title={'Participants by Gender'} />
          <ChartPie data={[registeredParticipants.length, registeredVisitors.length]} labels={['Participants', 'Visitors']} colors={['--chart-1', '--chart-2']} title={'Amount of Attendees'} />
          <ChartParticipantAge data={particpantAges} labels={['<16', '16-20', '21-25', '26-30', '>30']} title={'Participant Age'} />
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
