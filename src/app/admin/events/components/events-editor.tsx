'use client';

import LoadingSpinner from '@/components/animation/loading-spinner';
import ActionButton from '@/components/common/action-button';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getEvents, updateEventState } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import moment from 'moment';
import { EventState } from '@/domain/enums/event-state';
import { Event } from '@/domain/types/event';
import { menuEventStates } from '@/domain/constants/menus/menu-event-states';
import ComboBox from '@/components/common/combo-box';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

const DEFAULT_DATE_FROM = moment('2000').startOf('year');
const DEFAULT_DATE_TO = moment('2099').endOf('year');

/** Align with /wffa/visa and /admin/licenses table layout */
const EVENT_TABLE_CLASS = 'table-fixed w-full min-w-[42rem] border-separate border-spacing-x-3 border-spacing-y-0';

const EVENT_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const EVENT_CELL_PAD = 'py-2.5 px-3';

const eventCol = {
  name: 'w-[36%] min-w-[10rem]',
  admin: 'w-[22%] min-w-[7rem]',
  state: 'w-[28%] min-w-[12rem]',
  actions: 'w-[14%] min-w-[6rem]',
} as const;

const MENU_STATE_FILTER = [{ text: 'All states', value: '' }, ...menuEventStates];

function matchesEventFilters(event: Event, filterName: string, filterState: string): boolean {
  if (filterState && event.state !== filterState) return false;
  const q = filterName.trim().toLowerCase();
  if (q && !event.name.toLowerCase().includes(q)) return false;
  return true;
}

function sortEventsByStateThenName(events: Event[], descending: boolean): Event[] {
  const list = [...events];
  list.sort((a, b) => {
    const byState = a.state.localeCompare(b.state);
    if (byState !== 0) return descending ? -byState : byState;
    return a.name.localeCompare(b.name);
  });
  return list;
}

export const EventsEditor = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  /** Unsaved ComboBox edits; committed state lives on `events` until Save. */
  const [draftStateByEventId, setDraftStateByEventId] = useState<Partial<Record<string, EventState>>>({});
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterState, setFilterState] = useState('');
  /** Sort table rows by committed `event.state` (asc = A→Z of state string). */
  const [stateSortDescending, setStateSortDescending] = useState(false);

  const loadEvents = useCallback(
    async (showInitialSpinner: boolean) => {
      if (status !== 'authenticated' || !session) {
        if (showInitialSpinner) setLoading(false);
        return;
      }
      if (showInitialSpinner) setLoading(true);
      try {
        const data = await getEvents(null, null, null, DEFAULT_DATE_FROM, DEFAULT_DATE_TO, session);
        setEvents(data);
        setDraftStateByEventId({});
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'Failed to load events.');
      } finally {
        if (showInitialSpinner) setLoading(false);
      }
    },
    [session, status],
  );

  const handleDraftEventStateChanged = (eventId: string, state: EventState) => {
    setDraftStateByEventId(prev => ({ ...prev, [eventId]: state }));
  };

  const handleSaveEventClicked = async (event: Event) => {
    const eventId = event.id;
    if (!eventId) return;

    const nextState = draftStateByEventId[eventId] ?? event.state;

    try {
      await updateEventState(session, eventId, nextState);
      toast.success(`State for ${event.name} (${eventId}) updated.`);
      setEvents(prev => prev.map(evt => (evt.id === eventId ? { ...evt, state: nextState } : evt)));
      setDraftStateByEventId(prev => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      await loadEvents(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }
    loadEvents(true);
  }, [status, loadEvents]);

  const filteredEvents = useMemo(
    () => events.filter(ev => matchesEventFilters(ev, filterName, filterState)),
    [events, filterName, filterState],
  );

  const sortedFilteredEvents = useMemo(
    () => sortEventsByStateThenName(filteredEvents, stateSortDescending),
    [filteredEvents, stateSortDescending],
  );

  if (loading || status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto pb-4">
        <div className="rounded-lg border border-primary bg-secondary-light p-2 text-sm">
          {events.length > 0 && (
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[14rem]">
                <span className="text-xs font-medium text-primary/80">Event name</span>
                <Input
                  placeholder="Search…"
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1 sm:max-w-[min(100%,14rem)]">
                <span className="text-xs font-medium text-primary/80">State</span>
                <ComboBox
                  menus={MENU_STATE_FILTER}
                  value={filterState}
                  searchEnabled={false}
                  label="State"
                  className="w-full max-w-none"
                  onChange={(value: string) => setFilterState(value)}
                />
              </div>
            </div>
          )}

          {events.length === 0 ? (
            <p className="text-center text-sm text-primary/70">No entries</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-center text-sm text-primary/70">No matching events</p>
          ) : (
            <div className="rounded-md border border-secondary-dark bg-background">
              <Table className={EVENT_TABLE_CLASS}>
                <TableHeader>
                  <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className={cn('text-primary', EVENT_HEAD_PAD, eventCol.name)}>Event</TableHead>
                    <TableHead className={cn('text-primary', EVENT_HEAD_PAD, eventCol.admin)}>Admin</TableHead>
                    <TableHead className={cn('text-primary', EVENT_HEAD_PAD, eventCol.state)}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-left font-medium hover:text-primary/80"
                        onClick={() => setStateSortDescending(d => !d)}
                        title={stateSortDescending ? 'Sort state ascending' : 'Sort state descending'}
                      >
                        State
                        {stateSortDescending ? (
                          <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        ) : (
                          <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className={cn('text-right text-primary', EVENT_HEAD_PAD, eventCol.actions)}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:first-child_td]:pt-3">
                  {sortedFilteredEvents.map(event => {
                    const id = event.id ?? '';
                    const comboValue = id ? (draftStateByEventId[id] ?? event.state) : event.state;
                    const dirty = Boolean(id && comboValue !== event.state);

                    return (
                      <TableRow key={id || event.name} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                        <TableCell className={cn(EVENT_CELL_PAD, 'text-primary align-top', eventCol.name)}>
                          {event.id ? (
                            <Link href={`${routeEvents}/${event.id}`} className="underline hover:text-primary/80">
                              {event.name}
                            </Link>
                          ) : (
                            <span>{event.name}</span>
                          )}
                        </TableCell>
                        <TableCell className={cn(EVENT_CELL_PAD, 'text-primary align-top', eventCol.admin)}>
                          {event.admin ? (
                            <Link href={`${routeUsers}/${event.admin}`} className="underline hover:text-primary/80">
                              {event.admin}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className={cn(EVENT_CELL_PAD, 'text-primary align-top', eventCol.state)}>
                          {id ? (
                            <ComboBox
                              menus={menuEventStates}
                              value={comboValue}
                              searchEnabled={false}
                              onChange={(value: EventState) => {
                                handleDraftEventStateChanged(id, value);
                              }}
                            />
                          ) : (
                            menuEventStates.find(m => m.value === event.state)?.text ?? String(event.state)
                          )}
                        </TableCell>
                        <TableCell className={cn(EVENT_CELL_PAD, 'text-right align-top', eventCol.actions)}>
                          <div className="flex justify-end gap-1">
                            {id && dirty && <ActionButton action={Action.SAVE} onClick={() => handleSaveEventClicked(event)} />}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
