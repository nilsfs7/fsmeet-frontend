'use client';

import { useRef, type TouchEvent } from 'react';
import Link from 'next/link';
import { OVERLAY_MOUSE_TARGET, FLOAT_PANE, OverlayViewF } from '@react-google-maps/api';
import { useLocale, useTranslations } from 'next-intl';
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import { IconArrowRight, IconCalendarEvent, IconChevronLeft, IconChevronRight, IconClock, IconMapPin, IconStar, IconTicket, IconTrophy, IconUsersGroup, IconX } from '@tabler/icons-react';
import { MapEvent } from '@/domain/types/map-event';
import { EventType } from '@/domain/enums/event-type';
import { routeEvents } from '@/domain/constants/routes';
import { formatDateRange, toIntlLocale } from '@/lib/format-date';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { cn } from '@/lib/utils';

export type EventTimeWindow = 'live' | '30d' | '3m' | 'all';
export const EVENT_TIME_WINDOWS: EventTimeWindow[] = ['live', '30d', '3m', 'all'];
export const DEFAULT_EVENT_TIME_WINDOW: EventTimeWindow = '3m';
export const MAP_EVENT_TYPES: EventType[] = [EventType.COMPETITION, EventType.MEETING];

export interface EventFilterState {
  time: EventTimeWindow;
  types: EventType[];
  registrationOpenOnly: boolean;
}

export const DEFAULT_EVENT_FILTERS: EventFilterState = { time: DEFAULT_EVENT_TIME_WINDOW, types: [...MAP_EVENT_TYPES], registrationOpenOnly: false };

/** zoom from which event pins are never merged into clusters (only identical venues still share one pin) */
export const EVENT_CLUSTER_MAX_ZOOM = 14;
const EVENT_CLUSTER_RADIUS_PX = 44;

export function isEventLive(e: MapEvent, now: number) {
  return moment(e.dateFrom).valueOf() <= now && moment(e.dateTo).valueOf() >= now;
}

export function isRegistrationOpen(e: MapEvent, now: number) {
  return Boolean(e.registrationOpen && e.registrationDeadline) && moment(e.registrationOpen).valueOf() <= now && moment(e.registrationDeadline).valueOf() >= now;
}

/** whole calendar days (user's time zone) until the event starts */
export function daysUntilEvent(e: MapEvent, now: number) {
  return Math.max(0, moment(e.dateFrom).startOf('day').diff(moment(now).startOf('day'), 'days'));
}

/** ongoing or upcoming events within the time window (user's clock), optionally only with open registration */
export function eventMatchesTime(e: MapEvent, time: EventTimeWindow, now: number) {
  if (moment(e.dateTo).valueOf() < now) return false;
  if (isEventLive(e, now)) return true;
  if (time === 'live') return false;
  if (time === 'all') return true;
  const limit = moment(now).add(time === '30d' ? 30 : 90, 'days').endOf('day').valueOf();
  return moment(e.dateFrom).valueOf() <= limit;
}

export function eventMatchesQuery(e: MapEvent, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [e.name, e.alias, e.venueName, e.venueCity].some(v => (v || '').toLowerCase().includes(q));
}

export function filterMapEvents(events: MapEvent[], filters: EventFilterState, query: string, now: number) {
  return events
    .filter(
      e =>
        eventMatchesTime(e, filters.time, now) &&
        filters.types.includes(e.type) &&
        (!filters.registrationOpenOnly || isRegistrationOpen(e, now)) &&
        eventMatchesQuery(e, query),
    )
    .sort((a, b) => moment(a.dateFrom).valueOf() - moment(b.dateFrom).valueOf());
}

export interface EventGroup {
  key: string;
  lat: number;
  lng: number;
  events: MapEvent[];
  /** distinct venues in this group; > 1 means it is a zoom cluster */
  venueCount: number;
}

function venueKey(e: MapEvent) {
  return `${e.lat.toFixed(4)},${e.lng.toFixed(4)}`;
}

function worldPx(lat: number, lng: number, zoom: number) {
  const s = Math.sin((Math.max(-85, Math.min(85, lat)) * Math.PI) / 180);
  const scale = 256 * 2 ** zoom;
  return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale };
}

/**
 * Events at the same venue always share one pin; below EVENT_CLUSTER_MAX_ZOOM nearby venues are merged into
 * clusters (greedy, by screen distance). Few events, so O(n²) is fine.
 */
export function groupMapEvents(events: MapEvent[], zoom: number): EventGroup[] {
  const venues = new Map<string, MapEvent[]>();
  for (const e of events) venues.set(venueKey(e), [...(venues.get(venueKey(e)) ?? []), e]);
  const venueGroups: EventGroup[] = [...venues.entries()].map(([key, list]) => ({ key, lat: list[0].lat, lng: list[0].lng, events: list, venueCount: 1 }));
  if (zoom >= EVENT_CLUSTER_MAX_ZOOM) return venueGroups;

  const clusters: { groups: EventGroup[]; px: { x: number; y: number } }[] = [];
  for (const g of venueGroups) {
    const px = worldPx(g.lat, g.lng, zoom);
    const hit = clusters.find(c => Math.hypot(c.px.x - px.x, c.px.y - px.y) < EVENT_CLUSTER_RADIUS_PX);
    if (hit) hit.groups.push(g);
    else clusters.push({ groups: [g], px });
  }
  return clusters.map(c => {
    if (c.groups.length === 1) return c.groups[0];
    const all = c.groups.flatMap(g => g.events).sort((a, b) => moment(a.dateFrom).valueOf() - moment(b.dateFrom).valueOf());
    return {
      key: c.groups.map(g => g.key).join('|'),
      lat: c.groups.reduce((s, g) => s + g.lat, 0) / c.groups.length,
      lng: c.groups.reduce((s, g) => s + g.lng, 0) / c.groups.length,
      events: all,
      venueCount: c.groups.length,
    };
  });
}

/** keep map gestures (click, drag) from firing when the user interacts with our HTML overlays */
function shieldFromMap(el: HTMLElement | null) {
  if (el && typeof google !== 'undefined') google.maps.OverlayView.preventMapHitsAndGesturesFrom(el);
}

function EventTypeIcon({ type, className }: { type: EventType; className?: string }) {
  return type === EventType.MEETING ? <IconUsersGroup className={className} stroke={2} aria-hidden /> : <IconTrophy className={className} stroke={2} aria-hidden />;
}

export function shortDateBadge(e: MapEvent, locale: string) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), { day: 'numeric', month: 'short' }).format(new Date(e.dateFrom)).replace('.', '').toUpperCase();
}

interface IEventGroupPinProps {
  group: EventGroup;
  selected: boolean;
  now: number;
  onClick: (group: EventGroup) => void;
}

export function EventGroupPin({ group, selected, now, onClick }: IEventGroupPinProps) {
  const t = useTranslations('/map');
  const locale = useLocale();
  const first = group.events[0];
  const isCluster = group.venueCount > 1;
  const live = group.events.some(e => isEventLive(e, now));
  const label =
    group.events.length === 1 ? `${first.name} · ${shortDateBadge(first, locale)}` : isCluster ? t('pinClusterLabel', { count: group.events.length }) : t('venueEventsTitle', { count: group.events.length });

  return (
    <OverlayViewF position={{ lat: group.lat, lng: group.lng }} mapPaneName={OVERLAY_MOUSE_TARGET} zIndex={selected ? 1_000_200 : 1_000_100} getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: isCluster ? -h / 2 : -h })}>
      <div ref={shieldFromMap} className="relative">
        {isCluster ? (
          <button
            type="button"
            onClick={() => onClick(group)}
            aria-label={label}
            title={label}
            data-testid="map-event-cluster"
            className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-brand text-sm font-extrabold text-white shadow-[0_0_0_6px_rgb(5_150_105/0.25),0_4px_10px_rgb(4_120_87/0.45)] transition-transform hover:scale-105"
          >
            {group.events.length}
          </button>
        ) : (
          <button type="button" onClick={() => onClick(group)} aria-label={label} title={label} data-testid="map-event-pin" className="group relative block pb-1 pt-3">
            {live && <span className="absolute left-1/2 top-[1.15rem] h-10 w-10 -translate-x-1/2 animate-ping rounded-full bg-brand/30 motion-reduce:hidden" aria-hidden />}
            <span
              className={cn(
                'relative flex items-center justify-center rounded-[50%_50%_50%_0] border-[3px] border-white shadow-[0_4px_10px_rgb(4_120_87/0.45)] transition-all [transform:rotate(-45deg)]',
                selected ? 'h-12 w-12 bg-brand-strong ring-[6px] ring-brand/25' : 'h-10 w-10 bg-brand group-hover:bg-brand-strong',
              )}
            >
              <EventTypeIcon type={first.type} className={cn('text-white [transform:rotate(45deg)]', selected ? 'h-6 w-6' : 'h-5 w-5')} />
            </span>
            <span
              className={cn(
                'absolute left-[1.6rem] top-0 whitespace-nowrap rounded-md border px-1.5 py-px text-[0.66rem] font-extrabold tracking-wide shadow-sm',
                group.events.length > 1 ? 'border-foreground bg-foreground text-background' : live ? 'border-red-200 bg-white text-red-600' : 'border-brand/30 bg-white text-brand-strong',
              )}
            >
              {group.events.length > 1 ? group.events.length : live ? `● ${t('pinLive')}` : shortDateBadge(first, locale)}
            </span>
          </button>
        )}
      </div>
    </OverlayViewF>
  );
}

function StatusChips({ event, now }: { event: MapEvent; now: number }) {
  const t = useTranslations('/map');
  const locale = useLocale();
  const live = isEventLive(event, now);
  const regOpen = isRegistrationOpen(event, now);
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', live ? 'bg-red-50 text-red-600' : 'bg-brand-soft text-brand-strong')}>
        {live ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden /> : <IconClock className="h-3.5 w-3.5" stroke={2} aria-hidden />}
        {live ? t('statusLive') : t('statusInDays', { count: daysUntilEvent(event, now) })}
      </span>
      {regOpen && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <IconTicket className="h-3.5 w-3.5" stroke={2} aria-hidden />
          {t('regUntil', { date: new Intl.DateTimeFormat(toIntlLocale(locale), { day: 'numeric', month: 'short' }).format(new Date(event.registrationDeadline)) })}
        </span>
      )}
    </div>
  );
}

function EventCardBody({ event, now, onClose, large = false }: { event: MapEvent; now: number; onClose?: () => void; large?: boolean }) {
  const t = useTranslations('/map');
  const locale = useLocale();
  const regOpen = isRegistrationOpen(event, now);
  const country = event.venueCountryCode ? getCountryNameByCode(event.venueCountryCode) : '';
  const href = `${routeEvents}/${event.id}`;

  return (
    <div className="flex flex-col gap-3" data-testid="map-event-card">
      <div className="flex gap-3">
        <Link href={href} className={cn('shrink-0 overflow-hidden rounded-xl bg-muted', large ? 'h-28 w-[5.5rem]' : 'h-[6.5rem] w-[5.25rem]')}>
          {event.imageUrlPoster ? (
            <img src={event.imageUrlPoster} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-brand">
              <EventTypeIcon type={event.type} className="h-8 w-8" />
            </span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5 pr-7">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[0.7rem] font-semibold text-brand-strong">
              <EventTypeIcon type={event.type} className="h-3 w-3" />
              {event.type === EventType.MEETING ? t('etypeMeet') : t('etypeComp')}
            </span>
            {event.isWffaRanked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[0.7rem] font-semibold text-amber-700">
                <IconStar className="h-3 w-3" stroke={2} aria-hidden />
                {t('chipWffa')}
              </span>
            )}
          </div>
          <Link href={href} className={cn('mt-1.5 line-clamp-2 font-extrabold leading-tight hover:underline', large ? 'text-lg' : 'text-base')}>
            {event.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
            <IconCalendarEvent className="h-3.5 w-3.5 shrink-0" stroke={1.75} aria-hidden />
            {formatDateRange(new Date(event.dateFrom), new Date(event.dateTo), locale)}
          </div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[0.8rem] text-muted-foreground">
            <IconMapPin className="h-3.5 w-3.5 shrink-0" stroke={1.75} aria-hidden />
            {event.venueCountryCode && <ReactCountryFlag countryCode={event.venueCountryCode} svg style={{ width: '1rem', height: '0.75rem', borderRadius: '2px' }} title={country} />}
            <span className="truncate">{[event.venueName, event.venueCity].filter(Boolean).join(' · ')}</span>
          </div>
        </div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label={t('btnCloseCard')} className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted" data-testid="map-event-card-close">
          <IconX className="h-4 w-4" stroke={2} />
        </button>
      )}
      <StatusChips event={event} now={now} />
      <div className="flex gap-2">
        <Link href={href} className={cn('inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand font-semibold text-brand-foreground transition-colors hover:bg-brand-strong', large ? 'h-12 text-base' : 'h-10 text-sm')}>
          {t('btnViewEvent')}
          <IconArrowRight className="h-4 w-4" stroke={2} aria-hidden />
        </Link>
        {regOpen && (
          <Link href={`${routeEvents}/${event.id}/registration`} className={cn('inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 font-semibold hover:bg-muted', large ? 'h-12 text-base' : 'h-10 text-sm')}>
            {t('btnRegister')}
          </Link>
        )}
      </div>
    </div>
  );
}

function EventListRows({ events, now, onPick }: { events: MapEvent[]; now: number; onPick: (e: MapEvent) => void }) {
  const locale = useLocale();
  const t = useTranslations('/map');
  return (
    <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto" data-testid="map-event-list">
      {events.map(e => (
        <li key={e.id}>
          <button type="button" onClick={() => onPick(e)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted">
            <span className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">{e.imageUrlPoster && <img src={e.imageUrlPoster} alt="" className="h-full w-full object-cover" loading="lazy" />}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{e.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {formatDateRange(new Date(e.dateFrom), new Date(e.dateTo), locale)} · {e.venueCity}
              </span>
              <span className={cn('mt-1 inline-flex rounded-full px-2 py-0.5 text-[0.68rem] font-semibold', isEventLive(e, now) ? 'bg-red-50 text-red-600' : 'bg-brand-soft text-brand-strong')}>
                {isEventLive(e, now) ? t('statusLive') : t('statusInDays', { count: daysUntilEvent(e, now) })}
              </span>
            </span>
            <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" stroke={2} aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}

export interface EventSelection {
  group: EventGroup;
  /** event shown in the card; null = list of the group's events */
  eventId: string | null;
}

interface IEventPanelProps {
  selection: EventSelection;
  now: number;
  onClose: () => void;
  onPickEvent: (eventId: string | null) => void;
}

/** desktop: card anchored below the pin (the map is panned so it fits) */
export function EventCardOverlay({ selection, now, onClose, onPickEvent }: IEventPanelProps) {
  const t = useTranslations('/map');
  const { group, eventId } = selection;
  const event = eventId ? group.events.find(e => e.id === eventId) : undefined;
  const isCluster = group.venueCount > 1;

  return (
    <OverlayViewF position={{ lat: group.lat, lng: group.lng }} mapPaneName={FLOAT_PANE} zIndex={1_000_300} getPixelPositionOffset={w => ({ x: -w / 2, y: isCluster ? 30 : 12 })}>
      <div ref={shieldFromMap} className="relative w-[22.5rem] rounded-2xl border border-border bg-background p-3.5 text-foreground shadow-xl" role="dialog" aria-label={event ? event.name : t('venueEventsTitle', { count: group.events.length })}>
        <span className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-l border-t border-border bg-background" aria-hidden />
        {event ? (
          <>
            {group.events.length > 1 && (
              <button type="button" onClick={() => onPickEvent(null)} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-strong hover:underline">
                <IconChevronLeft className="h-3.5 w-3.5" stroke={2} aria-hidden />
                {t('btnBackToList', { count: group.events.length })}
              </button>
            )}
            <EventCardBody event={event} now={now} onClose={onClose} />
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between gap-2 pr-8">
              <h3 className="text-sm font-bold">{isCluster ? t('pinClusterLabel', { count: group.events.length }) : t('venueEventsTitle', { count: group.events.length })}</h3>
            </div>
            <button type="button" onClick={onClose} aria-label={t('btnCloseCard')} className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
              <IconX className="h-4 w-4" stroke={2} />
            </button>
            <EventListRows events={group.events} now={now} onPick={e => onPickEvent(e.id)} />
          </>
        )}
      </div>
    </OverlayViewF>
  );
}

interface IEventSheetProps extends IEventPanelProps {
  /** all visible events in date order, for swiping to the next/previous one */
  allEvents: MapEvent[];
  onNavigate: (event: MapEvent) => void;
}

/** mobile: bottom sheet over the map, swipe (or arrows) to move through all visible events */
export function EventSheet({ selection, now, onClose, onPickEvent, allEvents, onNavigate }: IEventSheetProps) {
  const t = useTranslations('/map');
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { group, eventId } = selection;
  const event = eventId ? group.events.find(e => e.id === eventId) : undefined;
  const index = event ? allEvents.findIndex(e => e.id === event.id) : -1;

  const go = (delta: number) => {
    if (index < 0 || allEvents.length < 2) return;
    onNavigate(allEvents[(index + delta + allEvents.length) % allEvents.length]);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (dy > 70 && Math.abs(dy) > Math.abs(dx)) onClose();
    else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl border-t border-border bg-background px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-2 text-foreground shadow-[0_-10px_30px_rgb(0_0_0/0.18)] animate-in slide-in-from-bottom-6"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-label={event ? event.name : t('venueEventsTitle', { count: group.events.length })}
      data-testid="map-event-sheet"
    >
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-border" aria-hidden />
      <div className="relative">
        {event ? (
          <>
            {group.events.length > 1 && (
              <button type="button" onClick={() => onPickEvent(null)} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-strong">
                <IconChevronLeft className="h-3.5 w-3.5" stroke={2} aria-hidden />
                {t('btnBackToList', { count: group.events.length })}
              </button>
            )}
            <EventCardBody event={event} now={now} onClose={onClose} large />
            {allEvents.length > 1 && index >= 0 && (
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <button type="button" onClick={() => go(-1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted" aria-label={t('btnPrevEvent')} data-testid="map-sheet-prev">
                  <IconChevronLeft className="h-4 w-4" stroke={2} />
                </button>
                <span data-testid="map-sheet-position">{t('sheetPosition', { index: index + 1, total: allEvents.length })}</span>
                <button type="button" onClick={() => go(1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted" aria-label={t('btnNextEvent')} data-testid="map-sheet-next">
                  <IconChevronRight className="h-4 w-4" stroke={2} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-base font-bold">{group.venueCount > 1 ? t('pinClusterLabel', { count: group.events.length }) : t('venueEventsTitle', { count: group.events.length })}</h3>
              <button type="button" onClick={onClose} aria-label={t('btnCloseCard')} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                <IconX className="h-4 w-4" stroke={2} />
              </button>
            </div>
            <EventListRows events={group.events} now={now} onPick={e => onPickEvent(e.id)} />
          </>
        )}
      </div>
    </div>
  );
}
