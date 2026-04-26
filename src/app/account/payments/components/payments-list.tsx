'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Column,
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
import { useMemo, useState } from 'react';
import { routeAccountPayments, routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { CurrencyCode } from '../../../../domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '../../../../functions/currency-conversion';
import { Moment } from 'moment';
import moment from 'moment';
import { createRefund } from '../../../../infrastructure/clients/payment.client';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';
import Dialog from '@/components/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface IUsersList {
  columnData: ColumnInfo[];
}

export type Amount = {
  amount: number;
  currency: CurrencyCode;
  amountRefunded: number;
};

export type ColumnInfo = {
  intentId: string;
  username: string;
  amount: Amount;
  date: Moment;
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

export const PaymentsList = ({ columnData }: IUsersList) => {
  const t = useTranslations('/account/payments');
  const tEvents = useTranslations('/events');
  const { data: session } = useSession();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo>
          column={column}
          label={t('tblColumnDate')}
          title={t('tblColumnDate')}
          aria-label={t('tblColumnDate')}
        />
      ),
      cell: ({ row }) => <div className="whitespace-nowrap">{moment(row.getValue('date')).format('yyyy-MM-DD HH:mm')}</div>,
    },

    {
      accessorKey: 'username',
      enableHiding: true,
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo>
          column={column}
          label={t('tblColumnUsername')}
          title={t('tblColumnUsername')}
          aria-label={t('tblColumnUsername')}
        />
      ),
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
      header: ({ column }) => (
        <HeaderSortButton<ColumnInfo>
          column={column}
          label={t('tblColumnAmount')}
          title={t('tblColumnAmount')}
          aria-label={t('tblColumnAmount')}
        />
      ),
      cell: ({ row }) => (
        <div className={(row.getValue('amount') as Amount).amountRefunded === (row.getValue('amount') as Amount).amount ? 'line-through' : ''}>
          {convertCurrencyIntegerToDecimal((row.getValue('amount') as Amount).amount, (row.getValue('amount') as Amount).currency)
            .toFixed(2)
            .replace('.', ',')}
          {(row.getValue('amount') as Amount).currency.toUpperCase()}
        </div>
      ),
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
                disabled={payment.amount.amountRefunded > 0}
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

  const hasHiddenColumns = useMemo(
    () => table.getAllColumns().filter(c => c.getCanHide()).some(c => !c.getIsVisible()),
    [table, columnVisibility],
  );

  const initiateRefund = async (intentId: string) => {
    try {
      await createRefund(intentId, session);
      toast.success('Refund initiated.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleInitiateRefundClicked = async (intentId: string) => {
    router.replace(`${routeAccountPayments}?refund=1&intentId=${intentId}`);
  };

  const handleConfirmRefundClicked = async () => {
    const intentId = searchParams.get('intentId');
    if (intentId) {
      initiateRefund(intentId);
    } else {
      toast.error('Missing intent ID in URL.');
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeAccountPayments}`);
  };

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgInitiateRefundTitle')} queryParam="refund" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmRefundClicked}>
        <p>{t('dlgInitiateRefundText1')}</p>
        <p>{t('dlgInitiateRefundText2')}</p>
      </Dialog>

      <div className="flex w-full min-w-0 max-w-lg flex-col gap-2 self-center">
        <div className="w-full min-w-0">
          <Input
            placeholder={t('inputSearchPlaceholder')}
            value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
            onChange={(event: any) => {
              table.getColumn('username')?.setFilterValue(event.target.value);
            }}
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
                        <Checkbox id={`payments-list-col-${column.id}`} checked={column.getIsVisible()} onCheckedChange={v => column.toggleVisibility(!!v)} />
                        <label htmlFor={`payments-list-col-${column.id}`} className="cursor-pointer text-sm font-medium leading-none text-zinc-800 dark:text-zinc-200">
                          {getColumnNameById(column.id, t)}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex min-h-0 min-w-0 flex-1 justify-center overflow-y-auto scrollbar-none">
        <div className="w-full min-w-0">
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
                              header.column.id === 'username' && 'min-w-[10rem]',
                              header.column.id === 'date' && 'min-w-[9.5rem] whitespace-nowrap',
                              ['amount', 'actions'].includes(header.column.id) && 'w-[1%] whitespace-nowrap',
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

          {table.getRowModel().rows?.length === 0 && <div className="m-1 flex justify-center text-zinc-600">{t('tblNoData')}</div>}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="mr-auto text-xs text-zinc-600 sm:text-sm">{`${t('navCurrentPage1')} ${table.getState().pagination.pageIndex + 1} ${t('navCurrentPage2')} ${table.getPageCount()} `}</div>

            <div className="flex items-center gap-1">
              <Button variant="outline" className="hidden h-8 w-8 p-0 sm:inline-flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
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
              <Button variant="outline" className="hidden h-8 w-8 p-0 sm:inline-flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">{`Go to last page`}</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
