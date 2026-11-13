'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import moment from 'moment';
import { IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event } from '@/domain/types/event';
import { EventType } from '@/domain/enums/event-type';
import { EventState } from '@/domain/enums/event-state';
import { isPublicEventState } from '@/functions/event-state';
import { cn } from '@/lib/utils';

const ALL = 'all';

export type EventStatusFilter = typeof ALL | 'listed' | 'notlisted' | 'waiting';
export type EventTimeFilter = typeof ALL | 'upcoming' | 'past';

export interface EventListFilterState {
  query: string;
  type: string;
  status: EventStatusFilter;
  time: EventTimeFilter;
}

const SEARCH_DEBOUNCE_MS = 250;

/** Case-insensitive match on name, alias and venue (name, city, country code). */
function matchesQuery(event: Event, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [event.name, event.alias, event.venueName, event.venueCity, event.venueCountryCode].some(v => (v ?? '').toLowerCase().includes(q));
}

function matchesStatus(event: Event, status: EventStatusFilter): boolean {
  switch (status) {
    case 'listed':
      return isPublicEventState(event.state);
    case 'waiting':
      return event.state === EventState.WAITING_FOR_APPROVAL;
    case 'notlisted':
      return !isPublicEventState(event.state) && event.state !== EventState.WAITING_FOR_APPROVAL;
    default:
      return true;
  }
}

/** Upcoming includes running events (end date not yet over). */
function matchesTime(event: Event, time: EventTimeFilter, now: moment.Moment): boolean {
  if (time === ALL) return true;
  const isPast = moment(event.dateTo || event.dateFrom).endOf('day').isBefore(now);
  return time === 'past' ? isPast : !isPast;
}

export function filterEvents(events: Event[], f: EventListFilterState): Event[] {
  const now = moment();
  return events.filter(e => matchesQuery(e, f.query) && (f.type === ALL || e.type === f.type) && matchesStatus(e, f.status) && matchesTime(e, f.time, now));
}

export function activeFilterCount(f: EventListFilterState): number {
  return [f.type !== ALL, f.status !== ALL, f.time !== ALL].filter(Boolean).length;
}

/**
 * Filter state kept in the URL (`<prefix>q`, `<prefix>type`, ...) so reloads and tab switches keep it;
 * the search text is debounced before it is written.
 */
export function useEventListFilters(prefix: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromUrl: EventListFilterState = {
    query: searchParams?.get(`${prefix}q`) ?? '',
    type: searchParams?.get(`${prefix}type`) ?? ALL,
    status: (searchParams?.get(`${prefix}status`) as EventStatusFilter) ?? ALL,
    time: (searchParams?.get(`${prefix}time`) as EventTimeFilter) ?? ALL,
  };

  const [query, setQuery] = useState(fromUrl.query);

  const write = (patch: Partial<EventListFilterState>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(patch).forEach(([key, value]) => {
      const name = `${prefix}${key === 'query' ? 'q' : key}`;
      if (!value || value === ALL) params.delete(name);
      else params.set(name, String(value));
    });
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  useEffect(() => {
    if (query === fromUrl.query) return;
    const handle = setTimeout(() => write({ query }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to typing
  }, [query]);

  const state: EventListFilterState = { ...fromUrl, query };

  return {
    state,
    setQuery,
    setType: (type: string) => write({ type }),
    setStatus: (status: EventStatusFilter) => write({ status }),
    setTime: (time: EventTimeFilter) => write({ time }),
    reset: () => {
      setQuery('');
      write({ query: '', type: ALL, status: ALL, time: ALL });
    },
  };
}

interface IEventListToolbar {
  idPrefix: string;
  filters: ReturnType<typeof useEventListFilters>;
  shown: number;
  total: number;
  /** Registrations don't need the listing-status filter. */
  showStatus?: boolean;
}

export function EventListToolbar({ idPrefix, filters, shown, total, showStatus = true }: IEventListToolbar) {
  const t = useTranslations('/events/manage');
  const tEvents = useTranslations('/events');
  const { state } = filters;
  const count = activeFilterCount(state);
  const [open, setOpen] = useState(count > 0);
  const selectTriggerClass = 'h-9 w-full min-w-0 rounded-xl border-border bg-background text-left';

  const typeOptions = useMemo(
    () => [
      { value: EventType.COMPETITION, label: tEvents('eventTypeComp') },
      { value: EventType.COMPETITION_ONLINE, label: tEvents('eventTypeCompOnline') },
      { value: EventType.MEETING, label: tEvents('eventTypeMeet') },
    ],
    [tEvents],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl border border-border bg-background p-2 shadow-xs">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
            <Input
              id={`${idPrefix}-search`}
              type="search"
              aria-label={t('inputSearchPlaceholder')}
              placeholder={t('inputSearchPlaceholder')}
              value={state.query}
              onChange={e => filters.setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full rounded-xl pl-9"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls={`${idPrefix}-filters`}
            data-testid={`${idPrefix}-filters-toggle`}
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors',
              open || count > 0 ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-border bg-background text-foreground hover:bg-muted',
            )}
          >
            <IconAdjustmentsHorizontal className="h-4 w-4" stroke={1.75} aria-hidden />
            <span className="hidden sm:inline">{t('btnFilters')}</span>
            <span className="sr-only sm:hidden">{t('btnFilters')}</span>
            {count > 0 && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-2xs font-semibold text-brand-foreground">{count}</span>}
          </button>
        </div>

        {open && (
          <div id={`${idPrefix}-filters`} className={cn('mt-2 grid grid-cols-1 gap-3 border-t border-border/70 px-1 pb-1 pt-3', showStatus ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">{tEvents('filterType')}</div>
              <Select value={state.type} onValueChange={filters.setType}>
                <SelectTrigger className={selectTriggerClass} aria-label={tEvents('filterType')} data-testid={`${idPrefix}-filter-type`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                  {typeOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showStatus && (
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterStatus')}</div>
                <Select value={state.status} onValueChange={v => filters.setStatus(v as EventStatusFilter)}>
                  <SelectTrigger className={selectTriggerClass} aria-label={t('filterStatus')} data-testid={`${idPrefix}-filter-status`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                    <SelectItem value="listed">{t('statusListed')}</SelectItem>
                    <SelectItem value="waiting">{t('statusWaiting')}</SelectItem>
                    <SelectItem value="notlisted">{t('statusNotListed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterTime')}</div>
              <Select value={state.time} onValueChange={v => filters.setTime(v as EventTimeFilter)}>
                <SelectTrigger className={selectTriggerClass} aria-label={t('filterTime')} data-testid={`${idPrefix}-filter-time`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                  <SelectItem value="upcoming">{t('timeUpcoming')}</SelectItem>
                  <SelectItem value="past">{t('timePast')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground" aria-live="polite">
        <span data-testid={`${idPrefix}-result-count`}>{t('lblResultCount', { shown, total })}</span>
        {(count > 0 || state.query) && (
          <button type="button" className="font-medium text-foreground/80 hover:text-foreground hover:underline" onClick={filters.reset}>
            {t('btnResetFilters')}
          </button>
        )}
      </div>
    </div>
  );
}
