'use client';

import LoadingSpinner from '@/components/animation/loading-spinner';
import ActionButton from '@/components/common/action-button';
import { routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getLicenses, updateLicense } from '@/infrastructure/clients/license.client';
import { getUsers } from '@/infrastructure/clients/user.client';
import { License } from '@/domain/types/license';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

/** Align with /wffa/visa table layout */
const LICENSE_TABLE_CLASS = 'table-fixed w-full min-w-[28rem] border-separate border-spacing-x-3 border-spacing-y-0';

const LICENSE_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const LICENSE_CELL_PAD = 'py-2.5 px-3';

const licenseCol = {
  user: 'w-[55%] min-w-[12rem]',
  amount: 'w-[10ch] min-w-[10ch] text-center',
  actions: 'w-[22%] min-w-[8.5rem]',
} as const;

type UserNameMeta = { firstName?: string; lastName?: string };

function formatLicenseUserLabel(username: string, meta?: UserNameMeta): string {
  const name = [meta?.firstName, meta?.lastName].filter(Boolean).join(' ').trim();
  return name ? `${username} (${name})` : username;
}

function matchesUserFilter(license: License, query: string, meta?: UserNameMeta): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (license.username.toLowerCase().includes(q)) return true;
  const first = (meta?.firstName ?? '').toLowerCase();
  const last = (meta?.lastName ?? '').toLowerCase();
  return first.includes(q) || last.includes(q) || `${first} ${last}`.trim().includes(q);
}

type LicenseSortColumn = 'user' | 'amount';

function sortLicenses(licenses: License[], column: LicenseSortColumn, descending: boolean): License[] {
  const list = [...licenses];
  list.sort((a, b) => {
    if (column === 'user') {
      const cmp = a.username.localeCompare(b.username);
      if (cmp !== 0) return descending ? -cmp : cmp;
      return a.amountEventLicenses - b.amountEventLicenses;
    }
    const cmp = a.amountEventLicenses - b.amountEventLicenses;
    if (cmp !== 0) return descending ? -cmp : cmp;
    return a.username.localeCompare(b.username);
  });
  return list;
}

export const LicensesEditor = () => {
  const { data: session, status } = useSession();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [userMetaByUsername, setUserMetaByUsername] = useState<Record<string, UserNameMeta>>({});
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [sort, setSort] = useState<{ column: LicenseSortColumn; descending: boolean }>({ column: 'user', descending: false });

  const loadLicenses = useCallback(
    async (showInitialSpinner: boolean) => {
      if (status !== 'authenticated' || !session) {
        if (showInitialSpinner) setLoading(false);
        return;
      }
      if (showInitialSpinner) setLoading(true);
      try {
        const data = await getLicenses(session);
        setLicenses(data);
        try {
          const allUsers = await getUsers();
          const meta: Record<string, UserNameMeta> = {};
          for (const u of allUsers) {
            meta[u.username] = { firstName: u.firstName, lastName: u.lastName };
          }
          setUserMetaByUsername(meta);
        } catch (err) {
          console.error(err);
          setUserMetaByUsername({});
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'Failed to load licenses.');
      } finally {
        if (showInitialSpinner) setLoading(false);
      }
    },
    [session, status],
  );

  const handleUpdateLicenseClicked = async (license: License, diff: number) => {
    const newAmount = license.amountEventLicenses + diff;
    if (newAmount >= 0 && newAmount < 100) {
      const lics = Array.from(licenses);
      lics.forEach(lic => {
        if (lic.username === license.username) {
          lic.amountEventLicenses = newAmount;
        }
      });
      setLicenses(lics);

      try {
        await updateLicense(session, license);
        toast.success(`Licenses for ${license.username} updated (${license.amountEventLicenses}).`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
        await loadLicenses(false);
      }
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }
    loadLicenses(true);
  }, [status, loadLicenses]);

  const filteredLicenses = useMemo(
    () => licenses.filter(lic => matchesUserFilter(lic, filterUser, userMetaByUsername[lic.username])),
    [licenses, filterUser, userMetaByUsername],
  );

  const sortedFilteredLicenses = useMemo(
    () => sortLicenses(filteredLicenses, sort.column, sort.descending),
    [filteredLicenses, sort.column, sort.descending],
  );

  const handleSortColumnClick = useCallback((column: LicenseSortColumn) => {
    setSort(prev => {
      if (prev.column === column) return { ...prev, descending: !prev.descending };
      return { column, descending: false };
    });
  }, []);

  if (loading || status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto pb-4">
        <div className="rounded-lg border border-primary bg-secondary-light p-2 text-sm">
          {licenses.length > 0 && (
            <div className="mb-4 flex flex-col gap-1 sm:max-w-[14rem]">
              <span className="text-xs font-medium text-primary/80">User</span>
              <Input
                placeholder="Search…"
                value={filterUser}
                onChange={e => setFilterUser(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {licenses.length === 0 ? (
            <p className="text-center text-sm text-primary/70">No entries</p>
          ) : filteredLicenses.length === 0 ? (
            <p className="text-center text-sm text-primary/70">No matching entries</p>
          ) : (
            <div className="rounded-md border border-secondary-dark bg-background">
              <Table className={LICENSE_TABLE_CLASS}>
                <TableHeader>
                  <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className={cn('text-primary', LICENSE_HEAD_PAD, licenseCol.user)}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-left font-medium hover:text-primary/80"
                        onClick={() => handleSortColumnClick('user')}
                        title={sort.column === 'user' ? (sort.descending ? 'Sort user ascending' : 'Sort user descending') : 'Sort by user'}
                      >
                        User
                        {sort.column === 'user' &&
                          (sort.descending ? (
                            <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                          ) : (
                            <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                          ))}
                      </button>
                    </TableHead>
                    <TableHead className={cn('text-primary text-center', LICENSE_HEAD_PAD, licenseCol.amount)} title="Event licenses">
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-1.5 font-medium hover:text-primary/80"
                        onClick={() => handleSortColumnClick('amount')}
                        title={sort.column === 'amount' ? (sort.descending ? 'Sort amount ascending' : 'Sort amount descending') : 'Sort by amount'}
                      >
                        Amount
                        {sort.column === 'amount' &&
                          (sort.descending ? (
                            <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                          ) : (
                            <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                          ))}
                      </button>
                    </TableHead>
                    <TableHead className={cn('text-right text-primary', LICENSE_HEAD_PAD, licenseCol.actions)}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="[&_tr:first-child_td]:pt-3">
                  {sortedFilteredLicenses.map(license => (
                    <TableRow key={license.username} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                      <TableCell className={cn(LICENSE_CELL_PAD, 'text-primary align-top', licenseCol.user)}>
                        <Link href={`${routeUsers}/${license.username}`} className="underline hover:text-primary/80">
                          {formatLicenseUserLabel(license.username, userMetaByUsername[license.username])}
                        </Link>
                      </TableCell>
                      <TableCell className={cn(LICENSE_CELL_PAD, 'text-primary align-top tabular-nums', licenseCol.amount)}>{license.amountEventLicenses}</TableCell>
                      <TableCell className={cn(LICENSE_CELL_PAD, 'text-right align-top', licenseCol.actions)}>
                        <div className="flex justify-end gap-1">
                          <ActionButton action={Action.ADD} onClick={() => handleUpdateLicenseClicked(license, 1)} />
                          <ActionButton action={Action.REMOVE} onClick={() => handleUpdateLicenseClicked(license, -1)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
