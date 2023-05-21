import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import { IEvent } from '@/interface/event';
import Link from 'next/link';
import Button from '@/components/common/Button';

const MyEventsOverview = ({ data, session }: { data: any[]; session: any }) => {
  const events: IEvent[] = data;

  return (
    <div className="absolute inset-0 flex h-screen flex-col overflow-hidden">
      {/* Banner */}
      <div className="bg-zinc-300 sm:block">
        <div className="m-6 flex items-center justify-start">
          <h1 className="text-xl">My Events</h1>
        </div>
      </div>

      {/* Event Subscriptions */}
      <h1 className="my-2 text-center text-xl">Event Subscriptions</h1>
      <div className="overflow-hidden">
        <div className="flex max-h-full justify-center overflow-y-auto">
          <div className="mx-2">
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
      <div className="m-2 flex flex-shrink-0 justify-between">
        <Link href="/">
          <Button text="Back" />
        </Link>
        <Link href="/events/create">
          <Button text="Create Event" />
        </Link>
      </div>
    </div>
  );
};
export default MyEventsOverview;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?owner=${session?.user.username}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
