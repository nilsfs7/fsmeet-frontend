import Button from '@/components/common/Button';
import EventCard from '@/components/events/EventCard';
import Profile from '@/components/user/profile';
import { IEvent } from '@/interface/event';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

const Home = ({ data }: { data: any[] }) => {
  let events: IEvent[] = data;

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Banner */}
        <div className="bg-zinc-300 sm:block">
          <div className="m-6 flex items-center justify-between">
            <h1 className="text-xl">FSJudge</h1>
            <Profile />
          </div>
        </div>

        {/* Menu & Featured Events */}
        <div className="overflow-hidden">
          <div className="flex max-h-full justify-center overflow-y-auto">
            <div className="m-4">
              <h1 className="text-center text-xl">Upcoming Events</h1>

              {events.map((item: any, i: number) => {
                return (
                  <div key={i.toString()}>
                    <div className="m-2">
                      <Link href={`/events/${item.id}`}>
                        <EventCard event={item} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="m-4 flex flex-shrink-0 justify-center">
          <Link href={'/events/'}>
            <Button text="Show All" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const dateNow = moment(moment().year().toString()).startOf('year');
  const dateTo = moment(moment().year().toString()).add(7, 'day').endOf('year');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?dateFrom=${dateNow.unix()}&dateTo=${dateTo.unix()}`;
  const response = await fetch(url);
  let data = await response.json();
  if (data.length > 2) {
    data = data.splice(0, 2); // only take next 2 events (better create new backend function)
  }

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
