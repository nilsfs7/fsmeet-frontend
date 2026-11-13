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
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { imgVerifiedCheckmark } from '@/domain/constants/images';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { menuCountries } from '@/domain/constants/menus/menu-countries';
import { menuGender } from '@/domain/constants/menus/menu-gender';

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
const WFFA_TABLE_CLASS = 'table-fixed w-full min-w-160';

const WFFA_HEAD_PAD = 'px-3 py-2.5 align-top h-auto! min-h-10';
const WFFA_CELL_PAD = 'py-2.5 px-3';

const wffaCol = {
  user: 'w-[36%] min-w-44',
  wffaId: 'w-[38%] min-w-40',
  actions: 'w-[18%] min-w-26',
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
    <TableCell className={cn(WFFA_CELL_PAD, 'align-top', wffaCol.user)}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={profileHref} className="font-medium text-foreground underline-offset-2 hover:text-brand-strong hover:underline">
            {user.username}
          </Link>
          {verified && <img src={imgVerifiedCheckmark} alt="" className="h-4 w-4 shrink-0" width={16} height={16} />}
        </div>
        <span className="text-muted-foreground">{user.firstName}</span>
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
  const t = useTranslations('/wffa/ids');
  if (items.length === 0) {
    return (
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
          {title}
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{items.length}</span>
        </h2>
        <p className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">{t('noEntries')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
        {title}
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">{items.length}</span>
      </h2>
      <div>
        <Table className={WFFA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/70">
              <TableHead className={cn(WFFA_HEAD_PAD, wffaCol.user)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left uppercase hover:text-foreground"
                  onClick={() => onSortColumnClick('user')}
                  title={sortColumn === 'user' ? (sortDescending ? t('sortUserAsc') : t('sortUserDesc')) : t('sortByUser')}
                >
                  {t('colUser')}
                  {sortColumn === 'user' && (sortDescending ? <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden /> : <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />)}
                </button>
              </TableHead>
              <TableHead className={cn(WFFA_HEAD_PAD, wffaCol.wffaId)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left uppercase hover:text-foreground"
                  onClick={() => onSortColumnClick('wffaId')}
                  title={sortColumn === 'wffaId' ? (sortDescending ? t('sortIdAsc') : t('sortIdDesc')) : t('sortById')}
                >
                  {t('colId')}
                  {sortColumn === 'wffaId' && (sortDescending ? <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden /> : <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />)}
                </button>
              </TableHead>
              <TableHead className={cn('text-right', WFFA_HEAD_PAD, wffaCol.actions)}>{t('colActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => {
              const dirty = item.user.wffaId !== item.newWffaId;
              return (
                <TableRow key={item.user.username} className="border-border/70">
                  <UserCell user={item.user} />
                  <TableCell className={cn(WFFA_CELL_PAD, 'align-top', wffaCol.wffaId)}>
                    <Input
                      className="w-full max-w-48"
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
  const t = useTranslations('/wffa/ids');
  const { data: session, status } = useSession();

  const [usersMap, setUsersMap] = useState<UserWffaRow[]>(() => initialUsers.map(user => ({ user, newWffaId: user.wffaId || '' })));
  const [filterCountry, setFilterCountry] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterName, setFilterName] = useState('');
  const [sort, setSort] = useState<{ column: WffaSortColumn; descending: boolean }>({ column: 'user', descending: false });
  const countryFilterMenus = useMemo(() => [{ text: t('allCountries'), value: '' }, ...menuCountries], [t]);
  const genderFilterMenus = useMemo(() => [{ text: t('allGenders'), value: '' }, ...menuGender], [t]);

  const loadFreestylers = useCallback(async () => {
    try {
      const data = await getUsers(UserType.FREESTYLER);
      setUsersMap(data.map(user => ({ user, newWffaId: user.wffaId || '' })));
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? t('toastReloadFailed'));
    }
  }, [t]);

  const handleWffaIdChanged = (username: string, wffaId: string) => {
    const upper = wffaId.toUpperCase();
    setUsersMap(prev => prev.map(item => (item.user.username === username ? { ...item, newWffaId: upper } : item)));
  };

  const handleSaveUserClicked = async (user: User) => {
    const item = usersMap.find(i => i.user.username === user.username);
    if (!item) return;

    try {
      await updateUserWffaId(session, user.username, item.newWffaId);
      toast.success(t('toastUpdated', { username: user.username, firstName: user.firstName ?? '' }));
      setUsersMap(prev => prev.map(row => (row.user.username === user.username ? { user: { ...row.user, wffaId: item.newWffaId }, newWffaId: item.newWffaId } : row)));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      await loadFreestylers();
    }
  };

  const filteredUsersMap = useMemo(() => usersMap.filter(item => matchesFilters(item.user, filterCountry, filterGender, filterName)), [usersMap, filterCountry, filterGender, filterName]);

  const { withoutSavedId, withSavedId } = useMemo(() => {
    const without = filteredUsersMap.filter(item => !item.user.wffaId);
    const with_ = filteredUsersMap.filter(item => !!item.user.wffaId);
    return { withoutSavedId: without, withSavedId: with_ };
  }, [filteredUsersMap]);

  const sortedWithoutSavedId = useMemo(() => sortUserWffaRows(withoutSavedId, sort.column, sort.descending), [withoutSavedId, sort.column, sort.descending]);
  const sortedWithSavedId = useMemo(() => sortUserWffaRows(withSavedId, sort.column, sort.descending), [withSavedId, sort.column, sort.descending]);

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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-content flex-col gap-8 text-sm">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 shadow-xs sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-56">
              <span className="text-xs font-medium text-muted-foreground">{t('filterName')}</span>
              <Input placeholder={t('search')} value={filterName} onChange={e => setFilterName(e.target.value)} className="w-full" />
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:max-w-[min(100%,14rem)]">
              <span className="text-xs font-medium text-muted-foreground">{t('filterCountry')}</span>
              <ComboBox menus={countryFilterMenus} value={filterCountry} searchEnabled label={t('filterCountry')} className="w-full max-w-none" onChange={(value: string) => setFilterCountry(value)} />
            </div>
            <div className="flex min-w-0 flex-col gap-1 sm:max-w-48">
              <span className="text-xs font-medium text-muted-foreground">{t('filterGender')}</span>
              <ComboBox
                menus={genderFilterMenus}
                value={filterGender}
                searchEnabled={false}
                label={t('filterGender')}
                className="w-full max-w-none"
                onChange={(value: string) => setFilterGender(value)}
              />
            </div>
          </div>

          <WffaIdTableSection
            title={t('withoutId')}
            items={sortedWithoutSavedId}
            onWffaIdChange={handleWffaIdChanged}
            onSave={handleSaveUserClicked}
            sortColumn={sort.column}
            sortDescending={sort.descending}
            onSortColumnClick={handleSortColumnClick}
          />
          <WffaIdTableSection
            title={t('withId')}
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
