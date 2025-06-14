'use client';

import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import EventCard from '@/components/events/EventCard';
import { routeEvents } from '@/domain/constants/routes';
import { getEvents } from '@/infrastructure/clients/event.client';
import { Event } from '@/types/event';
import { DatePicker } from '@/components/common/DatePicker';
import { useTranslations } from 'next-intl';

const defaultDateFrom = moment(moment().subtract(1, 'y').year().toString()).startOf('year');
const defaultDateTo = moment(moment().year().toString()).endOf('year');

export const EventsList = () => {
  const t = useTranslations('/events');

  const [events, setEvents] = useState<Event[]>([]);
  const [dateFrom, setDateFrom] = useState<Moment>(defaultDateFrom);
  const [dateTo, setDateTo] = useState<Moment>(defaultDateTo);

  const handleDateFromChanged = (moment: Moment | null) => {
    if (moment) {
      setDateFrom(moment);

      getEvents(null, null, null, moment, dateTo).then(events => {
        setEvents(events);
      });
    }
  };

  const hanldeDateToChanged = (moment: Moment | null) => {
    if (moment) {
      setDateTo(moment);

      getEvents(null, null, null, dateFrom, moment).then(events => {
        setEvents(events);
      });
    }
  };

  useEffect(() => {
    getEvents(null, null, null, dateFrom, dateTo).then(events => {
      setEvents(events);
    });
  }, []);

  return (
    <>
      {/* Filters */}
      <div className="mt-2 flex justify-center gap-2">
        <div>
          <div className="mx-2">{t('datePickerFrom')}</div>
          <DatePicker
            date={dateFrom}
            fromDate={moment().subtract(2, 'y')}
            toDate={dateTo}
            onChange={newDate => {
              handleDateFromChanged(newDate);
            }}
          />
        </div>

        <div>
          <div className="mx-2">{t('datePickerTo')}</div>
          <DatePicker
            date={dateTo}
            fromDate={dateFrom}
            toDate={moment().add(2, 'y')}
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
                <Link href={`${routeEvents}/${item.id}`}>
                  <EventCard event={item} />
                </Link>
              </div>
            );
          })}

          {events.length === 0 && <div className="mt-2 text-center">{t('textNoEventsFound')}</div>}
        </div>
      </div>
    </>
  );
};
