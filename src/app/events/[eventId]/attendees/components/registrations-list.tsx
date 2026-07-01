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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AlertTriangle, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
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

  const statusIcon = (s: EventRegistrationStatus) => {
    const label = statusLabel(s);
    const common = 'h-4 w-4 shrink-0';
    const wrap = (node: ReactNode) => (
      <span className="inline-flex h-7 w-7 items-center justify-center" title={label} aria-label={label} role="img">
        {node}
      </span>
    );
    switch (s) {
      case EventRegistrationStatus.PENDING:
        return wrap(<IconHourglass className={cn(common, 'text-amber-600 dark:text-amber-400')} stroke={2} aria-hidden />);
      case EventRegistrationStatus.APPROVED:
        return wrap(<IconCheck className={cn(common, 'text-success')} stroke={2} aria-hidden />);
      case EventRegistrationStatus.DENIED:
        return wrap(<IconBan className={cn(common, 'text-destructive')} stroke={2} aria-hidden />);
      default:
        return <span className="text-zinc-600">{label}</span>;
    }
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
        toast.success(`${username} removed`);
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
        toast.success(`Status for ${username} updated`);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgRegistrationInfoTitle')} queryParam="info" onCancel={handleCancelDialogClicked}>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRegistrationInfoType')}:`}</p>
          <p>{`${registrationSelected?.type}`}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRegistrationInfoStatus')}:`}</p>
          <p>{`${registrationSelected?.status}`}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRegistrationInfoDate')}:`}</p>
          <p>{`${moment(registrationSelected?.date).format('YYYY-MM-DD HH:mm')}`}</p>
        </div>

        {registrationSelected?.offeringOrders && registrationSelected?.offeringOrders.length > 0 && (
          <>
            <br />

            <p>{`${t('dlgRegistrationInfoOfferings')}:`}</p>
            {registrationSelected?.offeringOrders.map((id, index) => {
              const off = getOfferingById(id);
              if (off)
                return (
                  <p key={`off-${index}`} className="grid grid-cols-2 gap-1">
                    <p>{`- ${off?.description}`}</p>
                    <p>
                      {convertCurrencyIntegerToDecimal(paymentFeeCover ? off.costIncPaymentCosts : off.cost, currency)} {getCurrencySymbol(currency)}
                    </p>
                  </p>
                );
            })}

            <p className="grid grid-cols-2 gap-1">
              <p>{`${t('dlgRegistrationInfoShirtSize')}:`}</p>
              <p>{`${registrationSelected.offeringTShirtSize || na}`}</p>
            </p>
          </>
        )}

        {registrationSelected?.accommodationOrders && registrationSelected?.accommodationOrders.length > 0 && (
          <>
            <br />

            <p>{`${t('dlgRegistrationInfoAccommodations')}:`}</p>
            {registrationSelected?.accommodationOrders.map((id, index) => {
              const acc = getAccommodationById(id);
              if (acc)
                return (
                  <p key={`acc-${index}`} className="grid grid-cols-2 gap-1">
                    <p>{`- ${acc?.description}`}</p>
                    <p>
                      {convertCurrencyIntegerToDecimal(paymentFeeCover ? acc.costIncPaymentCosts : acc.cost, currency)} {getCurrencySymbol(currency)}
                    </p>
                  </p>
                );
            })}
          </>
        )}

        {registrationSelected?.phoneNumber && (
          <p className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRegistrationInfoPhoneNumber')}:`}</p>
            <p>{`+${registrationSelected?.phoneCountryCode} ${registrationSelected?.phoneNumber}`}</p>
          </p>
        )}
        {registrationSelected?.email && (
          <p className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRegistrationInfoEmail')}:`}</p>
            <p>{registrationSelected?.email}</p>
          </p>
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

      <div className={cn('text-sm flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-none')}>
        {registrations.length > 0 && (
          <>
            {pendingCount > 0 && (
              <Alert className={cn('shrink-0 border-amber-200/90 bg-amber-50 text-amber-950', 'dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100')}>
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                <AlertDescription>{t('alertPendingRegistrations', { count: pendingCount })}</AlertDescription>
              </Alert>
            )}

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="min-w-0 flex-1 sm:max-w-xs">
                <label className="mb-1 block text-left text-xs text-zinc-600" htmlFor="attendees-filter-name">
                  {t('filterNameLabel')}
                </label>
                <Input id="attendees-filter-name" type="search" value={nameQuery} onChange={e => setNameQuery(e.target.value)} placeholder={t('filterNamePlaceholder')} className="w-full" />
              </div>
              <div className="w-full min-w-[10rem] sm:w-48">
                <span className="mb-1 block text-left text-xs text-zinc-600">{t('filterStatusLabel')}</span>
                <Select value={statusFilter} onValueChange={v => setStatusFilter(v === 'all' ? 'all' : (v as EventRegistrationStatus))}>
                  <SelectTrigger aria-label={t('filterStatusLabel')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filterStatusAll')}</SelectItem>
                    <SelectItem value={EventRegistrationStatus.PENDING}>{t('statusPending')}</SelectItem>
                    <SelectItem value={EventRegistrationStatus.APPROVED}>{t('statusApproved')}</SelectItem>
                    <SelectItem value={EventRegistrationStatus.DENIED}>{t('statusDenied')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {registrations.length === 0 && <div className="m-1 flex justify-center text-zinc-600">{t('textNoParticipants')}</div>}

        {registrations.length > 0 && filteredRegistrations.length === 0 && <div className="m-1 flex justify-center text-zinc-600">{t('textNoFilterMatch')}</div>}

        {registrations.length > 0 && displayedRegistrations.length > 0 && (
          <div className="min-h-0 min-w-0 max-w-full overflow-x-auto scrollbar-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[10rem]" aria-sort={ariaSortForColumn('name', tableSort)}>
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
                  <TableHead className="min-w-[10rem] text-right">{t('tableColActions')}</TableHead>
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
                          className="font-medium text-primary underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {formatRegistrantFullName(user)}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-zinc-700">{typeLabel(type)}</TableCell>
                      <TableCell className="whitespace-nowrap text-zinc-800">{statusIcon(status)}</TableCell>
                      <TableCell className="text-right align-middle">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};
