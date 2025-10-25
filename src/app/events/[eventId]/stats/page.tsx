import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import Separator from '@/components/seperator';
import { getTranslations } from 'next-intl/server';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { auth } from '@/auth';
import { ChartPie } from '@/components/charts/chart-pie';
import { Gender } from '@/domain/enums/gender';
import { ChartParticipantAge } from './chart-participant-age';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';

export default async function Statistics(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
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

  const countryCount = new Map<string, number>([]);
  registeredParticipants.forEach(p => {
    if (p.user.country) {
      if (countryCount.has(p.user.country)) {
        const curVal = countryCount.get(p.user.country);
        if (curVal) countryCount.set(p.user.country, curVal + 1);
      } else {
        countryCount.set(p.user.country, 1);
      }
    }
  });

  let countryCountSorted = new Map<string, number>([...countryCount.entries()].sort((a, b) => b[1] - a[1]));

  if (countryCountSorted.size > 5) {
    let countryCountSortedReduced = new Map<string, number>();
    let otherCount = 0;
    let index = 0;
    for (const [key, value] of countryCountSorted) {
      if (index < 5) {
        countryCountSortedReduced.set(key, value);
      } else {
        otherCount += value;
      }
      index++;
    }

    countryCountSortedReduced.set('other', otherCount);
    countryCountSorted = countryCountSortedReduced;
  }

  const countryLabels = Array.from(countryCountSorted.keys()).map(countryCode => {
    return getCountryNameByCode(countryCode) || 'other';
  });

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'grid mx-2 gap-2 p-2 rounded-lg  border border-primary bg-secondary-light  text-sm overflow-y-auto'}>
        {/* Attendees */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <ChartPie
            key={'amount-attendees'}
            data={[registeredParticipants.length, registeredVisitors.length]}
            labels={['Participants', 'Visitors']}
            colors={['--chart-1', '--chart-2']}
            title={'Amount of Attendees'}
          />
        </div>

        <Separator />

        {/* Participants */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <ChartPie
            key={'gender-participants'}
            data={[maleParticipants.length, femaleParticipants.length]}
            labels={['Male', 'Female']}
            colors={['--chart-1', '--chart-5']}
            title={'Participants by Gender'}
          />

          <ChartPie key={'country-participants'} data={Array.from(countryCountSorted.values())} labels={countryLabels} title={'Participants by Country'} />

          <ChartParticipantAge key={'age-participants'} data={particpantAges} labels={['<16', '16-20', '21-25', '26-30', '>30']} title={'Participants by Age'} />
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
