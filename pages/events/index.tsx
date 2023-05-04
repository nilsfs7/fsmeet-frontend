import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import { IEvent } from '@/interface/event';
import Link from 'next/link';
import Button from '@/components/common/Button';

const MyEventsOverview = ({ data, session }: { data: any[]; session: any }) => {
  const events: IEvent[] = data;

  return (
    <div className="flex flex-col justify-center">
      {/* Banner */}
      <div className="bg-zinc-300 sm:block">
        <div className="m-6 flex items-center justify-between">
          <h1 className="text-xl">My Events</h1>
          <Link href="/events/create">
            <Button text="Create Event"></Button>
          </Link>
        </div>
      </div>

      {/* Event Subscriptions */}
      <div className="flex-grow flex-col justify-center">
        <div className="m-4 flex justify-center">
          <div className="">
            <h1 className="text-center text-xl">Event Subscriptions</h1>
            <div>
              {events.map((item: any, i: number) => {
                return (
                  <div key={i.toString()}>
                    <Link href={`/events/${item.id}`}>
                      <EventCard event={item} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyEventsOverview;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`);
  const data = await response.json();

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
