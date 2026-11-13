'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useMemo, useState } from 'react';
import { IconBan, IconCheck, IconHourglass } from '@tabler/icons-react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import Dialog from '@/components/dialog';
import { Toaster, toast } from 'sonner';
import { deleteEventRegistration, updateEventRegistrationStatus } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { EventRegistration } from '@/domain/types/event-registration';
import { Accommodation } from '@/domain/types/accommodation';
import { Offering } from '@/domain/types/offering';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { convertCurrencyIntegerToDecimal } from '../../../../../functions/currency-conversion';
import { EventRegistrationType } from '../../../../../domain/types/event-registration-type';
import { User } from '@/domain/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertTriangle, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { IconSearch, IconUsers, IconX } from '@tabler/icons-react';
import { EmptyState } from '@/components/common/empty-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import moment from 'moment';

type StatusFilter = 'all' | EventRegistrationStatus;

function formatRegistrantFullName(user: User): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (full) {
    return full;
  }
  return user.username;
}

function registrationMatchesNameQuery(user: User, q: string): boolean {
  if (!q) {
    return true;
  }
  const needle = q.toLowerCase();
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').toLowerCase();
  if (full.includes(needle)) {
    return true;
  }
  if (user.username.toLowerCase().includes(needle)) {
    return true;
  }
  if (user.nickName && user.nickName.toLowerCase().includes(needle)) {
    return true;
  }
  return false;
}

const STATUS_SORT_RANK: Record<EventRegistrationStatus, number> = {
  [EventRegistrationStatus.PENDING]: 0,
  [EventRegistrationStatus.APPROVED]: 1,
  [EventRegistrationStatus.DENIED]: 2,
};

const TYPE_SORT_RANK: Record<EventRegistrationType, number> = {
  [EventRegistrationType.PARTICIPANT]: 0,
  [EventRegistrationType.VISITOR]: 1,
};

type SortableColumn = 'name' | 'type' | 'status';
type TableSort = { col: SortableColumn | null; dir: 'asc' | 'desc' };

function compareRegistrationsBySort(a: EventRegistration, b: EventRegistration, col: SortableColumn, dir: 'asc' | 'desc'): number {
  const mult = dir === 'asc' ? 1 : -1;
  if (col === 'name') {
    const nameA = formatRegistrantFullName(a.user);
    const nameB = formatRegistrantFullName(b.user);
    const cmp = nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    if (cmp !== 0) {
      return cmp * mult;
    }
    return a.user.username.localeCompare(b.user.username) * mult;
  }
  if (col === 'type') {
    return (TYPE_SORT_RANK[a.type] - TYPE_SORT_RANK[b.type]) * mult;
  }
  return (STATUS_SORT_RANK[a.status] - STATUS_SORT_RANK[b.status]) * mult;
}

function ariaSortForColumn(column: SortableColumn, sort: TableSort): 'ascending' | 'descending' | 'none' {
  if (sort.col !== column) {
    return 'none';
  }
  return sort.dir === 'asc' ? 'ascending' : 'descending';
}

function SortColumnHeaderButton({
  column,
  tableSort,
  onCycle,
  label,
  title,
  'aria-label': ariaLabel,
}: {
  column: SortableColumn;
  tableSort: TableSort;
  onCycle: (c: SortableColumn) => void;
  label: string;
  title: string;
  'aria-label': string;
}) {
  const active = tableSort.col === column;
  const showDir = active ? tableSort.dir : null;
  return (
    <button
      type="button"
      onClick={() => onCycle(column)}
      title={title}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1.5 text-left font-medium hover:underline', 'whitespace-nowrap text-zinc-900 dark:text-zinc-100')}
    >
      {label}
      {showDir === 'asc' ? (
        <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : showDir === 'desc' ? (
        <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : (
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      )}
    </button>
  );
}

interface IRegistrationsList {
  eventId: string;
  registrations: EventRegistration[];
  accommodations: Accommodation[];
  offerings: Offering[];
  currency: CurrencyCode;
  paymentFeeCover: boolean;
}

export const RegistrationsList = ({ eventId, registrations, accommodations, offerings, currency, paymentFeeCover }: IRegistrationsList) => {
  const t = useTranslations('/events/eventid/attendees');
  const na = 'n/a';

  const { data: session } = useSession();
  const router = useRouter();

  const [nameQuery, setNameQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [tableSort, setTableSort] = useState<TableSort>({ col: null, dir: 'asc' });
  const [userSelected, setUserSelected] = useState('');
  const [registrationSelected, setRegistrationSelected] = useState<EventRegistration>();

  const pendingCount = useMemo(() => registrations.filter(r => r.status === EventRegistrationStatus.PENDING).length, [registrations]);
  const statusCounts = useMemo(
    () => ({
      all: registrations.length,
      [EventRegistrationStatus.PENDING]: pendingCount,
      [EventRegistrationStatus.APPROVED]: registrations.filter(r => r.status === EventRegistrationStatus.APPROVED).length,
      [EventRegistrationStatus.DENIED]: registrations.filter(r => r.status === EventRegistrationStatus.DENIED).length,
    }),
    [registrations, pendingCount],
  );

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      if (statusFilter !== 'all' && registration.status !== statusFilter) {
        return false;
      }
      return registrationMatchesNameQuery(registration.user, nameQuery.trim());
    });
  }, [registrations, nameQuery, statusFilter]);

  const displayedRegistrations = useMemo(() => {
    if (!tableSort.col) {
      return filteredRegistrations;
    }
    const list = [...filteredRegistrations];
    const col = tableSort.col;
    const dir = tableSort.dir;
    list.sort((a, b) => compareRegistrationsBySort(a, b, col, dir));
    return list;
  }, [filteredRegistrations, tableSort]);

  const cycleColumnSort = (key: SortableColumn) => {
    setTableSort(s => {
      if (s.col !== key) {
        return { col: key, dir: 'asc' };
      }
      if (s.dir === 'asc') {
        return { col: key, dir: 'desc' };
      }
      return { col: null, dir: 'asc' };
    });
  };

  const getRegistrationByUsername = (username: string): EventRegistration | undefined => {
    const results = registrations.filter(registration => {
      return registration.user.username === username;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const getAccommodationById = (id: string): Accommodation | undefined => {
    const results = accommodations.filter(acc => {
      return acc.id === id;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const getOfferingById = (id: string): Offering | undefined => {
    const results = offerings.filter(off => {
      return off.id === id;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const statusLabel = (s: EventRegistrationStatus) => {
    switch (s) {
      case EventRegistrationStatus.PENDING:
        return t('statusPending');
      case EventRegistrationStatus.APPROVED:
        return t('statusApproved');
      case EventRegistrationStatus.DENIED:
        return t('statusDenied');
      default:
        return s;
    }
  };

  const typeLabel = (ty: EventRegistration['type']) => {
    return ty === EventRegistrationType.PARTICIPANT ? t('regTypeParticipant') : t('regTypeVisitor');
  };

  const handleInfoClicked = async (username: string) => {
    setRegistrationSelected(getRegistrationByUsername(username));
    router.replace(`${routeEvents}/${eventId}/attendees?info=1`);
  };

  const handleRemoveParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${eventId}/attendees?delete=1`);
  };

  const handleDenyParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${eventId}/attendees?deny=1`);
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/attendees`);
  };

  const handleConfirmRemoveParticipantClicked = async (username: string) => {
    if (eventId) {
      try {
        await deleteEventRegistration(eventId, username, session);
        toast.success(t('toastRemoved', { name: username }));
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleApproveParticipantClicked = async (username: string, status: EventRegistrationStatus) => {
    if (eventId) {
      try {
        await updateEventRegistrationStatus(eventId, username, status, session);
        toast.success(t('toastStatusUpdated', { name: username }));
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const statusChipClass = (s: EventRegistrationStatus) =>
    cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
      s === EventRegistrationStatus.APPROVED && 'bg-brand-soft text-brand-strong',
      s === EventRegistrationStatus.PENDING && 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
      s === EventRegistrationStatus.DENIED && 'bg-destructive/10 text-destructive',
    );

  const statusChip = (s: EventRegistrationStatus) => (
    <span className={statusChipClass(s)}>
      {s === EventRegistrationStatus.PENDING && <IconHourglass className="h-3.5 w-3.5" stroke={2} aria-hidden />}
      {s === EventRegistrationStatus.APPROVED && <IconCheck className="h-3.5 w-3.5" stroke={2} aria-hidden />}
      {s === EventRegistrationStatus.DENIED && <IconBan className="h-3.5 w-3.5" stroke={2} aria-hidden />}
      {statusLabel(s)}
    </span>
  );

  const rowActions = (registration: EventRegistration) => {
    const { user, status } = registration;
    return (
      <div className="inline-flex flex-wrap items-center justify-end gap-1">
        <ActionButton
          action={Action.INFO}
          onClick={() => {
            handleInfoClicked(user.username);
          }}
        />
        {(status === EventRegistrationStatus.APPROVED || status === EventRegistrationStatus.DENIED) && (
          <ActionButton
            action={Action.DELETE}
            onClick={() => {
              handleRemoveParticipantClicked(user.username);
            }}
          />
        )}
        {status === EventRegistrationStatus.PENDING && (
          <>
            <ActionButton
              action={Action.ACCEPT}
              onClick={() => {
                handleApproveParticipantClicked(user.username, EventRegistrationStatus.APPROVED);
              }}
            />
            <ActionButton
              action={Action.DENY}
              onClick={() => {
                handleDenyParticipantClicked(user.username);
              }}
            />
          </>
        )}
      </div>
    );
  };

  const infoRow = (label: string, value: ReactNode, key?: string) => (
    <div key={key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-foreground">{value}</dd>
    </div>
  );

  const statusTabs: StatusFilter[] = ['all', EventRegistrationStatus.PENDING, EventRegistrationStatus.APPROVED, EventRegistrationStatus.DENIED];

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgRegistrationInfoTitle')} queryParam="info" onCancel={handleCancelDialogClicked}>
        {registrationSelected && (
          <div className="flex flex-col gap-3">
            <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
              <span className="min-w-0 truncate font-semibold text-foreground">{formatRegistrantFullName(registrationSelected.user)}</span>
              {statusChip(registrationSelected.status)}
            </div>
            <dl className="divide-y divide-border">
              {infoRow(t('dlgRegistrationInfoType'), typeLabel(registrationSelected.type))}
              {infoRow(t('dlgRegistrationInfoStatus'), statusLabel(registrationSelected.status))}
              {infoRow(t('dlgRegistrationInfoDate'), moment(registrationSelected.date).format('YYYY-MM-DD HH:mm'))}
              {registrationSelected.phoneNumber && infoRow(t('dlgRegistrationInfoPhoneNumber'), `+${registrationSelected.phoneCountryCode} ${registrationSelected.phoneNumber}`)}
              {registrationSelected.email && infoRow(t('dlgRegistrationInfoEmail'), registrationSelected.email)}
            </dl>

            {registrationSelected.offeringOrders && registrationSelected.offeringOrders.length > 0 && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('dlgRegistrationInfoOfferings')}</h3>
                <dl className="divide-y divide-border">
                  {registrationSelected.offeringOrders.map((id, index) => {
                    const off = getOfferingById(id);
                    if (!off) return null;
                    return infoRow(
                      off.description,
                      `${convertCurrencyIntegerToDecimal(paymentFeeCover ? off.costIncPaymentCosts : off.cost, currency)} ${getCurrencySymbol(currency)}`,
                      `off-${index}`,
                    );
                  })}
                  {infoRow(t('dlgRegistrationInfoShirtSize'), registrationSelected.offeringTShirtSize || na)}
                </dl>
              </section>
            )}

            {registrationSelected.accommodationOrders && registrationSelected.accommodationOrders.length > 0 && (
              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('dlgRegistrationInfoAccommodations')}</h3>
                <dl className="divide-y divide-border">
                  {registrationSelected.accommodationOrders.map((id, index) => {
                    const acc = getAccommodationById(id);
                    if (!acc) return null;
                    return infoRow(
                      acc.description,
                      `${convertCurrencyIntegerToDecimal(paymentFeeCover ? acc.costIncPaymentCosts : acc.cost, currency)} ${getCurrencySymbol(currency)}`,
                      `acc-${index}`,
                    );
                  })}
                </dl>
              </section>
            )}
          </div>
        )}
      </Dialog>

      <Dialog
        title={t('dlgDenyParticipantTitle')}
        queryParam="deny"
        onCancel={handleCancelDialogClicked}
        onConfirm={() => {
          if (eventId) {
            handleApproveParticipantClicked(userSelected, EventRegistrationStatus.DENIED);
            setUserSelected('');
          }
        }}
      >
        <p>
          {t('dlgDenyParticipantText')} {userSelected}
        </p>
      </Dialog>

      <Dialog
        title={t('dlgRemoveParticipantTitle')}
        queryParam="delete"
        onCancel={handleCancelDialogClicked}
        onConfirm={() => {
          if (eventId) {
            handleConfirmRemoveParticipantClicked(userSelected);
            setUserSelected('');
          }
        }}
      >
        <p>
          {t('dlgRemoveParticipantText')} {userSelected}
        </p>
      </Dialog>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto pb-6 text-sm scrollbar-none">
        {registrations.length === 0 && <EmptyState icon={<IconUsers stroke={1.75} aria-hidden />} title={t('textNoParticipants')} />}

        {registrations.length > 0 && (
          <>
            {pendingCount > 0 && (
              <Alert className={cn('shrink-0 rounded-2xl border-amber-200/90 bg-amber-50 text-amber-950', 'dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100')}>
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                <AlertDescription>{t('alertPendingRegistrations', { count: pendingCount })}</AlertDescription>
              </Alert>
            )}

            {/* Status tiles double as the status filter */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label={t('filterStatusLabel')}>
              {statusTabs.map(s => {
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      'flex min-w-0 flex-col items-start rounded-2xl border px-3 py-2.5 text-left shadow-xs transition-colors',
                      active ? 'border-brand/60 bg-brand-soft' : 'border-border bg-background hover:border-brand/30',
                    )}
                  >
                    <span className={cn('text-xl font-bold tabular-nums', active ? 'text-brand-strong' : 'text-foreground')}>{statusCounts[s]}</span>
                    <span className="truncate text-xs text-muted-foreground">{s === 'all' ? t('statTotal') : statusLabel(s)}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative min-w-0 sm:w-80">
                <label className="sr-only" htmlFor="attendees-filter-name">
                  {t('filterNameLabel')}
                </label>
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
                <Input
                  id="attendees-filter-name"
                  type="search"
                  value={nameQuery}
                  onChange={e => setNameQuery(e.target.value)}
                  placeholder={t('filterNamePlaceholder')}
                  className="w-full pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
                />
                {nameQuery && (
                  <button
                    type="button"
                    onClick={() => setNameQuery('')}
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={t('btnClearSearch')}
                  >
                    <IconX className="h-4 w-4" stroke={1.75} aria-hidden />
                  </button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{t('textShown', { shown: filteredRegistrations.length, total: registrations.length })}</span>
            </div>
          </>
        )}

        {registrations.length > 0 && filteredRegistrations.length === 0 && <EmptyState icon={<IconSearch stroke={1.75} aria-hidden />} title={t('textNoFilterMatch')} />}

        {registrations.length > 0 && displayedRegistrations.length > 0 && (
          <>
            {/* Desktop: sortable table */}
            <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-xs sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40" aria-sort={ariaSortForColumn('name', tableSort)}>
                      <SortColumnHeaderButton
                        column="name"
                        tableSort={tableSort}
                        onCycle={cycleColumnSort}
                        label={t('tableColFullName')}
                        title={t('tableSortByName')}
                        aria-label={`${t('tableColFullName')}, ${t('tableSortByName')}`}
                      />
                    </TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap" aria-sort={ariaSortForColumn('type', tableSort)}>
                      <SortColumnHeaderButton
                        column="type"
                        tableSort={tableSort}
                        onCycle={cycleColumnSort}
                        label={t('tableColType')}
                        title={t('tableSortByType')}
                        aria-label={`${t('tableColType')}, ${t('tableSortByType')}`}
                      />
                    </TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap" aria-sort={ariaSortForColumn('status', tableSort)}>
                      <SortColumnHeaderButton
                        column="status"
                        tableSort={tableSort}
                        onCycle={cycleColumnSort}
                        label={t('tableColStatus')}
                        title={t('tableSortByStatus')}
                        aria-label={`${t('tableColStatus')}, ${t('tableSortByStatus')}`}
                      />
                    </TableHead>
                    <TableHead className="min-w-40 text-right">{t('tableColActions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRegistrations.map(registration => {
                    const { user, status, type } = registration;
                    return (
                      <TableRow key={user.username}>
                        <TableCell className="align-middle">
                          <Link
                            href={`${routeUsers}/${encodeURIComponent(user.username)}`}
                            className="font-medium text-foreground underline-offset-2 hover:text-brand-strong hover:underline focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {formatRegistrantFullName(user)}
                          </Link>
                          <div className="text-xs text-muted-foreground">@{user.username}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{typeLabel(type)}</TableCell>
                        <TableCell className="whitespace-nowrap">{statusChip(status)}</TableCell>
                        <TableCell className="text-right align-middle">{rowActions(registration)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: cards with all actions visible */}
            <div className="flex flex-col gap-2 sm:hidden">
              {displayedRegistrations.map(registration => {
                const { user, status, type } = registration;
                return (
                  <div key={user.username} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-3 shadow-xs">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`${routeUsers}/${encodeURIComponent(user.username)}`} className="block truncate font-semibold text-foreground hover:text-brand-strong">
                          {formatRegistrantFullName(user)}
                        </Link>
                        <div className="truncate text-xs text-muted-foreground">
                          @{user.username} · {typeLabel(type)}
                        </div>
                      </div>
                      {statusChip(status)}
                    </div>
                    <div className="flex justify-end border-t border-border/60 pt-2">{rowActions(registration)}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};
