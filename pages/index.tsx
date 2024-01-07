import { Logo } from '@/components/Logo';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import EventCard from '@/components/events/EventCard';
import Profile from '@/components/user/Profile';
import { imgAbout, imgFreestyler, imgWorld } from '@/types/consts/images';
import { routeAbout, routeEvents, routeMap } from '@/types/consts/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { getEventsUpcoming } from '@/services/fsmeet-backend/get-events-upcoming';
import { getEventsRecent } from '@/services/fsmeet-backend/get-events-recent';

const Home = ({ data }: { data: any }) => {
  let upcomingEvents: Event[] = data.upcoming;
  let recentEvents: Event[] = data.recent;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-secondary-light sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <Logo />

          <Profile />
        </div>
      </div>

      <div className="flex flex-col px-4 pt-4 pb-1 justify-center">
        <div className="text-center text-3xl">Hosting events made easy</div>
        <img className="h-12 mt-2" src={imgFreestyler}></img>
      </div>

      <div className="flex max-h-full flex-col overflow-y-auto">
        {/* Show all */}
        <div className="m-2 mt-4 flex flex-shrink-0 justify-center">
          <Link href={routeEvents}>
            <TextButton text="Show Events" />
          </Link>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <>
            <h1 className="mt-2 text-center text-2xl">Upcoming</h1>
            {/* <div className="overflow-hidden"> */}
            {/* overflow-y-auto */}
            <div className="mt-2 flex max-h-full justify-center px-2">
              <div className="w-full">
                {upcomingEvents.map((item: any, i: number) => {
                  return (
                    <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                      <Link href={`/events/${item.id}`}>
                        <EventCard event={item} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* </div> */}
          </>
        )}

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <>
            <h1 className="mt-2 text-center text-2xl">Recent</h1>
            {/* <div className="overflow-hidden"> */}
            {/* overflow-y-auto */}
            <div className="mt-2 flex max-h-full justify-center  px-2">
              <div className="w-full">
                {recentEvents.map((item: any, i: number) => {
                  return (
                    <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                      <Link href={`/events/${item.id}`}>
                        <EventCard event={item} />
                      </Link>
                    </div>
                  );
                })}
              </div>
              {/* </div> */}
            </div>
          </>
        )}
      </div>

      <Navigation>
        <div className="mx-2">
          <Link href={routeMap}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center">
                <img src={imgWorld} className="mx-1 h-8 w-8 rounded-full object-cover" />
                <div className="mx-1">{`Freestyler Map`}</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mx-2">
          <Link href={routeAbout}>
            <div className="rounded-lg p-1">
              <div className="grid grid-flow-col items-center">
                <img src={imgAbout} className="mx-1 h-8 w-8 rounded-full object-cover" />
                <div className="mx-1">About</div>
              </div>
            </div>
          </Link>
        </div>
      </Navigation>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let data: { upcoming: any[]; recent: any[] } = { upcoming: [], recent: [] };

  const numberOfUpcomingEventsToFetch = 1;
  try {
    data.upcoming = await getEventsUpcoming(numberOfUpcomingEventsToFetch);
  } catch (error: any) {
    console.error('Error fetching upcoming events.');
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

{
  /* <div className="m-2 flex flex-shrink-0 justify-center">
<Link href={routeEvents}>
  <TextAndImageButton text="Events" image={imgCompetition} />
</Link>
</div>

<div className="m-2 flex flex-shrink-0 justify-center">
<Link href={routeMap}>
  <TextAndImageButton text="Freestyler Map" image={imgWorld} />
</Link>
</div> */
}
