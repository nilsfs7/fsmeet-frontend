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

  console.log(`version: ${process.env.NEXT_PUBLIC_COMMIT_SHA}`);
  const shortVer = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <>
      <div className="flex h-screen flex-col justify-center">
        {/* banner */}
        <div className="bg-zinc-300 sm:block">
          <div className="m-6 flex items-center justify-between">
            <h1 className="text-xl">FSJudge</h1>
            <Profile />
          </div>
        </div>

        {/* menu */}
        <div className="flex flex-grow flex-col justify-center">
          <h1 className="text-center text-xl">Upcoming Events</h1>
          <div>
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
          <div className="flex justify-center py-2">
            <Link href={'/events/'}>
              <Button text="Show All" />
            </Link>
          </div>
        </div>
        <div className="m-1">ver. {shortVer}</div>
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
