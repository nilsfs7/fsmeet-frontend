'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';
import {
  type Column,
  type ColumnDef,
  ColumnFiltersState,
  type Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { UserType } from '@/domain/enums/user-type';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import { imgUserDefaultImg, imgWorld } from '@/domain/constants/images';
import { getUserTypeImages } from '@/functions/user-type';
import SocialLink from '@/components/user/social-link';
import { SocialPlatform } from '@/domain/enums/social-platform';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

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
  userType: UserType;
  location: Location;
  socials: Socials;
};

function HeaderSortButton<TData>({
  column,
  label,
  title,
  'aria-label': ariaLabel,
}: {
  column: Column<TData, unknown>;
  label: string;
  title: string;
  'aria-label': string;
}) {
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
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo>
          column={column}
          label={t('tblColumnName')}
          title={t('tableSortByName')}
          aria-label={`${t('tblColumnName')}, ${t('tableSortByName')}`}
        />
      ),
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
            className="font-medium text-primary underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
      accessorKey: 'country',
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo>
          column={column}
          label={t('tblColumnCountry')}
          title={t('tableSortByCountry')}
          aria-label={`${t('tblColumnCountry')}, ${t('tableSortByCountry')}`}
        />
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
    },

    {
      accessorKey: 'userType',
      header: () => t('tblColumnType'),
      cell: ({ row }) => (
        <div className="h-8 w-8">
          <img src={getUserTypeImages(row.getValue('userType') as UserType).path} alt="" />
        </div>
      ),

      enableSorting: false,
    },

    {
      accessorKey: 'location',
      header: () => t('tblColumnLocation'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {(row.getValue('location') as Location).city && (
            <Link href={(row.getValue('location') as Location).mapLink}>
              <span className="inline-flex h-8 w-8">
                <img src={imgWorld} alt="" />
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
    },
  });

  const hasHiddenColumns = useMemo(
    () => table.getAllColumns().filter(c => c.getCanHide()).some(c => !c.getIsVisible()),
    [table, columnVisibility],
  );

  return (
    <div className={cn('text-sm flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-none')}>
      <div className="flex w-full min-w-0 max-w-lg flex-col gap-2 self-center">
        <div className="w-full min-w-0">
          <label className="mb-1 block text-left text-xs text-zinc-600" htmlFor="users-filter-name">
            {t('tblColumnName')}
          </label>
          <Input
            id="users-filter-name"
            type="search"
            placeholder={t('inputSearchPlaceholder')}
            value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
            onChange={e => {
              table.getColumn('user')?.setFilterValue(e.target.value);
            }}
            autoComplete="off"
            spellCheck={false}
            className="h-9 w-full bg-background/80"
          />
        </div>

        <div className="w-full min-w-0">
          <button
            type="button"
            onClick={() => setAdvancedOpen(v => !v)}
            className="flex w-full min-w-0 items-center justify-center gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-expanded={advancedOpen}
          >
            {hasHiddenColumns ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden /> : null}
            <span className="font-medium text-foreground/90">{tEvents('searchAdvancedLabel')}</span>
            <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', advancedOpen && 'rotate-180')} aria-hidden />
          </button>

          {advancedOpen && (
            <div className="space-y-3 pt-0.5 pb-1">
              <div>
                <div className="mb-1 text-2xs text-muted-foreground sm:text-xs">{t('cbColumns')}</div>
                <div className="flex flex-col gap-2.5" role="group" aria-label={t('cbColumns')}>
                  {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => (
                      <div key={column.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`users-list-col-${column.id}`}
                          checked={column.getIsVisible()}
                          onCheckedChange={v => column.toggleVisibility(!!v)}
                        />
                        <label htmlFor={`users-list-col-${column.id}`} className="cursor-pointer text-sm font-medium leading-none text-zinc-800 dark:text-zinc-200">
                          {getColumnNameById(column.id)}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {table.getRowModel().rows.length > 0 && (
        <div className="min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto scrollbar-none">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          header.column.id === 'user' && 'min-w-[10rem]',
                          ['userType', 'location', 'socials', 'country'].includes(header.column.id) && 'w-[1%] whitespace-nowrap',
                        )}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="align-middle text-zinc-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {table.getRowModel().rows?.length === 0 && (
        <div className="m-1 flex justify-center text-zinc-600">{t('tblNoData')}</div>
      )}

      {columnData.length > 0 && (
        <div className="mt-1 flex shrink-0 flex-wrap items-center gap-2">
          <div className="mr-auto text-xs text-zinc-600 sm:text-sm">
            {`${t('navCurrentPage1')} ${table.getState().pagination.pageIndex + 1} ${t('navCurrentPage2')} ${Math.max(1, table.getPageCount())}`}
          </div>

          <div className="flex items-center gap-1">
            <p className="text-xs text-zinc-600 sm:text-sm">{t('navRowsPerPage')}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={value => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[4.25rem]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[50, 100, 200].map(pageSize => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="hidden h-8 w-8 p-0 sm:inline-flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">First page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden h-8 w-8 p-0 sm:inline-flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
