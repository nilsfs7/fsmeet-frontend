import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import { IEvent } from '@/interface/event';
import Link from 'next/link';

const MyEventsOverview = ({ data, session }: { data: any[]; session: any }) => {
  const events: IEvent[] = data;

  return (
    <div className="flex h-screen columns-2 flex-col justify-center">
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
