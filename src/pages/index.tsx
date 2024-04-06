import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import EventCard from '@/components/events/EventCard';
import { imgAbout, imgCommunity, imgFreestyler, imgProfileSettings, imgWorld } from '@/types/consts/images';
import { routeAbout, routeAdminOverview, routeEvents, routeMap, routeUsers } from '@/types/consts/routes';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { getEventsUpcoming } from '@/services/fsmeet-backend/get-events-upcoming';
import { getEventsRecent } from '@/services/fsmeet-backend/get-events-recent';
import { getEventsOngoing } from '@/services/fsmeet-backend/get-events-ongoing';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { GetServerSidePropsContext } from 'next';
import { Header } from '@/components/Header';

const Home = ({ data, session }: { data: any; session: any }) => {
  let upcomingEvents: Event[] = data.upcoming;
  let ongoingEvents: Event[] = data.ongoing;
  let recentEvents: Event[] = data.recent;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <Header showMenu={true} />

      <div className="flex flex-col px-4 pt-4 pb-1 justify-center">
        <div className="text-center text-3xl">Your Freestyle Events</div>
        <div className="text-center text-xl">Plan | Compete | Connect</div>
        <img className="h-12 mt-2" src={imgFreestyler}></img>
      </div>

      <div className="flex max-h-full flex-col overflow-y-auto">
        {/* Show all */}
        <div className="m-2 mt-6 flex flex-shrink-0 justify-center">
          <Link href={routeEvents}>
            <TextButton text="Show All" />
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 6000,
              }),
            ]}
            className="w-full max-w-lg"
          >
            <CarouselContent>
              {/* Ongoing Events */}
              {Array.from({ length: ongoingEvents.length }).map((_, index) => (
                <CarouselItem key={`ongoing-${index}`}>
                  <>
                    <h1 className="mt-2 text-center text-2xl">Current Event</h1>

                    <div className="mt-2 flex max-h-full justify-center px-2">
                      <div className="w-full">
                        {ongoingEvents.map((item: any, i: number) => {
                          return (
                            <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                              <Link href={`${routeEvents}/${item.id}`}>
                                <EventCard event={item} />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                </CarouselItem>
              ))}

              {/* Upcoming Events */}
              {Array.from({ length: upcomingEvents.length }).map((_, index) => (
                <CarouselItem key={`upcoming-${index}`}>
                  <>
                    <h1 className="mt-2 text-center text-2xl">Upcoming Event</h1>

                    <div className="mt-2 flex max-h-full justify-center px-2">
                      <div className="w-full">
                        {upcomingEvents.map((item: any, i: number) => {
                          return (
                            <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                              <Link href={`${routeEvents}/${item.id}`}>
                                <EventCard event={item} />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                </CarouselItem>
              ))}

              {/* Recent Events */}
              {Array.from({ length: recentEvents.length }).map((_, index) => (
                <CarouselItem key={`recent-${index}`}>
                  <>
                    <h1 className="mt-2 text-center text-2xl">Recent Event</h1>

                    <div className="mt-2 flex max-h-full justify-center px-2">
                      <div className="w-full">
                        {recentEvents.map((item: any, i: number) => {
                          return (
                            <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                              <Link href={`${routeEvents}/${item.id}`}>
                                <EventCard event={item} />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <Navigation>
        <div className="mx-2 flex gap-1">
          <Link href={routeMap}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center gap-1">
                <img src={imgWorld} className="h-8 w-8 rounded-full object-cover" />
                <div>{`Map`}</div>
                {/* <div>{`Freestyler Map`}</div> */}
              </div>
            </div>
          </Link>

          <Link href={routeUsers}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center gap-1">
                <img src={imgCommunity} className="h-8 w-8 rounded-full object-cover" />
                <div>{`Community`}</div>
              </div>
            </div>
          </Link>
        </div>

        {session?.user?.username === 'admin' && (
          <div className="mx-2">
            <Link href={routeAdminOverview}>
              <div className="rounded-lg p-1">
                <div className="grid grid-flow-col items-center gap-1">
                  <img src={imgProfileSettings} className="mx-1 h-8 w-8 rounded-full object-cover" />
                  <div>{`Admin Overview`}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <Link href={routeAbout}>
          <div className="rounded-lg p-1">
            <div className="grid grid-flow-col items-center">
              <img src={imgAbout} className="mx-1 h-8 w-8 rounded-full object-cover" />
              <div className="mx-1">{`About`}</div>
            </div>
          </div>
        </Link>
      </Navigation>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  let data: { upcoming: any[]; ongoing: any[]; recent: any[] } = { upcoming: [], ongoing: [], recent: [] };

  const numberOfUpcomingEventsToFetch = 1;
  try {
    data.upcoming = await getEventsUpcoming(numberOfUpcomingEventsToFetch);
  } catch (error: any) {
    console.error('Error fetching upcoming events.');
  }

  const numberOfOngoingEventsToFetch = 1;
  try {
    data.ongoing = await getEventsOngoing(numberOfOngoingEventsToFetch);
  } catch (error: any) {
    console.error('Error fetching ongoing events.');
  }

  const numberOfRecentEventsToFetch = 1;
  try {
    data.recent = await getEventsRecent(numberOfRecentEventsToFetch);
  } catch (error: any) {
    console.error('Error fetching recent events.');
  }

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
