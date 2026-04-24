'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import { countries } from 'countries-list';
import EventCard from '@/components/events/event-card';
import { routeEvents } from '@/domain/constants/routes';
import { getEvents } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';
import { DatePicker } from '@/components/common/date-picker';
import { useTranslations } from 'next-intl';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventType } from '@/domain/enums/event-type';
import { EventCategory } from '@/domain/enums/event-category';

const defaultDateFrom = moment(moment().subtract(3, 'months').toString());
const defaultDateTo = moment(moment().add(6, 'months').toString());

const ALL = '__all__' as const;

const EVENT_TYPES: EventType[] = [EventType.COMPETITION, EventType.COMPETITION_ONLINE, EventType.MEETING];
const EVENT_CATS: EventCategory[] = [
  EventCategory.CONTINENTAL,
  EventCategory.INTERNATIONAL,
  EventCategory.NATIONAL,
  EventCategory.PULSE,
  EventCategory.SUPERBALL,
  EventCategory.WFFC,
];

type LoadState = 'loading' | 'ok' | 'error';

const COUNTRIES_MAP = countries as Record<string, { name: string }>;

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
  const [nameQuery, setNameQuery] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [filterVenue, setFilterVenue] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [wffaRankedOnly, setWffaRankedOnly] = useState(false);
  const [prizeMoneyOnly, setPrizeMoneyOnly] = useState(false);

  const typeLabel = useMemo(
    () => ({
      [EventType.COMPETITION]: t('eventTypeComp'),
      [EventType.COMPETITION_ONLINE]: t('eventTypeCompOnline'),
      [EventType.MEETING]: t('eventTypeMeet'),
    }),
    [t],
  );

  const categoryLabel = useMemo(
    () => ({
      [EventCategory.CONTINENTAL]: t('eventCatContinental'),
      [EventCategory.INTERNATIONAL]: t('eventCatInternational'),
      [EventCategory.NATIONAL]: t('eventCatNational'),
      [EventCategory.PULSE]: t('eventCatPulse'),
      [EventCategory.SUPERBALL]: t('eventCatSuperball'),
      [EventCategory.WFFC]: t('eventCatWffc'),
    }),
    [t],
  );

  const isMeetingTypeFilter = filterType === EventType.MEETING;

  const venueCountryOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) {
      const c = (e.venueCountryCode || '').trim().toUpperCase();
      if (c) seen.add(c);
    }
    return [...seen]
      .map(code => {
        const meta = COUNTRIES_MAP[code];
        return { code, name: meta?.name || code };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [events]);

  const hasActiveFilters = useMemo(() => {
    if (isMeetingTypeFilter) {
      return Boolean(nameQuery.trim() || filterVenue || filterType);
    }
    return Boolean(
      nameQuery.trim() || filterVenue || filterType || filterCategory || wffaRankedOnly || prizeMoneyOnly,
    );
  }, [
    isMeetingTypeFilter,
    nameQuery,
    filterVenue,
    filterType,
    filterCategory,
    wffaRankedOnly,
    prizeMoneyOnly,
  ]);

  const filteredEvents = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    return events.filter(e => {
      if (nq && !e.name.toLowerCase().includes(nq)) return false;
      if (filterVenue && (e.venueCountryCode || '').toUpperCase() !== filterVenue.toUpperCase()) return false;
      if (filterType && e.type !== (filterType as EventType)) return false;
      if (filterType === EventType.MEETING) return true;
      if (filterCategory && e.category !== (filterCategory as EventCategory)) return false;
      if (wffaRankedOnly && !e.isWffaRanked) return false;
      if (prizeMoneyOnly && !(e.priceMoney > 0)) return false;
      return true;
    });
  }, [events, nameQuery, filterVenue, filterType, filterCategory, wffaRankedOnly, prizeMoneyOnly]);

  const clearAllFilters = () => {
    setNameQuery('');
    setFilterVenue('');
    setFilterType('');
    setFilterCategory('');
    setWffaRankedOnly(false);
    setPrizeMoneyOnly(false);
  };

  const loadForRange = useCallback((from: Moment, to: Moment) => {
    setLoadState('loading');
    setErrorMessage(null);
    return getEvents(null, null, null, from, to)
      .then(data => {
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

  useEffect(() => {
    if (!filterVenue) return;
    const v = filterVenue.trim().toUpperCase();
    const stillValid = events.some(e => (e.venueCountryCode || '').trim().toUpperCase() === v);
    if (!stillValid) setFilterVenue('');
  }, [events, filterVenue]);

  useEffect(() => {
    if (filterType === EventType.MEETING) {
      setFilterCategory('');
      setWffaRankedOnly(false);
      setPrizeMoneyOnly(false);
    }
  }, [filterType]);

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

  const selectTriggerClass = 'h-9 w-full min-w-0 border-border/60 bg-background/80 text-left dark:border-zinc-700';

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

      <div className="mt-1.5 w-full min-w-0 max-w-lg px-2 sm:mx-auto sm:px-0">
        <button
          type="button"
          onClick={() => setAdvancedOpen(v => !v)}
          className="flex w-full min-w-0 items-center justify-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-expanded={advancedOpen}
        >
          {hasActiveFilters ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden /> : null}
          <span className="font-medium text-foreground/90">{t('searchAdvancedLabel')}</span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', advancedOpen && 'rotate-180')} aria-hidden />
        </button>

        {advancedOpen && (
          <div className="space-y-3 pt-0.5 pb-1">
            <div>
              <label className="mb-1 block text-2xs text-muted-foreground sm:text-xs" htmlFor="events-list-search">
                {t('searchNamePlaceholder')}
              </label>
              <Input
                id="events-list-search"
                type="search"
                className="h-9 w-full bg-background/80"
                placeholder={t('searchNamePlaceholder')}
                value={nameQuery}
                onChange={e => setNameQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div>
              <div className="mb-1 text-2xs text-muted-foreground sm:text-xs">{t('filterVenueCountry')}</div>
              <Select value={filterVenue || ALL} onValueChange={v => setFilterVenue(v === ALL ? '' : v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{t('filterAll')}</SelectItem>
                  {venueCountryOptions.map(({ code, name }) => (
                    <SelectItem key={code} value={code}>
                      {name} ({code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="mb-1 text-2xs text-muted-foreground sm:text-xs">{t('filterType')}</div>
              <Select value={filterType || ALL} onValueChange={v => setFilterType(v === ALL ? '' : v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{t('filterAll')}</SelectItem>
                  {EVENT_TYPES.map(et => (
                    <SelectItem key={et} value={et}>
                      {typeLabel[et]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isMeetingTypeFilter && (
              <>
                <div>
                  <div className="mb-1 text-2xs text-muted-foreground sm:text-xs">{t('filterCategory')}</div>
                  <Select value={filterCategory || ALL} onValueChange={v => setFilterCategory(v === ALL ? '' : v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>{t('filterAll')}</SelectItem>
                      {EVENT_CATS.map(c => (
                        <SelectItem key={c} value={c}>
                          {categoryLabel[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-2 py-0.5">
                  <Checkbox
                    id="events-filter-wffa"
                    checked={wffaRankedOnly}
                    onCheckedChange={c => setWffaRankedOnly(c === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="events-filter-wffa" className="type-body-sm cursor-pointer leading-snug text-foreground/90">
                    {t('filterWffa')}
                  </label>
                </div>

                <div className="flex items-start gap-2 py-0.5">
                  <Checkbox
                    id="events-filter-prize-money"
                    checked={prizeMoneyOnly}
                    onCheckedChange={c => setPrizeMoneyOnly(c === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="events-filter-prize-money" className="type-body-sm cursor-pointer leading-snug text-foreground/90">
                    {t('filterPrizeWith')}
                  </label>
                </div>
              </>
            )}

            <div className="flex w-full min-w-0 flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="action"
                className={cn(ctaActionButtonClassName, '!min-w-0 px-3 text-sm')}
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
              >
                {t('filterClearAll')}
              </Button>
              <Button
                type="button"
                variant="action"
                className={cn(ctaActionButtonClassName, '!min-w-0 px-3 text-sm sm:self-end')}
                onClick={() => setAdvancedOpen(false)}
              >
                {t('filterApply')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex max-h-full justify-center overflow-y-auto px-2">
        <div className="grid w-full max-w-lg justify-items-center gap-2">
          {loadState === 'loading' && <AppDataStateListSkeleton />}

          {loadState === 'error' && errorMessage && (
            <div className="w-full min-w-0 max-w-lg">
              <AppDataStateError title={tData('errorTitle')} message={errorMessage} onRetry={() => void loadForRange(dateFrom, dateTo)} retryLabel={tData('btnRetry')} />
            </div>
          )}

          {loadState === 'ok' && events.length === 0 && <AppDataStateEmpty description={t('textNoEventsFound')} />}

          {loadState === 'ok' && events.length > 0 && filteredEvents.length === 0 && <AppDataStateEmpty description={t('textNoFilterMatch')} />}

          {loadState === 'ok' &&
            filteredEvents.length > 0 &&
            filteredEvents.map((event, i) => {
              return (
                <div key={event.id ?? `event-${i.toString()}`} className="w-full max-w-lg">
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
