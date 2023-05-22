import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import { IEvent } from '@/interface/event';
import Link from 'next/link';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import Button from '@/components/common/Button';

const defaultDateFrom = moment(moment().year().toString()).startOf('year');
const defaultDateTo = moment(moment().year().toString()).endOf('year');

const MyEventsOverview = ({ session }: { session: any }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [dateFrom, setDateFrom] = useState<Moment>(defaultDateFrom);
  const [dateTo, setDateTo] = useState<Moment>(defaultDateTo);

  const fetchEvents = async (from: number, to: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?dateFrom=${from}&dateTo=${to}`);
    return await response.json();
  };

  const hanldeDateFromChanged = (moment: Moment | null) => {
    if (moment) {
      setDateFrom(moment);

      fetchEvents(moment.unix(), dateTo.unix()).then(events => {
        setEvents(events);
      });
    }
  };

  const hanldeDateToChanged = (moment: Moment | null) => {
    if (moment) {
      setDateTo(moment);

      fetchEvents(dateFrom.unix(), moment.unix()).then(events => {
        setEvents(events);
      });
    }
  };

  useEffect(() => {
    fetchEvents(dateFrom.unix(), dateTo.unix()).then(events => {
      setEvents(events);
    });
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Banner */}
      <div className="bg-zinc-300 sm:block">
        <div className="m-6 flex items-center justify-between">
          <h1 className="text-xl">Events</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="my-2 flex justify-center">
        <div className="mx-1 w-40">
          <DatePicker label="From" value={dateFrom} onChange={newDate => hanldeDateFromChanged(newDate)} />
        </div>
        <div className="mx-1 w-40">
          <DatePicker label="To" value={dateTo} onChange={newDate => hanldeDateToChanged(newDate)} />
        </div>
      </div>

      {/* Events */}
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
      </div>
    </div>
  );
};
export default MyEventsOverview;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
