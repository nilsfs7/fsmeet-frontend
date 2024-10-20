import Navigation from '@/components/Navigation';
import { getEventsOngoing, getEventsRecent, getEventsUpcoming } from '@/infrastructure/clients/event.client';
import Link from 'next/link';
import { Event } from '@/types/event';
import { Header } from '@/components/Header';
import { imgAbout, imgCommunity, imgFreestyler, imgProfileSettings, imgWorld } from '@/domain/constants/images';
import TextButton from '@/components/common/TextButton';
import { routeAbout, routeAdminOverview, routeEvents, routeMap, routeUsers } from '@/domain/constants/routes';
import { TechnicalUser } from '@/domain/enums/technical-user';
import { auth } from '@/auth';
import { EventsCarousel } from './components/events-carousel';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('/');
  const session = await auth();

  let upcomingEvents: Event[] = await getEventsUpcoming(1);
  let ongoingEvents: Event[] = await getEventsOngoing(1);
  let recentEvents: Event[] = await getEventsRecent(1);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header showMenu={true} />

      <div className="flex flex-col px-4 pt-4 pb-1 justify-center">
        <div className="text-center text-3xl">{t('pageTitle')}</div>
        <div className="text-center text-xl">{t('slogan')}</div>
        <img className="h-12 mt-2" src={imgFreestyler}></img>
      </div>

      <div className="flex max-h-full flex-col overflow-y-auto">
        {/* Show all */}
        <div className="m-2 mt-6 flex flex-shrink-0 justify-center">
          <Link href={routeEvents}>
            <TextButton text={t('btnShowAllEvents')} />
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <EventsCarousel upcomingEvents={upcomingEvents} ongoingEvents={ongoingEvents} recentEvents={recentEvents} />
        </div>
      </div>

      <Navigation>
        <div className="mx-2 flex gap-1">
          <Link href={routeMap}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center gap-1">
                <img src={imgWorld} className="h-8 w-8 rounded-full object-cover" />
                <div>{t('navMap')}</div>
              </div>
            </div>
          </Link>

          <Link href={routeUsers}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center gap-1">
                <img src={imgCommunity} className="h-8 w-8 rounded-full object-cover" />
                <div>{t('navCommunity')}</div>
              </div>
            </div>
          </Link>
        </div>

        {session?.user?.username === TechnicalUser.ADMIN && (
          <div className="mx-2">
            <Link href={routeAdminOverview}>
              <div className="rounded-lg p-1">
                <div className="grid grid-flow-col items-center gap-1">
                  <img src={imgProfileSettings} className="mx-1 h-8 w-8 rounded-full object-cover" />
                  <div>{t('navAdminOverview')}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <Link href={routeAbout}>
          <div className="rounded-lg p-1">
            <div className="grid grid-flow-col items-center">
              <img src={imgAbout} className="mx-1 h-8 w-8 rounded-full object-cover" />
              <div className="mx-1">{t('navAbout')}</div>
            </div>
          </div>
        </Link>
      </Navigation>
    </div>
  );
}
