'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import moment from 'moment';
import ReactCountryFlag from 'react-country-flag';
import { IconAlertTriangle, IconInfoCircle, IconMinus, IconPlus, IconUsersPlus } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Toaster, toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { Competition } from '@/domain/types/competition';
import { Event } from '@/domain/types/event';
import { EventRegistration } from '@/domain/types/event-registration';
import { buildPoolRows, countPool, formatUserFullName, PoolMember, PoolRow, userMatchesNameQuery } from '@/functions/competition-pool';
import { createCompetitionParticipation, deleteCompetitionParticipation } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';

type ViewFilter = 'signedUp' | 'inPool' | 'notAdded' | 'withoutSignUp' | 'all';
type StatusFilter = 'all' | EventRegistrationStatus.APPROVED | EventRegistrationStatus.PENDING;
type SortKey = 'name' | 'country' | 'date';

const BULK_CONCURRENCY = 4;

interface IParticipants {
  event: Event;
  competition: Competition;
  registrations: EventRegistration[];
  initialPool: PoolMember[];
}

function matchesView(row: PoolRow, view: ViewFilter): boolean {
  switch (view) {
    case 'signedUp':
      return row.signedUp;
    case 'inPool':
      return row.inPool;
    case 'notAdded':
      return row.signedUp && !row.inPool;
    case 'withoutSignUp':
      return row.inPool && !row.signedUp;
    case 'all':
    default:
      return true;
  }
}

function compareRows(a: PoolRow, b: PoolRow, sort: SortKey): number {
  if (sort === 'country') {
    const cmp = (a.user.countryCode ?? '~').localeCompare(b.user.countryCode ?? '~');
    if (cmp !== 0) return cmp;
  }
  if (sort === 'date') {
    const dateA = a.registration ? moment(a.registration.date).valueOf() : 0;
    const dateB = b.registration ? moment(b.registration.date).valueOf() : 0;
    if (dateA !== dateB) return dateB - dateA;
  }
  return formatUserFullName(a.user).localeCompare(formatUserFullName(b.user), undefined, { sensitivity: 'base' });
}

function Badge({ children, tone }: { children: ReactNode; tone: 'success' | 'warning' | 'muted' | 'critical' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap',
        tone === 'success' && 'border-success/40 bg-success/10 text-success',
        tone === 'warning' && 'border-amber-300/70 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
        tone === 'muted' && 'border-border bg-background text-muted-foreground',
        tone === 'critical' && 'border-critical/40 bg-critical/10 text-critical',
      )}
    >
      {children}
    </span>
  );
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

export const Participants = ({ event, competition, registrations, initialPool }: IParticipants) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/pool');
  const { data: session } = useSession();
  const compId = competition.id ?? '';

  const [pool, setPool] = useState<PoolMember[]>(initialPool);
  const [view, setView] = useState<ViewFilter>('signedUp');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('name');
  const [query, setQuery] = useState('');
  const [busyUsernames, setBusyUsernames] = useState<Set<string>>(new Set());
  const [confirmRow, setConfirmRow] = useState<PoolRow | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  const rows = useMemo(() => buildPoolRows(competition, registrations, pool), [competition, registrations, pool]);
  const counts = useMemo(() => countPool(rows), [rows]);
  const bulkCandidates = useMemo(() => rows.filter(row => row.eligible && row.signedUp && !row.inPool), [rows]);

  const visibleRows = useMemo(() => {
    return rows
      .filter(row => row.eligible || row.inPool)
      .filter(row => matchesView(row, view))
      .filter(row => statusFilter === 'all' || row.registration?.status === statusFilter)
      .filter(row => userMatchesNameQuery(row.user, query))
      .sort((a, b) => compareRows(a, b, sort));
  }, [rows, view, statusFilter, query, sort]);

  const setBusy = (username: string, busy: boolean) => {
    setBusyUsernames(prev => {
      const next = new Set(prev);
      if (busy) next.add(username);
      else next.delete(username);
      return next;
    });
  };

  const addToPool = async (row: PoolRow, silent = false): Promise<boolean> => {
    const { username } = row.user;
    setBusy(username, true);
    try {
      await createCompetitionParticipation(compId, username, session);
      setPool(prev => (prev.some(member => member.username === username) ? prev : [...prev, { username, imageUrl: row.user.imageUrl, firstName: row.user.firstName, lastName: row.user.lastName }]));
      if (!silent) toast.success(t('toastAdded', { name: formatUserFullName(row.user) }));
      return true;
    } catch (error: unknown) {
      if (!silent) toast.error(error instanceof Error ? error.message : t('toastFailed'));
      return false;
    } finally {
      setBusy(username, false);
    }
  };

  const removeFromPool = async (row: PoolRow) => {
    const { username } = row.user;
    setBusy(username, true);
    try {
      await deleteCompetitionParticipation(compId, username, session);
      setPool(prev => prev.filter(member => member.username !== username));
      toast.success(t('toastRemoved', { name: formatUserFullName(row.user) }));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('toastFailed'));
    } finally {
      setBusy(username, false);
    }
  };

  const handleAddClicked = (row: PoolRow) => {
    if (row.signedUp) {
      void addToPool(row);
    } else {
      setConfirmRow(row);
    }
  };

  const handleBulkConfirm = async () => {
    const targets = bulkCandidates;
    let succeeded = 0;
    setBulkProgress({ done: 0, total: targets.length });

    await runWithConcurrency(targets, BULK_CONCURRENCY, async row => {
      if (await addToPool(row, true)) succeeded++;
      setBulkProgress(prev => (prev ? { ...prev, done: prev.done + 1 } : prev));
    });

    setBulkProgress(null);
    setBulkOpen(false);
    const failed = targets.length - succeeded;
    if (failed === 0) toast.success(t('toastBulkAdded', { count: succeeded }));
    else toast.warning(t('toastBulkPartial', { count: succeeded, failed }));
  };

  const chips: { key: ViewFilter; label: string; value: number; warning?: boolean; hidden?: boolean }[] = [
    { key: 'signedUp', label: t('chipSignedUp'), value: counts.signedUp },
    { key: 'inPool', label: t('chipInPool'), value: counts.inPool },
    { key: 'notAdded', label: t('chipNotAdded'), value: counts.signedUpNotInPool, warning: counts.signedUpNotInPool > 0 },
    { key: 'withoutSignUp', label: t('chipWithoutSignUp'), value: counts.inPoolWithoutSignUp, warning: true, hidden: counts.inPoolWithoutSignUp === 0 },
  ];

  const statusBadge = (row: PoolRow) => {
    switch (row.registration?.status) {
      case EventRegistrationStatus.PENDING:
        return <Badge tone="muted">{t('badgePending')}</Badge>;
      case EventRegistrationStatus.DENIED:
        return <Badge tone="critical">{t('badgeDenied')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="flex flex-col gap-4 text-sm">
        <Alert>
          <IconInfoCircle className="h-4 w-4" stroke={2} aria-hidden />
          <AlertDescription className="text-muted-foreground">
            <p>{t('intro', { competition: competition.name })}</p>
            {counts.hiddenIneligible > 0 && <p className="mt-1 text-xs">{t('noteHiddenIneligible', { count: counts.hiddenIneligible })}</p>}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {chips
            .filter(chip => !chip.hidden)
            .map(chip => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setView(chip.key)}
                aria-pressed={view === chip.key}
                className={cn(
                  'flex min-w-0 flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors',
                  'border-border/60 bg-secondary-light/70 hover:border-primary/50',
                  chip.warning && 'border-warning/50 bg-warning/10',
                  view === chip.key && 'border-primary ring-1 ring-primary',
                )}
              >
                <span className="text-lg font-semibold leading-tight tabular-nums">{chip.value}</span>
                <span className="truncate text-xs text-muted-foreground">{chip.label}</span>
              </button>
            ))}
        </div>

        {bulkCandidates.length > 0 && (
          <Button type="button" variant="action" className="h-10 w-full gap-2 rounded-lg sm:w-fit" onClick={() => setBulkOpen(true)}>
            <IconUsersPlus className="h-4 w-4" stroke={2} aria-hidden />
            {t('btnAddAllSignedUp', { count: bulkCandidates.length })}
          </Button>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:min-w-48">
            <label className="mb-1 block text-xs text-muted-foreground" htmlFor="pool-search">
              {t('filterSearchLabel')}
            </label>
            <Input id="pool-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('filterSearchPlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <div className="col-span-2 min-w-0 sm:w-56">
              <span className="mb-1 block text-xs text-muted-foreground">{t('filterViewLabel')}</span>
              <Select value={view} onValueChange={v => setView(v as ViewFilter)}>
                <SelectTrigger aria-label={t('filterViewLabel')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signedUp">{t('filterViewSignedUp')}</SelectItem>
                  <SelectItem value="inPool">{t('filterViewInPool')}</SelectItem>
                  <SelectItem value="notAdded">{t('filterViewNotAdded')}</SelectItem>
                  <SelectItem value="withoutSignUp">{t('filterViewWithoutSignUp')}</SelectItem>
                  <SelectItem value="all">{t('filterViewAll')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 sm:w-40">
              <span className="mb-1 block text-xs text-muted-foreground">{t('filterStatusLabel')}</span>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger aria-label={t('filterStatusLabel')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filterStatusAll')}</SelectItem>
                  <SelectItem value={EventRegistrationStatus.APPROVED}>{t('filterStatusApproved')}</SelectItem>
                  <SelectItem value={EventRegistrationStatus.PENDING}>{t('filterStatusPending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 sm:w-40">
              <span className="mb-1 block text-xs text-muted-foreground">{t('sortLabel')}</span>
              <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
                <SelectTrigger aria-label={t('sortLabel')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('sortName')}</SelectItem>
                  <SelectItem value="country">{t('sortCountry')}</SelectItem>
                  <SelectItem value="date">{t('sortDate')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {view === 'all' && (
          <p className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
            <IconAlertTriangle className="mt-px h-4 w-4 shrink-0" stroke={2} aria-hidden />
            {t('noteViewAll')}
          </p>
        )}

        <p className="text-xs text-muted-foreground">{t('textResultCount', { count: visibleRows.length })}</p>

        {registrations.length === 0 && pool.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title={t('textNoRegistrations')} />
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title={view === 'signedUp' && !query ? t('textNoSignUps') : t('textNoFilterMatch')} description={view === 'signedUp' && !query ? t('textNoSignUpsHint') : undefined} />
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-secondary-light/40">
            {visibleRows.map(row => {
              const busy = busyUsernames.has(row.user.username);
              return (
                <li key={row.user.username} className={cn('flex min-w-0 items-center gap-3 px-3 py-2.5', row.inPool && 'bg-success/5')}>
                  <Link href={`${routeUsers}/${row.user.username}`} className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <img src={row.user.imageUrl || imgUserDefaultImg} alt="" className="h-full w-full object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      {event.showUserCountryFlag && row.user.countryCode && <ReactCountryFlag countryCode={row.user.countryCode} svg className="shrink-0" aria-hidden />}
                      <Link href={`${routeUsers}/${row.user.username}`} className="truncate font-medium hover:underline">
                        {formatUserFullName(row.user)}
                      </Link>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.signedUp ? <Badge tone="success">{t('badgeSignedUp')}</Badge> : <Badge tone="warning">{t('badgeNotSignedUp')}</Badge>}
                      {row.inPool && <Badge tone="muted">{t('badgeInPool')}</Badge>}
                      {statusBadge(row)}
                    </div>
                  </div>

                  {row.inPool ? (
                    <Button type="button" variant="outline" size="sm" className="h-9 shrink-0 gap-1 rounded-lg px-3" disabled={busy} onClick={() => void removeFromPool(row)}>
                      <IconMinus className="h-4 w-4" stroke={2} aria-hidden />
                      <span className="sr-only min-[400px]:not-sr-only">{t('btnRemove')}</span>
                    </Button>
                  ) : (
                    <Button type="button" variant={row.signedUp ? 'action' : 'actionWarning'} size="sm" className="h-9 shrink-0 gap-1 rounded-lg px-3" disabled={busy} onClick={() => handleAddClicked(row)}>
                      <IconPlus className="h-4 w-4" stroke={2} aria-hidden />
                      <span className="sr-only min-[400px]:not-sr-only">{t('btnAdd')}</span>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={confirmRow !== null} onOpenChange={open => !open && setConfirmRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dlgWithoutSignUpTitle')}</DialogTitle>
            <DialogDescription>{confirmRow && t('dlgWithoutSignUpText', { name: formatUserFullName(confirmRow.user), competition: competition.name })}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="actionWarning"
              className="rounded-lg"
              onClick={() => {
                const row = confirmRow;
                setConfirmRow(null);
                if (row) void addToPool(row);
              }}
            >
              {t('btnAddAnyway')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={open => !bulkProgress && setBulkOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dlgBulkTitle')}</DialogTitle>
            <DialogDescription>{t('dlgBulkText', { count: bulkCandidates.length, competition: competition.name })}</DialogDescription>
          </DialogHeader>
          {bulkProgress && (
            <div className="flex flex-col gap-1.5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${bulkProgress.total ? (bulkProgress.done / bulkProgress.total) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">{t('dlgBulkProgress', { done: bulkProgress.done, total: bulkProgress.total })}</p>
            </div>
          )}
          <div className="flex flex-row items-center justify-end gap-2">
            <Button type="button" variant="action" className="rounded-lg" disabled={!!bulkProgress || bulkCandidates.length === 0} onClick={() => void handleBulkConfirm()}>
              {t('btnAddAll')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
