'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { IconAdjustmentsHorizontal, IconArrowsSort, IconMapPin, IconSearch, IconUsers } from '@tabler/icons-react';
import {
  type Column,
  type ColumnDef,
  ColumnFiltersState,
  type Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { countries } from 'countries-list';
import { UserType } from '@/domain/enums/user-type';
import { Gender } from '@/domain/enums/gender';
import { menuUserType } from '@/domain/constants/menus/menu-user-type';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { UserTypeIcon } from '@/components/user/user-type-icon';
import SocialLink from '@/components/user/social-link';
import { SocialPlatform } from '@/domain/enums/social-platform';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';

const ALL = '__all__' as const;

const COUNTRIES_MAP = countries as Record<string, { name: string }>;

interface IUsersList {
  columnData: ColumnInfo[];
}

export type UserInfo = {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
};

export type Location = {
  city: string;
  mapLink: string;
};

export type Socials = {
  fsm: string;
  insta: string;
  tikTok: string;
  youTube: string;
  website: string;
};

export type ColumnInfo = {
  user: UserInfo;
  country: string;
  /** Used for advanced filter only; no table column. */
  gender: string;
  userType: UserType;
  location: Location;
  socials: Socials;
};

function HeaderSortButton<TData>({ column, label, title, 'aria-label': ariaLabel }: { column: Column<TData, unknown>; label: string; title: string; 'aria-label': string }) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      title={title}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1.5 text-left font-medium hover:underline', 'whitespace-nowrap text-zinc-900 dark:text-zinc-100')}
    >
      {label}
      {sorted === 'asc' ? (
        <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : sorted === 'desc' ? (
        <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : (
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      )}
    </button>
  );
}

export const UsersList = ({ columnData }: IUsersList) => {
  const t = useTranslations('/users');
  const tEvents = useTranslations('/events');

  const selectTriggerClass = 'h-9 w-full min-w-0 rounded-xl border-border bg-background text-left';

  const countryOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const row of columnData) {
      const c = (row.country || '').trim().toUpperCase();
      if (c) seen.add(c);
    }
    return [...seen]
      .map(code => {
        const meta = COUNTRIES_MAP[code];
        return { code, name: meta?.name || code };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [columnData]);

  const userTypeOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const row of columnData) {
      if (row.userType) seen.add(row.userType);
    }
    const ordered = menuUserType.filter(item => seen.has(item.value)).map(item => ({ value: item.value, label: item.text }));
    const known = new Set(ordered.map(item => item.value));
    for (const value of seen) {
      if (!known.has(value)) ordered.push({ value, label: value });
    }
    return ordered;
  }, [columnData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const getColumnNameById = (columnId: string): string => {
    switch (columnId) {
      case 'user':
        return t('tblColumnName');
      case 'country':
        return t('tblColumnCountry');
      case 'userType':
        return t('tblColumnType');
      case 'location':
        return t('tblColumnLocation');
      case 'socials':
        return t('tblColumnSocials');
      default:
        return columnId;
    }
  };

  const columns: ColumnDef<ColumnInfo>[] = [
    {
      accessorKey: 'user',
      header: ({ column }) => <HeaderSortButton<ColumnInfo> column={column} label={t('tblColumnName')} title={t('tableSortByName')} aria-label={`${t('tblColumnName')}, ${t('tableSortByName')}`} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
            <div className="h-8 w-8">
              <img
                src={(row.getValue('user') as UserInfo).imageUrl ? (row.getValue('user') as UserInfo).imageUrl : imgUserDefaultImg}
                className="h-full w-full rounded-full bg-zinc-200 object-cover"
                alt=""
              />
            </div>
          </Link>
          <Link
            href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}
            className="font-medium text-primary underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="capitalize">{`${(row.getValue('user') as UserInfo).firstName} ${(row.getValue('user') as UserInfo).lastName}`}</span>
          </Link>
        </div>
      ),
      sortingFn: (rowA: Row<ColumnInfo>, rowB: Row<ColumnInfo>) => {
        const rowAVal = `${rowA.original.user.firstName} ${rowA.original.user.lastName}`;
        const rowBVal = `${rowB.original.user.firstName} ${rowB.original.user.lastName}`;

        if (rowAVal < rowBVal) {
          return -1;
        }
        if (rowAVal > rowBVal) {
          return 1;
        }

        return 0;
      },
      filterFn: (row: Row<ColumnInfo>, _columnId: string, filterValue: string): boolean => {
        const rowVal = `${row.original.user.firstName} ${row.original.user.lastName}`;

        if (rowVal.toLowerCase().includes((filterValue as string).toLowerCase())) {
          return true;
        }

        return false;
      },
      enableHiding: false,
    },

    {
      id: 'gender',
      accessorKey: 'gender',
      header: () => null,
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
      filterFn: (row, _columnId, filterValue): boolean => {
        if (filterValue == null || filterValue === '') return true;
        const g = (row.original.gender || '').toLowerCase();
        return g === String(filterValue).toLowerCase();
      },
    },

    {
      accessorKey: 'country',
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo> column={column} label={t('tblColumnCountry')} title={t('tableSortByCountry')} aria-label={`${t('tblColumnCountry')}, ${t('tableSortByCountry')}`} />
      ),
      cell: ({ row }) =>
        row.getValue('country') &&
        (row.getValue('country') as string) !== '--' && (
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap text-zinc-700">{(row.getValue('country') as string).toUpperCase()}</div>
            <div className="h-8 w-8">
              <ReactCountryFlag
                className="h-full w-full"
                countryCode={row.getValue('country') as string}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                }}
                title={row.getValue('country') as string}
              />
            </div>
          </div>
        ),
      sortingFn: (rowA, rowB) => {
        const a = (rowA.getValue('country') as string) || '';
        const b = (rowB.getValue('country') as string) || '';
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
      },
      filterFn: (row, _columnId, filterValue): boolean => {
        if (filterValue == null || filterValue === '') return true;
        const c = (row.original.country || '').trim().toUpperCase();
        return c === String(filterValue).trim().toUpperCase();
      },
    },

    {
      accessorKey: 'userType',
      header: () => t('tblColumnType'),
      cell: ({ row }) => <UserTypeIcon userType={row.getValue('userType') as UserType} variant="tile" />,
      enableSorting: false,
      filterFn: (row, _columnId, filterValue): boolean => {
        if (filterValue == null || filterValue === '') return true;
        return row.original.userType === filterValue;
      },
    },

    {
      accessorKey: 'location',
      header: () => t('tblColumnLocation'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {(row.getValue('location') as Location).city && (
            <Link href={(row.getValue('location') as Location).mapLink}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <IconMapPin className="h-5 w-5" stroke={1.75} aria-hidden />
              </span>
            </Link>
          )}
        </div>
      ),
      enableSorting: false,
    },

    {
      accessorKey: 'socials',
      header: () => t('tblColumnSocials'),
      cell: ({ row }) => (
        <div className="inline-flex flex-nowrap items-center gap-1.5">
          {(row.getValue('socials') as Socials).fsm && <SocialLink platform={SocialPlatform.FSMEET} path={(row.getValue('socials') as Socials).fsm} showPath={false} />}
          {(row.getValue('socials') as Socials).insta && <SocialLink platform={SocialPlatform.INSTAGRAM} path={(row.getValue('socials') as Socials).insta} showPath={false} />}
          {(row.getValue('socials') as Socials).tikTok && <SocialLink platform={SocialPlatform.TIKTOK} path={(row.getValue('socials') as Socials).tikTok} showPath={false} />}
          {(row.getValue('socials') as Socials).youTube && <SocialLink platform={SocialPlatform.YOUTUBE} path={(row.getValue('socials') as Socials).youTube} showPath={false} />}
          {(row.getValue('socials') as Socials).website && <SocialLink platform={SocialPlatform.WEBSITE} path={(row.getValue('socials') as Socials).website} showPath={false} />}
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: columnData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 100 },
      columnVisibility: {
        gender: false,
      },
    },
  });

  const hasHiddenColumns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(c => c.getCanHide())
        .some(c => !c.getIsVisible()),
    [table, columnVisibility],
  );

  const countryFilterActive = Boolean(table.getColumn('country')?.getFilterValue());
  const genderFilterActive = Boolean(table.getColumn('gender')?.getFilterValue());
  const userTypeFilterActive = Boolean(table.getColumn('userType')?.getFilterValue());
  const hasAdvancedFilterActive = countryFilterActive || genderFilterActive || userTypeFilterActive;
  const showAdvancedDot = hasHiddenColumns || hasAdvancedFilterActive;

  const clearAdvancedFilters = () => {
    table.getColumn('country')?.setFilterValue(undefined);
    table.getColumn('gender')?.setFilterValue(undefined);
    table.getColumn('userType')?.setFilterValue(undefined);
  };

  const advancedFilterCount = [countryFilterActive, genderFilterActive, userTypeFilterActive].filter(Boolean).length;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const isVisible = (id: string) => table.getColumn(id)?.getIsVisible() ?? true;

  const typeLabel = (value: string) => userTypeOptions.find(o => o.value === value)?.label || value;

  const sortValue = sorting[0] ? `${sorting[0].id}-${sorting[0].desc ? 'desc' : 'asc'}` : 'user-asc';
  const handleSortChange = (value: string) => {
    const [id, dir] = value.split('-');
    setSorting([{ id, desc: dir === 'desc' }]);
  };

  return (
    <div className={cn('text-sm flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto scrollbar-none pb-2')}>
      {/* toolbar */}
      <div className="rounded-2xl border border-border bg-background p-2 shadow-xs">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
            <Input
              id="users-filter-name"
              type="search"
              aria-label={t('tblColumnName')}
              placeholder={t('inputSearchPlaceholder')}
              value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
              onChange={e => {
                table.getColumn('user')?.setFilterValue(e.target.value);
              }}
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full rounded-xl pl-9"
            />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Select value={sortValue} onValueChange={handleSortChange}>
              <SelectTrigger className="h-10 min-w-0 flex-1 justify-start gap-2 rounded-xl sm:w-48 sm:flex-none" aria-label={t('sortLabel')}>
                <IconArrowsSort className="h-4 w-4 shrink-0 text-muted-foreground" stroke={1.75} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-left">
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user-asc">{t('sortNameAsc')}</SelectItem>
                <SelectItem value="user-desc">{t('sortNameDesc')}</SelectItem>
                <SelectItem value="country-asc">{t('sortCountryAsc')}</SelectItem>
                <SelectItem value="country-desc">{t('sortCountryDesc')}</SelectItem>
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => setAdvancedOpen(v => !v)}
              aria-expanded={advancedOpen}
              aria-label={tEvents('searchAdvancedLabel')}
              className={cn(
                'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors',
                advancedOpen || showAdvancedDot ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-border bg-background text-foreground hover:bg-muted',
              )}
            >
              <IconAdjustmentsHorizontal className="h-4 w-4" stroke={1.75} aria-hidden />
              <span>{tEvents('searchAdvancedLabel')}</span>
              {advancedFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-2xs font-semibold text-brand-foreground">{advancedFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        {advancedOpen && (
          <div className="mt-2 space-y-4 border-t border-border/70 px-1 pb-1 pt-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterCountry')}</div>
                <Select value={(table.getColumn('country')?.getFilterValue() as string | undefined) ?? ALL} onValueChange={v => table.getColumn('country')?.setFilterValue(v === ALL ? undefined : v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                    {countryOptions.map(({ code, name }) => (
                      <SelectItem key={code} value={code}>
                        {name} ({code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">{t('tblColumnType')}</div>
                <Select
                  value={(table.getColumn('userType')?.getFilterValue() as string | undefined) ?? ALL}
                  onValueChange={v => table.getColumn('userType')?.setFilterValue(v === ALL ? undefined : v)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                    {userTypeOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">{t('filterGender')}</div>
                <Select value={(table.getColumn('gender')?.getFilterValue() as string | undefined) ?? ALL} onValueChange={v => table.getColumn('gender')?.setFilterValue(v === ALL ? undefined : v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{tEvents('filterAll')}</SelectItem>
                    <SelectItem value={Gender.MALE}>{t('filterGenderMale')}</SelectItem>
                    <SelectItem value={Gender.FEMALE}>{t('filterGenderFemale')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">{t('cbCardDetails')}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5" role="group" aria-label={t('cbCardDetails')}>
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <div key={column.id} className="flex items-center gap-2">
                      <Checkbox id={`users-list-col-${column.id}`} checked={column.getIsVisible()} onCheckedChange={v => column.toggleVisibility(!!v)} />
                      <label htmlFor={`users-list-col-${column.id}`} className="cursor-pointer text-sm font-medium leading-none text-foreground">
                        {getColumnNameById(column.id)}
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <Button type="button" variant="outline" className="h-9 min-w-0 rounded-xl px-3 text-sm" onClick={clearAdvancedFilters} disabled={!hasAdvancedFilterActive}>
                {tEvents('filterClearAll')}
              </Button>
              <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-9 min-w-0! px-4 text-sm')} onClick={() => setAdvancedOpen(false)}>
                {tEvents('filterApply')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="-mt-1 px-1 text-xs text-muted-foreground" aria-live="polite">
        {t('membersCount', { count: filteredCount })}
      </div>

      {/* member cards */}
      {table.getRowModel().rows.length > 0 && (
        <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows.map(row => {
            const info = row.original;
            const name = `${info.user.firstName} ${info.user.lastName}`.trim();
            const profileHref = `${routeUsers}/${info.user.username}`;
            const country = (info.country || '').trim();
            const hasCountry = country && country !== '--';
            const socials = info.socials;
            const hasExternalSocials = socials.insta || socials.tikTok || socials.youTube || socials.website;

            return (
              <li key={row.id} className="group relative flex min-w-0 flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex min-w-0 items-center gap-3">
                  <Link href={profileHref} className="shrink-0" tabIndex={-1} aria-hidden>
                    <img src={info.user.imageUrl ? info.user.imageUrl : imgUserDefaultImg} className="h-12 w-12 rounded-full bg-muted object-cover ring-1 ring-border" alt="" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={profileHref}
                      className="block truncate text-base font-semibold capitalize text-foreground underline-offset-2 hover:text-brand-strong hover:underline focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {name}
                    </Link>
                    <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {isVisible('userType') && info.userType && (
                        <span className="inline-flex items-center gap-1.5">
                          <UserTypeIcon userType={info.userType} variant="tile" className="h-5 w-5 rounded-md" />
                          {typeLabel(info.userType)}
                        </span>
                      )}
                      {isVisible('country') && hasCountry && (
                        <span className="inline-flex items-center gap-1.5" title={COUNTRIES_MAP[country.toUpperCase()]?.name || country}>
                          <ReactCountryFlag countryCode={country} svg style={{ width: '1.1rem', height: '0.8rem', borderRadius: '2px' }} aria-hidden />
                          {COUNTRIES_MAP[country.toUpperCase()]?.name || country.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {((isVisible('location') && info.location.city) || (isVisible('socials') && hasExternalSocials)) && (
                  <div className="mt-auto flex min-w-0 items-center justify-between gap-2 border-t border-border/70 pt-3">
                    {isVisible('location') && info.location.city ? (
                      <Link
                        href={info.location.mapLink}
                        className="inline-flex min-w-0 items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title={t('lnkShowOnMap')}
                      >
                        <IconMapPin className="h-4 w-4 shrink-0" stroke={1.75} aria-hidden />
                        <span className="truncate">{info.location.city}</span>
                      </Link>
                    ) : (
                      <span />
                    )}
                    {isVisible('socials') && hasExternalSocials && (
                      <div className="inline-flex flex-nowrap items-center gap-1.5 [&_img]:h-6 [&_img]:w-6">
                        {socials.insta && <SocialLink platform={SocialPlatform.INSTAGRAM} path={socials.insta} showPath={false} />}
                        {socials.tikTok && <SocialLink platform={SocialPlatform.TIKTOK} path={socials.tikTok} showPath={false} />}
                        {socials.youTube && <SocialLink platform={SocialPlatform.YOUTUBE} path={socials.youTube} showPath={false} />}
                        {socials.website && <SocialLink platform={SocialPlatform.WEBSITE} path={socials.website} showPath={false} />}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {table.getRowModel().rows?.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-10 text-center text-muted-foreground">
          <IconUsers className="h-8 w-8" stroke={1.5} aria-hidden />
          {t('tblNoData')}
        </div>
      )}

      {table.getPageCount() > 1 && (
        <div className="mt-1 flex shrink-0 flex-wrap items-center gap-2">
          <div className="mr-auto text-xs text-muted-foreground sm:text-sm">
            {`${t('navCurrentPage1')} ${table.getState().pagination.pageIndex + 1} ${t('navCurrentPage2')} ${Math.max(1, table.getPageCount())}`}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="hidden h-9 w-9 rounded-xl p-0 sm:inline-flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">{t('navFirst')}</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">{t('navPrevious')}</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">{t('navNext')}</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden h-9 w-9 rounded-xl p-0 sm:inline-flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t('navLast')}</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
