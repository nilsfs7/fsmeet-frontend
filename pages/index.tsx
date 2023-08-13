import TextButton from '@/components/common/TextButton';
import EventCard from '@/components/events/EventCard';
import Profile from '@/components/user/profile';
import { IEvent } from '@/interface/event';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

const imageAbout = '/info.svg';
const routeAbout = '/about';

const Home = ({ data }: { data: any[] }) => {
  let events: IEvent[] = data;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-300 sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <Link href="/">
            <h1 className="text-xl">FSMeet</h1>
          </Link>

          <Profile />
        </div>
      </div>

      {/* Upcoming Events */}
      <h1 className="mt-2 text-center text-xl">Upcoming Events</h1>
      <div className="overflow-hidden">
        <div className="mt-2 flex max-h-full justify-center overflow-y-auto">
          <div className="mx-2 ">
            {events.map((item: any, i: number) => {
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
      </div>

      {/* Actions */}
      <div className="m-2 flex flex-shrink-0 justify-center">
        <Link href={'/events/'}>
          <TextButton text="Show All" />
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-zinc-300 sm:block">
        <div className="mx-2 flex h-16 items-center justify-end">
          <Link href="/about">
            <div className="cursor-pointer rounded-lg bg-zinc-300 p-1 hover:bg-zinc-400">
              <div className="grid grid-flow-col items-center">
                <img src={imageAbout} className="mx-1 h-8 w-8 rounded-full object-cover" />
                <div className="mx-1 truncate hover:text-clip">{'About'}</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  let data = [];

  const numberOfEventsToFetch = 2;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/upcoming/${numberOfEventsToFetch.toString()}`;
  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error: any) {
    console.error('Error fetching events.');
  }

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
