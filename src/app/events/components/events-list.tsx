'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import EventCard from '@/components/events/event-card';
import { routeEvents } from '@/domain/constants/routes';
import { getEvents } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { DatePicker } from '@/components/common/date-picker';
import { useTranslations } from 'next-intl';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';

const defaultDateFrom = moment(moment().subtract(3, 'months').toString());
const defaultDateTo = moment(moment().add(6, 'months').toString());

type LoadState = 'loading' | 'ok' | 'error';

export const EventsList = () => {
  const t = useTranslations('/events');
  const tData = useTranslations('global/data-states');
  const tDataRef = useRef(tData);
  tDataRef.current = tData;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [dateFrom, setDateFrom] = useState<Moment>(defaultDateFrom);
  const [dateTo, setDateTo] = useState<Moment>(defaultDateTo);

  const loadForRange = useCallback((from: Moment, to: Moment) => {
    setLoadState('loading');
    setErrorMessage(null);
    return getEvents(null, null, null, from, to)
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoadState('ok');
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : tDataRef.current('loadFailed');
        setErrorMessage(msg);
        setEvents([]);
        setLoadState('error');
      });
  }, []);

  useEffect(() => {
    void loadForRange(defaultDateFrom, defaultDateTo);
  }, [loadForRange]);

  const handleDateFromChanged = (m: Moment | null) => {
    if (m) {
      setDateFrom(m);
      void loadForRange(m, dateTo);
    }
  };

  const handleDateToChanged = (m: Moment | null) => {
    if (m) {
      setDateTo(m);
      void loadForRange(dateFrom, m);
    }
  };

  return (
    <>
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
              handleDateToChanged(newDate);
            }}
          />
        </div>
      </div>

      <div className="mt-2 flex max-h-full justify-center overflow-y-auto px-2">
        <div className="grid w-full max-w-lg justify-items-center gap-2">
          {loadState === 'loading' && <AppDataStateListSkeleton />}

          {loadState === 'error' && errorMessage && (
            <div className="w-full min-w-0 max-w-lg">
              <AppDataStateError
                title={tData('errorTitle')}
                message={errorMessage}
                onRetry={() => void loadForRange(dateFrom, dateTo)}
                retryLabel={tData('btnRetry')}
              />
            </div>
          )}

          {loadState === 'ok' && events.length === 0 && <AppDataStateEmpty description={t('textNoEventsFound')} />}

          {loadState === 'ok' &&
            events.length > 0 &&
            events.map((event, i) => {
              return (
                <div key={`event-${i.toString()}`} className="w-full max-w-lg">
                  <Link href={`${routeEvents}/${event.id}`}>
                    <EventCard event={event} />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
