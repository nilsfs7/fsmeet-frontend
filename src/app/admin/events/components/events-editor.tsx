'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { PageInset } from '@/components/layout/page-inset';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';
import { routeAdminOverview, routeEvents, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import { EventState } from '@/domain/enums/event-state';
import { EventType } from '@/domain/enums/event-type';
import { Event } from '@/domain/types/event';
import { getShortDateString } from '@/functions/time';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { deleteEvent, getEvents, updateEventState } from '@/infrastructure/clients/event.client';
import { cn } from '@/lib/utils';

const DATE_FROM = moment('2000').startOf('year');
const DATE_TO = moment('2099').endOf('year');
const ALL_STATES = 'all';

const STATE_LABEL: Record<EventState, string> = {
  [EventState.CREATED]: 'Created',
  [EventState.WAITING_FOR_APPROVAL]: 'Waiting for approval',
  [EventState.APPROVED]: 'Approved',
  [EventState.DENIED]: 'Denied',
  [EventState.ARCHIVED_HIDDEN]: 'Archived, hidden',
  [EventState.ARCHIVED_PUBLIC]: 'Archived, public',
};

const TYPE_LABEL: Record<EventType, string> = {
  [EventType.COMPETITION]: 'Competition',
  [EventType.COMPETITION_ONLINE]: 'Online competition',
  [EventType.MEETING]: 'Meeting',
};

type SortKey = 'dateDesc' | 'dateAsc' | 'name' | 'state';

const cardSurface = cn(
  'min-w-0 rounded-xl border border-border/60 bg-secondary-light/85 p-3 shadow-xs sm:p-4',
  'dark:border-border/50 dark:bg-background/60',
);

function eventDateLabel(event: Event): string {
  const from = moment(event.dateFrom);
  const to = moment(event.dateTo);
  if (!from.isValid()) return '';
  if (from.isSame(to, 'day')) return getShortDateString(from);
  return `${getShortDateString(from, false)} – ${getShortDateString(to)}`;
}

function matchesQuery(event: Event, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [event.name, event.alias, event.admin, event.venueCity].some(value => value?.toLowerCase().includes(needle));
}

function isCompetitionEvent(event: Event): boolean {
  return event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE;
}

function displayedState(event: Event, drafts: Record<string, EventState>): EventState {
  return (event.id && drafts[event.id]) || event.state;
}

async function mapWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function sortEvents(events: Event[], sort: SortKey, drafts: Record<string, EventState>): Event[] {
  const list = [...events];
  list.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    if (sort === 'state') {
      const stateA = STATE_LABEL[displayedState(a, drafts)] ?? displayedState(a, drafts);
      const stateB = STATE_LABEL[displayedState(b, drafts)] ?? displayedState(b, drafts);
      const byState = stateA.localeCompare(stateB);
      return byState !== 0 ? byState : a.name.localeCompare(b.name);
    }
    const delta = moment(a.dateFrom).valueOf() - moment(b.dateFrom).valueOf();
    if (delta !== 0) return sort === 'dateAsc' ? delta : -delta;
    return a.name.localeCompare(b.name);
  });
  return list;
}

export const EventsEditor = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.username === AdministrativeUser.ADMIN;

  const [events, setEvents] = useState<Event[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState(ALL_STATES);
  const [sort, setSort] = useState<SortKey>('dateDesc');
  const [draftStateByEventId, setDraftStateByEventId] = useState<Record<string, EventState>>({});
  const [competitionCountByEventId, setCompetitionCountByEventId] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<Event | null>(null);

  useEffect(() => {
    if (status === 'loading' || !session || !isAdmin) return;

    let cancelled = false;
    getEvents(null, null, null, DATE_FROM, DATE_TO, session)
      .then(async data => {
        if (cancelled) return;
        setEvents(data);
        setDraftStateByEventId({});
        setLoadError('');

        const counts: Record<string, number> = {};
        await mapWithConcurrency(
          data.filter(event => event.id && isCompetitionEvent(event)),
          6,
          async event => {
            if (!event.id) return;
            try {
              const competitions = await getCompetitions(event.id, null);
              counts[event.id] = competitions.length;
            } catch {
              // Leave the count unset so a failed lookup does not look like “no competitions”.
            }
          },
        );
        if (!cancelled) setCompetitionCountByEventId(counts);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error && error.message ? error.message : 'Events could not be loaded.');
      });

    return () => {
      cancelled = true;
    };
  }, [status, session, isAdmin, reloadKey]);

  const visibleEvents = useMemo(() => {
    const filtered = (events ?? []).filter(event => (stateFilter === ALL_STATES || displayedState(event, draftStateByEventId) === stateFilter) && matchesQuery(event, query));
    return sortEvents(filtered, sort, draftStateByEventId);
  }, [events, draftStateByEventId, stateFilter, query, sort]);

  const dirtyEvents = useMemo(
    () => (events ?? []).filter(event => event.id && draftStateByEventId[event.id] && draftStateByEventId[event.id] !== event.state),
    [events, draftStateByEventId],
  );

  const setBusy = (eventId: string, busy: boolean) => {
    setBusyIds(prev => {
      const next = new Set(prev);
      if (busy) next.add(eventId);
      else next.delete(eventId);
      return next;
    });
  };

  const handleDraftStateChanged = (event: Event, nextState: EventState) => {
    if (!isAdmin || !event.id || saving) return;
    const eventId = event.id;
    setDraftStateByEventId(current => {
      const next = { ...current };
      if (nextState === event.state) delete next[eventId];
      else next[eventId] = nextState;
      return next;
    });
  };

  const handleSave = async () => {
    if (!isAdmin || dirtyEvents.length === 0 || saving) return;
    setSaving(true);
    const savedIds: string[] = [];
    const failedNames: string[] = [];

    await mapWithConcurrency(dirtyEvents, 4, async event => {
      const eventId = event.id;
      const nextState = eventId ? draftStateByEventId[eventId] : undefined;
      if (!eventId || !nextState) return;
      try {
        await updateEventState(session, eventId, nextState);
        savedIds.push(eventId);
      } catch {
        failedNames.push(event.name);
      }
    });

    setEvents(current => (current ?? []).map(event => (event.id && savedIds.includes(event.id) ? { ...event, state: draftStateByEventId[event.id] } : event)));
    setDraftStateByEventId(current => {
      const next = { ...current };
      for (const eventId of savedIds) delete next[eventId];
      return next;
    });
    setSaving(false);

    if (failedNames.length === 0) toast.success(savedIds.length === 1 ? '1 event updated.' : `${savedIds.length} events updated.`);
    else toast.error(`Saved ${savedIds.length}. Could not update ${failedNames.join(', ')}.`);
  };

  const handleConfirmDelete = async () => {
    const event = pendingDelete;
    if (!isAdmin || !event?.id) return;
    const eventId = event.id;
    setBusy(eventId, true);
    try {
      await deleteEvent(eventId, session);
      setEvents(current => (current ?? []).filter(item => item.id !== eventId));
      setDraftStateByEventId(current => {
        const next = { ...current };
        delete next[eventId];
        return next;
      });
      setPendingDelete(null);
      toast.success(`${event.name} deleted.`);
    } catch (error: unknown) {
      toast.error(error instanceof Error && error.message ? error.message : 'The event could not be deleted.');
    } finally {
      setBusy(eventId, false);
    }
  };

  let content: ReactNode;
  if (status !== 'loading' && !isAdmin) {
    content = <AppDataStateError title="Admin only" message="Only the user admin can manage events." className="max-w-none" />;
  } else if (loadError) {
    content = (
      <AppDataStateError
        title="Could not load events"
        message={loadError}
        onRetry={() => {
          setEvents(null);
          setLoadError('');
          setReloadKey(key => key + 1);
        }}
        className="max-w-none"
      />
    );
  } else if (status === 'loading' || events === null) {
    content = <AppDataStateListSkeleton rows={5} className="max-w-none" />;
  } else {
    content = (
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:max-w-sm">
            <label className="mb-1 block text-xs text-muted-foreground" htmlFor="admin-events-search">
              Search
            </label>
            <Input id="admin-events-search" type="search" value={query} placeholder="Name, admin or city" onChange={event => setQuery(event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <div className="min-w-0 sm:w-52">
              <span className="mb-1 block text-xs text-muted-foreground">State</span>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger aria-label="State">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_STATES}>All states</SelectItem>
                  {Object.values(EventState).map(state => (
                    <SelectItem key={state} value={state}>
                      {STATE_LABEL[state]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 sm:w-44">
              <span className="mb-1 block text-xs text-muted-foreground">Sort</span>
              <Select value={sort} onValueChange={value => setSort(value as SortKey)}>
                <SelectTrigger aria-label="Sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateDesc">Newest date</SelectItem>
                  <SelectItem value="dateAsc">Oldest date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {visibleEvents.length} of {events.length}
        </p>

        {events.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No events" />
          </div>
        ) : visibleEvents.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No matching events" description="Change the search or the state filter." />
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visibleEvents.map(event => {
              const eventId = event.id ?? '';
              const busy = busyIds.has(eventId);
              const state = displayedState(event, draftStateByEventId);
              const dirty = Boolean(eventId && draftStateByEventId[eventId] && draftStateByEventId[eventId] !== event.state);
              const missingCompetitions = isCompetitionEvent(event) && eventId in competitionCountByEventId && competitionCountByEventId[eventId] === 0;
              const missingDescription = !event.description?.trim();
              return (
                <li key={eventId || event.name} className={cn(cardSurface, (missingCompetitions || missingDescription) && 'border-warning/60')}>
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="min-w-0 flex-1">
                      {event.id ? (
                        <Link href={`${routeEvents}/${event.id}`} className="wrap-break-word text-base font-semibold leading-snug hover:underline">
                          {event.name}
                        </Link>
                      ) : (
                        <p className="text-base font-semibold leading-snug">{event.name}</p>
                      )}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[TYPE_LABEL[event.type] ?? event.type, event.venueCity, eventDateLabel(event)].filter(Boolean).join(' · ')}
                      </p>
                      {event.admin && (
                        <Link href={`${routeUsers}/${event.admin}`} className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
                          {event.admin}
                        </Link>
                      )}
                      {(missingCompetitions || missingDescription) && (
                        <div className="mt-2 flex flex-col gap-1">
                          {missingDescription && (
                            <p className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                              <IconAlertTriangle className="mt-px h-4 w-4 shrink-0" stroke={2} aria-hidden />
                              No description.
                            </p>
                          )}
                          {missingCompetitions && (
                            <p className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                              <IconAlertTriangle className="mt-px h-4 w-4 shrink-0" stroke={2} aria-hidden />
                              No competitions listed.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 shrink-0 gap-1 rounded-lg border-critical/40 px-2.5 text-critical hover:bg-critical/10"
                      disabled={!event.id || busy}
                      onClick={() => setPendingDelete(event)}
                    >
                      <IconTrash className="h-4 w-4" stroke={2} aria-hidden />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </Button>
                  </div>

                  <div className="mt-3 max-w-xs">
                    <span className="mb-1 block text-xs text-muted-foreground">State</span>
                    <Select value={state} disabled={!event.id || busy || saving} onValueChange={value => handleDraftStateChanged(event, value as EventState)}>
                      <SelectTrigger aria-label={`State of ${event.name}`} className={cn(dirty && 'border-primary')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EventState).map(state => (
                          <SelectItem key={state} value={state}>
                            {STATE_LABEL[state]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Toaster richColors />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset>{content}</PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeAdminOverview} action={Action.BACK} />
        {isAdmin && events && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={dirtyEvents.length === 0 || saving} onClick={() => void handleSave()}>
            {saving ? 'Saving…' : dirtyEvents.length > 0 ? `Save (${dirtyEvents.length})` : 'Save'}
          </Button>
        )}
      </Navigation>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={open => {
          if (open || (pendingDelete?.id && busyIds.has(pendingDelete.id))) return;
          setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event</DialogTitle>
            <DialogDescription>
              {pendingDelete ? `Delete “${pendingDelete.name}”? Registrations, competitions and results of this event are removed. This cannot be undone.` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center justify-between gap-2">
            <Button type="button" variant="outline" className="rounded-lg" disabled={pendingDelete?.id ? busyIds.has(pendingDelete.id) : false} onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="actionCritical"
              className="rounded-lg"
              disabled={!pendingDelete?.id || busyIds.has(pendingDelete.id)}
              onClick={() => void handleConfirmDelete()}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
