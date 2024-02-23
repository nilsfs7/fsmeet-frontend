import { LogoFSMeet } from '@/components/Logo';
import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { routeHome } from '@/types/consts/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { getEvents } from '@/services/fsmeet-backend/get-events';
import { Event } from '@/types/event';
import { DatePicker } from '@/components/common/DatePicker';

const defaultDateFrom = moment(moment().year().toString()).startOf('year');
const defaultDateTo = moment(moment().year().toString()).endOf('year');

const EventsOverview = ({ session }: { session: any }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [dateFrom, setDateFrom] = useState<Moment>(defaultDateFrom);
  const [dateTo, setDateTo] = useState<Moment>(defaultDateTo);

  const hanldeDateFromChanged = (moment: Moment | null) => {
    if (moment) {
      setDateFrom(moment);

      getEvents(moment, dateTo).then(events => {
        setEvents(events);
      });
    }
  };

  const hanldeDateToChanged = (moment: Moment | null) => {
    if (moment) {
      setDateTo(moment);

      getEvents(dateFrom, moment).then(events => {
        setEvents(events);
      });
    }
  };

  useEffect(() => {
    getEvents(dateFrom, dateTo).then(events => {
      setEvents(events);
    });
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Banner */}
      <div className="sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <LogoFSMeet />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-2 flex justify-center gap-2">
        <div>
          <div className="mx-2">From</div>
          <DatePicker
            date={dateFrom}
            onChange={newDate => {
              hanldeDateFromChanged(newDate);
            }}
          />
        </div>

        <div>
          <div className="mx-2">To</div>
          <DatePicker
            date={dateTo}
            onChange={newDate => {
              hanldeDateToChanged(newDate);
            }}
          />
        </div>
      </div>

      {/* Events */}
      <div className="mt-2 flex max-h-full justify-center overflow-y-auto px-2">
        <div className="w-full">
          {events.map((item: any, i: number) => {
            return (
              <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                <Link href={`/events/${item.id}`}>
                  <EventCard event={item} />
                </Link>
              </div>
            );
          })}

          {events.length === 0 && <div className="mt-2 text-center">No events for the specified date range.</div>}
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};
export default EventsOverview;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
