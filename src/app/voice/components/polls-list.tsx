'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface IPollsList {
  columnData: ColumnInfo[];
}

export type UserInfo = {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
};

export type ColumnInfo = {
  user: UserInfo;
  question: string;
};

export const PollsList = ({ columnData }: IPollsList) => {
  const t = useTranslations('/voice');

  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handlePollClicked = async (index: number) => {
    const url = `voice?select=${index}`;
    router.replace(url);
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
    },

    {
      accessorKey: 'question',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnQuestion')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue('question'),
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
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => {
                        handlePollClicked(rowIndex);
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
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
