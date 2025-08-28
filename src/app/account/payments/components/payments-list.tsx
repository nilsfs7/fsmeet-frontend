'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
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
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { CurrencyCode } from '../../../../domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '../../../../functions/currency-conversion';
import { Moment } from 'moment';
import moment from 'moment';
import { createRefund } from '../../../../infrastructure/clients/payment.client';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';

interface IUsersList {
  columnData: ColumnInfo[];
}

export type Amount = {
  amount: number;
  currency: CurrencyCode;
};

export type ColumnInfo = {
  intentId: string;
  username: string;
  amount: Amount;
  date: Moment;
};

export const PaymentsList = ({ columnData }: IUsersList) => {
  const t = useTranslations('/account/payments');
  const { data: session } = useSession();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const getColumnNameById = (columnId: string, t: any): string => {
    let name = 'unknown';

    switch (columnId) {
      case 'username':
        name = t('tblColumnUsername');
        break;
      case 'amount':
        name = t('tblColumnAmount');
        break;
      case 'date':
        name = t('tblColumnDate');
        break;
    }

    return name;
  };

  const columns: ColumnDef<ColumnInfo>[] = [
    {
      accessorKey: 'date',
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnDate')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{moment(row.getValue('date')).format('yyyy-MM-DD HH:mm')}</div>,
    },

    {
      accessorKey: 'username',
      enableHiding: true,
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnUsername')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="flex items-center gap-2">{<Link href={`${routeUsers}/${row.getValue('username')}`}>{row.getValue('username')} </Link>}</div>,
      sortingFn: (rowA: Row<ColumnInfo>, rowB: Row<ColumnInfo>, columnId: string) => {
        const rowAVal = `${rowA.original.username}`;
        const rowBVal = `${rowB.original.username}`;

        if (rowAVal < rowBVal) {
          return -1;
        }
        if (rowAVal > rowBVal) {
          return 1;
        }

        return 0;
      },
      filterFn: (row: Row<ColumnInfo>, columnId: string, filterValue: string): boolean => {
        const rowVal = `${row.original.username} ${row.original.username}`;

        if (rowVal.toLowerCase().includes(filterValue.toLowerCase())) return true;

        return false;
      },
    },

    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnAmount')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        `${convertCurrencyIntegerToDecimal((row.getValue('amount') as Amount).amount, (row.getValue('amount') as Amount).currency)
          .toFixed(2)
          .replace('.', ',')} ${(row.getValue('amount') as Amount).currency.toUpperCase()}`,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.intentId)}> {t('tblColumnActionsCopyPaymentId')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('view details')} disabled>
                {t('tblColumnActionsViewPaymentDetails')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleInitiateRefundClicked(payment.intentId);
                }}
              >
                {t('tblColumnActionsRefundPayment')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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

  const handleInitiateRefundClicked = async (intentId: string) => {
    try {
      await createRefund(intentId, session);
      toast.success('Refund initiated.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 flex gap-2">
        <Input
          placeholder={t('inputSearchPlaceholder')}
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(event: any) => {
            table.getColumn('username')?.setFilterValue(event.target.value);
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
