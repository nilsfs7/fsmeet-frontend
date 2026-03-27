'use client';

import { useCallback, useMemo, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import ComboBox from '@/components/common/combo-box';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/domain/types/user';
import { getUsers, updateUserWffaId } from '@/infrastructure/clients/user.client';
import { UserType } from '@/domain/enums/user-type';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { imgVerifiedCheckmark } from '@/domain/constants/images';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { menuGender } from '@/domain/constants/menus/menu-gender';

const MENU_COUNTRY_FILTER = [{ text: 'All countries', value: '' }, ...menuCountries];
const MENU_GENDER_FILTER = [{ text: 'All', value: '' }, ...menuGender];

function matchesNameFilter(user: User, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const first = (user.firstName ?? '').toLowerCase();
  const last = (user.lastName ?? '').toLowerCase();
  return first.includes(q) || last.includes(q) || `${first} ${last}`.trim().includes(q);
}

function matchesFilters(user: User, filterCountry: string, filterGender: string, filterName: string): boolean {
  if (filterCountry && user.countryCode !== filterCountry) return false;
  if (filterGender && user.gender !== filterGender) return false;
  if (!matchesNameFilter(user, filterName)) return false;
  return true;
}

/** Align with /wffa/visa and /admin/verification table layout */
const WFFA_TABLE_CLASS = 'table-fixed w-full min-w-[40rem] border-separate border-spacing-x-3 border-spacing-y-0';

const WFFA_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const WFFA_CELL_PAD = 'py-2.5 px-3';

const wffaCol = {
  user: 'w-[36%] min-w-[11rem]',
  wffaId: 'w-[38%] min-w-[10rem]',
  actions: 'w-[18%] min-w-[6.5rem]',
} as const;

type UserWffaRow = { user: User; newWffaId: string };

type WffaSortColumn = 'user' | 'wffaId';

function sortUserWffaRows(rows: UserWffaRow[], column: WffaSortColumn, descending: boolean): UserWffaRow[] {
  const list = [...rows];
  list.sort((a, b) => {
    if (column === 'user') {
      const cmp = a.user.username.localeCompare(b.user.username);
      if (cmp !== 0) return descending ? -cmp : cmp;
      return (a.newWffaId || '').localeCompare(b.newWffaId || '', undefined, { numeric: true });
    }
    const cmp = (a.newWffaId || '').localeCompare(b.newWffaId || '', undefined, { numeric: true });
    if (cmp !== 0) return descending ? -cmp : cmp;
    return a.user.username.localeCompare(b.user.username);
  });
  return list;
}

interface IWffaIdEditorProps {
  users: User[];
}

function UserCell({ user }: { user: User }) {
  const profileHref = `${routeUsers}/${user.username}`;
  const verified = user.verificationState === UserVerificationState.VERIFIED;
  return (
    <TableCell className={cn(WFFA_CELL_PAD, 'text-primary align-top', wffaCol.user)}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={profileHref} className="underline hover:text-primary/80">
            {user.username}
          </Link>
          {verified && <img src={imgVerifiedCheckmark} alt="" className="h-6 w-6 shrink-0" width={16} height={16} />}
        </div>
        <span className="text-primary/90">({user.firstName})</span>
      </div>
    </TableCell>
  );
}

function WffaIdTableSection({
  title,
  items,
  onWffaIdChange,
  onSave,
  sortColumn,
  sortDescending,
  onSortColumnClick,
}: {
  title: string;
  items: UserWffaRow[];
  onWffaIdChange: (username: string, wffaId: string) => void;
  onSave: (user: User) => void;
  sortColumn: WffaSortColumn;
  sortDescending: boolean;
  onSortColumnClick: (column: WffaSortColumn) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-center text-base font-semibold text-primary">{title}</h2>
        <p className="text-center text-sm text-primary/70">No entries</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-center text-base font-semibold text-primary">{title}</h2>
      <div className="rounded-md border border-secondary-dark bg-background">
        <Table className={WFFA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-primary', WFFA_HEAD_PAD, wffaCol.user)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left font-medium hover:text-primary/80"
                  onClick={() => onSortColumnClick('user')}
                  title={sortColumn === 'user' ? (sortDescending ? 'Sort user ascending' : 'Sort user descending') : 'Sort by user'}
                >
                  User
                  {sortColumn === 'user' &&
                    (sortDescending ? <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden /> : <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />)}
                </button>
              </TableHead>
              <TableHead className={cn('text-primary', WFFA_HEAD_PAD, wffaCol.wffaId)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left font-medium hover:text-primary/80"
                  onClick={() => onSortColumnClick('wffaId')}
                  title={sortColumn === 'wffaId' ? (sortDescending ? 'Sort ID ascending' : 'Sort ID descending') : 'Sort by Freestyler ID'}
                >
                  Freestyler ID
                  {sortColumn === 'wffaId' &&
                    (sortDescending ? <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden /> : <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />)}
                </button>
              </TableHead>
              <TableHead className={cn('text-right text-primary', WFFA_HEAD_PAD, wffaCol.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => {
              const dirty = item.user.wffaId !== item.newWffaId;
              return (
                <TableRow key={item.user.username} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                  <UserCell user={item.user} />
                  <TableCell className={cn(WFFA_CELL_PAD, 'text-primary align-top', wffaCol.wffaId)}>
                    <Input
                      className="w-full max-w-[12rem]"
                      value={item.newWffaId}
                      onChange={e => {
                        onWffaIdChange(item.user.username, e.currentTarget.value);
                      }}
                    />
                  </TableCell>
                  <TableCell className={cn(WFFA_CELL_PAD, 'text-right align-top', wffaCol.actions)}>
                    <div className="flex justify-end gap-1">{dirty && <ActionButton action={Action.SAVE} onClick={() => onSave(item.user)} />}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const WffaIdEditor = ({ users: initialUsers }: IWffaIdEditorProps) => {
  const { data: session, status } = useSession();

  const [usersMap, setUsersMap] = useState<UserWffaRow[]>(() => initialUsers.map(user => ({ user, newWffaId: user.wffaId || '' })));
  const [filterCountry, setFilterCountry] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterName, setFilterName] = useState('');
  const [sort, setSort] = useState<{ column: WffaSortColumn; descending: boolean }>({ column: 'user', descending: false });

  const loadFreestylers = useCallback(async () => {
    try {
      const data = await getUsers(UserType.FREESTYLER);
      setUsersMap(data.map(user => ({ user, newWffaId: user.wffaId || '' })));
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Failed to reload users.');
    }
  }, []);

  const handleWffaIdChanged = (username: string, wffaId: string) => {
    const upper = wffaId.toUpperCase();
    setUsersMap(prev => prev.map(item => (item.user.username === username ? { ...item, newWffaId: upper } : item)));
  };

  const handleSaveUserClicked = async (user: User) => {
    const item = usersMap.find(i => i.user.username === user.username);
    if (!item) return;

    try {
      await updateUserWffaId(session, user.username, item.newWffaId);
      toast.success(`Freestyler ID for ${user.username} (${user.firstName}) updated.`);
      setUsersMap(prev => prev.map(row => (row.user.username === user.username ? { user: { ...row.user, wffaId: item.newWffaId }, newWffaId: item.newWffaId } : row)));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      await loadFreestylers();
    }
  };

  const filteredUsersMap = useMemo(
    () => usersMap.filter(item => matchesFilters(item.user, filterCountry, filterGender, filterName)),
    [usersMap, filterCountry, filterGender, filterName],
  );

  const { withoutSavedId, withSavedId } = useMemo(() => {
    const without = filteredUsersMap.filter(item => !item.user.wffaId);
    const with_ = filteredUsersMap.filter(item => !!item.user.wffaId);
    return { withoutSavedId: without, withSavedId: with_ };
  }, [filteredUsersMap]);

  const sortedWithoutSavedId = useMemo(
    () => sortUserWffaRows(withoutSavedId, sort.column, sort.descending),
    [withoutSavedId, sort.column, sort.descending],
  );
  const sortedWithSavedId = useMemo(
    () => sortUserWffaRows(withSavedId, sort.column, sort.descending),
    [withSavedId, sort.column, sort.descending],
  );

  const handleSortColumnClick = useCallback((column: WffaSortColumn) => {
    setSort(prev => {
      if (prev.column === column) return { ...prev, descending: !prev.descending };
      return { column, descending: false };
    });
  }, []);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto pb-4">
        <div className="rounded-lg border border-primary bg-secondary-light p-2 text-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-[14rem]">
              <span className="text-xs font-medium text-primary/80">Name</span>
              <Input placeholder="Search…" value={filterName} onChange={e => setFilterName(e.target.value)} className="w-full" />
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:max-w-[min(100%,14rem)]">
              <span className="text-xs font-medium text-primary/80">Country</span>
              <ComboBox menus={MENU_COUNTRY_FILTER} value={filterCountry} searchEnabled label="Country" className="w-full max-w-none" onChange={(value: string) => setFilterCountry(value)} />
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:max-w-[12rem]">
              <span className="text-xs font-medium text-primary/80">Gender</span>
              <ComboBox menus={MENU_GENDER_FILTER} value={filterGender} searchEnabled={false} label="Gender" className="w-full max-w-none" onChange={(value: string) => setFilterGender(value)} />
            </div>
          </div>

          <WffaIdTableSection
            title="Without Freestyler ID"
            items={sortedWithoutSavedId}
            onWffaIdChange={handleWffaIdChanged}
            onSave={handleSaveUserClicked}
            sortColumn={sort.column}
            sortDescending={sort.descending}
            onSortColumnClick={handleSortColumnClick}
          />
          <WffaIdTableSection
            title="With Freestyler ID"
            items={sortedWithSavedId}
            onWffaIdChange={handleWffaIdChanged}
            onSave={handleSaveUserClicked}
            sortColumn={sort.column}
            sortDescending={sort.descending}
            onSortColumnClick={handleSortColumnClick}
          />
        </div>
      </div>
    </>
  );
};
