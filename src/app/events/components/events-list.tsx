'use client';

import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import EventCard from '@/components/events/event-card';
import { routeEvents } from '@/domain/constants/routes';
import { getEvents } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { DatePicker } from '@/components/common/date-picker';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '@/components/animation/loading-spinner';

const defaultDateFrom = moment(moment().subtract(3, 'months').toString());
const defaultDateTo = moment(moment().add(6, 'months').toString());

export const EventsList = () => {
  const t = useTranslations('/events');

  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [dateFrom, setDateFrom] = useState<Moment>(defaultDateFrom);
  const [dateTo, setDateTo] = useState<Moment>(defaultDateTo);

  const handleDateFromChanged = (moment: Moment | null) => {
    if (moment) {
      setDateFrom(moment);

      setLoadingDone(false);
      getEvents(null, null, null, moment, dateTo).then(events => {
        setEvents(events);
        setLoadingDone(true);
      });
    }
  };

  const hanldeDateToChanged = (moment: Moment | null) => {
    if (moment) {
      setDateTo(moment);

      setLoadingDone(false);
      getEvents(null, null, null, dateFrom, moment).then(events => {
        setEvents(events);
        setLoadingDone(true);
      });
    }
  };

  useEffect(() => {
    getEvents(null, null, null, dateFrom, dateTo).then(events => {
      setEvents(events);
      setLoadingDone(true);
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
        <div className="grid gap-2">
          {events.map((event: Event, i: number) => {
            return (
              <div key={`event-${i.toString()}`}>
                <Link href={`${routeEvents}/${event.id}`}>
                  <EventCard event={event} />
                </Link>
              </div>
            );
          })}

          {!loadingDone && <LoadingSpinner />}

          {events.length === 0 && loadingDone && <div className="mt-2 text-center">{t('textNoEventsFound')}</div>}
        </div>
      </div>
    </>
  );
};
