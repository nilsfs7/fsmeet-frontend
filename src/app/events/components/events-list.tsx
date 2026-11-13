'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import moment, { Moment } from 'moment';
import Link from 'next/link';
import { countries } from 'countries-list';
import EventCard from '@/components/events/event-card';
import { AdvertisementCard } from '@/components/events/advertisement-card';
import { FeaturedEventCard } from '@/components/events/featured-event-card';
import { routeEvents } from '@/domain/constants/routes';
import { getEvents, getEventsFeatured } from '@/infrastructure/clients/event.client';
import { getAdvertisements } from '@/infrastructure/clients/advertisement.client';
import type { ReadAdvertisementResponseDto } from '@/infrastructure/clients/dtos/advertisement/read-advertisement-response-dto';
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
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { EventType } from '@/domain/enums/event-type';
import { EventCategory } from '@/domain/enums/event-category';

const defaultDateFrom = moment(moment().subtract(3, 'months').toString());
const defaultDateTo = moment(moment().add(6, 'months').toString());

const ALL = '__all__' as const;

const EVENT_TYPES: EventType[] = [EventType.COMPETITION, EventType.COMPETITION_ONLINE, EventType.MEETING];
const EVENT_CATS: EventCategory[] = [EventCategory.CONTINENTAL, EventCategory.INTERNATIONAL, EventCategory.NATIONAL, EventCategory.PULSE, EventCategory.SUPERBALL, EventCategory.WFFC];

/** Inline ad rows in the event list (every N cards); matches Tailwind `lg` sidebar breakpoint. */
const listAdAfterEveryNEvents = Number(process.env.NEXT_PUBLIC_EVENTS_LIST_AD_AFTER_N_EVENT_CARDS) || 4;

type LoadState = 'loading' | 'ok' | 'error';

const COUNTRIES_MAP = countries as Record<string, { name: string }>;

function useMinWidthLg(): boolean {
  return useSyncExternalStore(
    onStoreChange => {
      const mq = window.matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  );
}

/** Narrow: full rotation. Wide + sidebar: skip duplicate of `ads[0]` when only one exists; otherwise rotate from `ads[1]`. */
function pickInlineAdvertisement(ads: ReadAdvertisementResponseDto[], adSlot: number, isLg: boolean): ReadAdvertisementResponseDto | null {
  if (ads.length === 0) return null;
  if (isLg && ads.length === 1) return null;
  if (isLg && ads.length > 1) return ads[(adSlot + 1) % ads.length]!;
  return ads[adSlot % ads.length]!;
}

export const EventsList = () => {
  const t = useTranslations('/events');
  const tHeader = useTranslations('global/components/app-header');
  const tData = useTranslations('global/data-states');
  const tDataRef = useRef(tData);
  tDataRef.current = tData;

  const isLg = useMinWidthLg();

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [advertisements, setAdvertisements] = useState<ReadAdvertisementResponseDto[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
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
    return Boolean(nameQuery.trim() || filterVenue || filterType || filterCategory || wffaRankedOnly || prizeMoneyOnly);
  }, [isMeetingTypeFilter, nameQuery, filterVenue, filterType, filterCategory, wffaRankedOnly, prizeMoneyOnly]);

  const filteredEvents = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase();
    return events.filter(e => {
      if (nq && !e.name.toLowerCase().includes(nq)) return false;
      if (filterVenue && (e.venueCountryCode || '').toUpperCase() !== filterVenue.toUpperCase()) return false;
      if (filterType && e.type !== (filterType as EventType)) return false;
      if (filterType === EventType.MEETING) return true;
      if (filterCategory && e.category !== (filterCategory as EventCategory)) return false;
      if (wffaRankedOnly && !e.isWffaRanked) return false;
      if (prizeMoneyOnly && !(e.prizeMoney > 0)) return false;
      return true;
    });
  }, [events, nameQuery, filterVenue, filterType, filterCategory, wffaRankedOnly, prizeMoneyOnly]);

  const showDesktopAdColumn = loadState === 'ok' && filteredEvents.length > 0 && advertisements.length > 0;
  const featuredEvent = featuredEvents[0];
  const showFeaturedColumn = loadState === 'ok' && filteredEvents.length > 0 && featuredEvent != null;
  const showDesktopSideGrid = showDesktopAdColumn || showFeaturedColumn;

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
    void getAdvertisements(null)
      .then(ads => setAdvertisements(Array.isArray(ads) ? ads.filter(ad => ad.enabled) : []))
      .catch(() => {
        setAdvertisements([]);
      });
  }, []);

  useEffect(() => {
    void getEventsFeatured()
      .then(setFeaturedEvents)
      .catch(() => {
        setFeaturedEvents([]);
      });
  }, []);

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
      <div className="mx-auto flex w-full max-w-content flex-col items-center gap-3 px-4 pt-4 text-center sm:gap-4 sm:px-6 sm:pt-6 md:px-8">
        <h1 className="text-heading-1">{tHeader('navEvents')}</h1>
        {/* date range, centered on all breakpoints */}
        <div className="flex w-full max-w-md items-end justify-center gap-2 text-left">
          <div className="min-w-0">
            <div className="mb-1 text-xs font-medium text-muted-foreground">{t('datePickerFrom')}</div>
            <DatePicker
              date={dateFrom}
              fromDate={moment().subtract(2, 'y')}
              toDate={dateTo}
              onChange={newDate => {
                handleDateFromChanged(newDate);
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="mb-1 text-xs font-medium text-muted-foreground">{t('datePickerTo')}</div>
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
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-6 scrollbar-none">
        <div className="mx-auto w-full max-w-content px-4 sm:px-6 md:px-8">
          <div className={cn('grid grid-cols-1 gap-6', showDesktopSideGrid && 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start')}>
            <div className="flex min-w-0 flex-col gap-3">
              {/* filter toolbar, aligned with the list column */}
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(v => !v)}
                  className={cn(
                    'inline-flex h-10 min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground/90 shadow-xs transition-colors hover:bg-muted',
                    advancedOpen && 'border-brand/40 bg-brand-soft/40',
                  )}
                  aria-expanded={advancedOpen}
                >
                  <IconAdjustmentsHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} aria-hidden />
                  <span className="truncate">{t('searchAdvancedLabel')}</span>
                  {hasActiveFilters ? <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden /> : null}
                  <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', advancedOpen && 'rotate-180')} aria-hidden />
                </button>
                {hasActiveFilters && !advancedOpen && (
                  <Button type="button" variant="ghost" size="sm" className="h-10 rounded-xl px-3 text-sm text-muted-foreground" onClick={clearAllFilters}>
                    {t('filterClearAll')}
                  </Button>
                )}
              </div>

              {advancedOpen && (
                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background p-4 shadow-xs sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                  <div className="sm:col-span-full lg:col-span-1">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="events-list-search">
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
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterVenueCountry')}</div>
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
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterType')}</div>
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
                        <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterCategory')}</div>
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

                      <div className="flex flex-col justify-end gap-2 sm:col-span-full sm:flex-row sm:flex-wrap sm:gap-6">
                        <div className="flex items-start gap-2 py-0.5">
                          <Checkbox id="events-filter-wffa" checked={wffaRankedOnly} onCheckedChange={c => setWffaRankedOnly(c === true)} className="mt-0.5" />
                          <label htmlFor="events-filter-wffa" className="type-body-sm cursor-pointer leading-snug text-foreground/90">
                            {t('filterWffa')}
                          </label>
                        </div>

                        <div className="flex items-start gap-2 py-0.5">
                          <Checkbox id="events-filter-prize-money" checked={prizeMoneyOnly} onCheckedChange={c => setPrizeMoneyOnly(c === true)} className="mt-0.5" />
                          <label htmlFor="events-filter-prize-money" className="type-body-sm cursor-pointer leading-snug text-foreground/90">
                            {t('filterPrizeWith')}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex w-full min-w-0 flex-col-reverse gap-2 pt-1 sm:col-span-full sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" className="rounded-xl px-4 text-sm" onClick={clearAllFilters} disabled={!hasActiveFilters}>
                      {t('filterClearAll')}
                    </Button>
                    <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'min-w-0! px-4 text-sm')} onClick={() => setAdvancedOpen(false)}>
                      {t('filterApply')}
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
                {loadState === 'loading' && <AppDataStateListSkeleton />}

                {loadState === 'error' && errorMessage && (
                  <div className="w-full min-w-0 xl:col-span-full">
                    <AppDataStateError title={tData('errorTitle')} message={errorMessage} onRetry={() => void loadForRange(dateFrom, dateTo)} retryLabel={tData('btnRetry')} />
                  </div>
                )}

                {loadState === 'ok' && events.length === 0 && <AppDataStateEmpty description={t('textNoEventsFound')} />}

                {loadState === 'ok' && events.length > 0 && filteredEvents.length === 0 && <AppDataStateEmpty description={t('textNoFilterMatch')} />}

                {loadState === 'ok' &&
                  filteredEvents.length > 0 &&
                  filteredEvents.flatMap((event, i) => {
                    const row = (
                      <div key={event.id ?? `event-${i.toString()}`} className="min-w-0">
                        <Link href={`${routeEvents}/${event.id}`}>
                          <EventCard event={event} />
                        </Link>
                      </div>
                    );
                    if ((i + 1) % listAdAfterEveryNEvents !== 0 || advertisements.length === 0) {
                      return [row];
                    }
                    const adSlot = Math.floor(i / listAdAfterEveryNEvents);
                    const inlineAd = pickInlineAdvertisement(advertisements, adSlot, isLg);
                    if (!inlineAd) {
                      return [row];
                    }
                    return [
                      row,
                      <div key={`advertisement-slot-${event.id ?? i.toString()}`} className="min-w-0 [&>article]:max-w-none">
                        <AdvertisementCard advertisement={inlineAd} badgeLabel={t('advertisementBadge')} slotIndex={adSlot} variant="inline" />
                      </div>,
                    ];
                  })}
              </div>
            </div>

            {showDesktopSideGrid && (
              <aside className="hidden lg:sticky lg:top-0 lg:flex lg:flex-col lg:gap-4">
                {showFeaturedColumn && featuredEvent && <FeaturedEventCard event={featuredEvent} badgeLabel={t('featuredEventBadge')} linkLabel={t('featuredEventCta')} />}
                {showDesktopAdColumn && <AdvertisementCard advertisement={advertisements[0]!} badgeLabel={t('advertisementBadge')} slotIndex={0} variant="sidebar" />}
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
