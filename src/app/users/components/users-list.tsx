'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { UserType } from '@/domain/enums/user-type';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import { imgUserDefaultImg, imgWorld } from '@/domain/constants/images';
import { getUserTypeImages } from '@/functions/user-type';
import SocialLink from '@/components/user/social-link';
import { Platform } from '@/domain/enums/platform';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

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

export const UsersList = ({ columnData }: IUsersList) => {
  const t = useTranslations('/users');

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const getColumnNameById = (columnId: string, t: any): string => {
    let name = 'unknown';

    switch (columnId) {
      case 'user':
        name = t('tblColumnUsername');
        break;
      case 'user':
        name = t('tblColumnName');
        break;
      case 'country':
        name = t('tblColumnCountry');
        break;
      case 'userType':
        name = t('tblColumnType');
        break;
      case 'location':
        name = t('tblColumnLocation');
        break;
      case 'socials':
        name = t('tblColumnSocials');
        break;
    }

    return name;
  };

  const columns: ColumnDef<ColumnInfo>[] = [
    {
      accessorKey: 'user',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnName')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
            <div className="h-8 w-8">
              <img
                src={(row.getValue('user') as UserInfo).imageUrl ? (row.getValue('user') as UserInfo).imageUrl : imgUserDefaultImg}
                className="h-full w-full rounded-full bg-zinc-200 object-cover"
              />
            </div>
          </Link>
          <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
            <div className="capitalize">{`${(row.getValue('user') as UserInfo).firstName} ${(row.getValue('user') as UserInfo).lastName}`}</div>
          </Link>
        </div>
      ),
      sortingFn: (rowA: Row<ColumnInfo>, rowB: Row<ColumnInfo>, columnId: string) => {
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
      filterFn: (row: Row<ColumnInfo>, columnId: string, filterValue: string): boolean => {
        const rowVal = `${row.original.user.firstName} ${row.original.user.lastName}`;

        if (rowVal.toLowerCase().includes(filterValue.toLowerCase())) return true;

        return false;
      },
      enableHiding: false,
    },

    {
      accessorKey: 'country',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnCountry')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        row.getValue('country') &&
        (row.getValue('country') as string) !== '--' && (
          <div className="flex items-center gap-2">
            <div>{(row.getValue('country') as string).toUpperCase()}</div>
            {
              <div className="w-8 h-8">
                <ReactCountryFlag
                  className="w-full h-full"
                  countryCode={row.getValue('country')}
                  svg
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  title={row.getValue('country')}
                />
              </div>
            }
          </div>
        ),
    },

    {
      accessorKey: 'userType',
      header: ({ column }) => {
        return <>{t('tblColumnType')}</>;
      },
      cell: ({ row }) => (
        <div className="w-8 h-8">
          <img src={getUserTypeImages(row.getValue('userType')).path} />
        </div>
      ),

      enableSorting: false,
    },

    {
      accessorKey: 'location',
      header: ({ column }) => {
        return <>{t('tblColumnLocation')}</>;
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {(row.getValue('location') as Location).city && (
            <Link href={(row.getValue('location') as Location).mapLink}>
              <button className="w-8 h-8">
                <img src={imgWorld} />
              </button>
            </Link>
          )}
        </div>
      ),
      enableSorting: false,
    },

    {
      accessorKey: 'socials',
      header: () => {
        return <>{t('tblColumnSocials')}</>;
      },
      cell: ({ row }) => (
        <div className="flex gap-2">
          {(row.getValue('socials') as Socials).fsm && <SocialLink platform={Platform.FSMEET} path={(row.getValue('socials') as Socials).fsm} showPath={false} />}
          {(row.getValue('socials') as Socials).insta && <SocialLink platform={Platform.INSTAGRAM} path={(row.getValue('socials') as Socials).insta} showPath={false} />}
          {(row.getValue('socials') as Socials).tikTok && <SocialLink platform={Platform.TIKTOK} path={(row.getValue('socials') as Socials).tikTok} showPath={false} />}
          {(row.getValue('socials') as Socials).youTube && <SocialLink platform={Platform.YOUTUBE} path={(row.getValue('socials') as Socials).youTube} showPath={false} />}
          {(row.getValue('socials') as Socials).website && <SocialLink platform={Platform.WEBSITE} path={(row.getValue('socials') as Socials).website} showPath={false} />}
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

  return (
    <>
      <div className="mx-2 flex gap-2">
        <Input
          placeholder={t('inputSearchPlaceholder')}
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event: any) => {
            table.getColumn('user')?.setFilterValue(event.target.value);
          }}
          className="max-w-40"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('cbColumns')}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={(value: any) => column.toggleVisibility(!!value)}>
                    {getColumnNameById(column.id, t)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={'mt-2 mx-2 flex justify-center overflow-y-auto'}>
        <div className="w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {`${t('tblNoData')}`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <div className="flex min-w-max items-center justify-center text-sm font-medium">{`${t('navCurrentPage1')} ${table.getState().pagination.pageIndex + 1} ${t('navCurrentPage2')} ${table.getPageCount()} `}</div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">{`Go to first page`}</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">{`Go to previous page`}</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">{`Go to next page`}</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">{`Go to last page`}</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <p className="text-sm font-medium">{t('navRowsPerPage')}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={value => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
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
        </div>
      </div>
    </>
  );
};
