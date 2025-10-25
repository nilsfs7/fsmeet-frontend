'use client';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Dialog from '@/components/dialog';
import {
  ColumnDef,
  ColumnFiltersState,
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
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import moment from 'moment';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import { deletePoll } from '@/infrastructure/clients/poll.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';

interface IPollsList {
  columnData: ColumnInfo[];
  enableEditing?: boolean;
}

export type UserInfo = {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
};

export type ColumnInfo = {
  pollId: string;
  user: UserInfo;
  question: string;
  totalRatingScore: number;
  deadline: string | null;
  creationDate: string;
};

export const PollsList = ({ columnData, enableEditing = false }: IPollsList) => {
  const t = useTranslations('global/components/poll-list');

  const { data: session } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedPollId = searchParams?.get('select');

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const getColumnNameById = (columnId: string, t: any): string => {
    let name = 'unknown';

    switch (columnId) {
      case 'question':
        name = t('tblColumnHeaderQuestion');
        break;
      case 'creationDate':
        name = t('tblColumnHeaderCreationDate');
        break;
      case 'totalRatingScore':
        name = t('tblColumnHeaderTotalRatingScore');
        break;
    }

    return name;
  };

  const handlePollClicked = async (pollId: string) => {
    router.replace(`${window.location.pathname}?select=${pollId}`);
  };

  const handleDeletePollClicked = async (pollId: string) => {
    await new Promise(resolve => setTimeout(resolve, 50)); // TODO: find better solution. delaying because handlePollClicked() modifies url, too

    const url = `${window.location.pathname}?select=${pollId}&delete=1`;
    router.replace(url);
  };

  const handleCancelDialogClicked = async () => {
    if (selectedPollId) {
      router.replace(`${window.location.pathname}?select=${selectedPollId}`);
    }
  };

  const handleConfirmDeletePollClicked = async () => {
    if (selectedPollId) {
      try {
        await deletePoll(selectedPollId, session);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const columns: ColumnDef<ColumnInfo>[] = [
    // {
    //   accessorKey: 'user',
    //   header: ({ column }) => {
    //     return (
    //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //         {t('tblColumnName')}
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-2">
    //       <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
    //         <div className="h-8 w-8">
    //           <img
    //             src={(row.getValue('user') as UserInfo).imageUrl ? (row.getValue('user') as UserInfo).imageUrl : imgUserDefaultImg}
    //             className="h-full w-full rounded-full bg-zinc-200 object-cover"
    //           />
    //         </div>
    //       </Link>
    //       <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
    //         <div className="capitalize">{`${(row.getValue('user') as UserInfo).firstName} ${(row.getValue('user') as UserInfo).lastName}`}</div>
    //       </Link>
    //     </div>
    //   ),
    //   sortingFn: (rowA: Row<ColumnInfo>, rowB: Row<ColumnInfo>, columnId: string) => {
    //     const rowAVal = `${rowA.original.user.firstName} ${rowA.original.user.lastName}`;
    //     const rowBVal = `${rowB.original.user.firstName} ${rowB.original.user.lastName}`;

    //     if (rowAVal < rowBVal) {
    //       return -1;
    //     }
    //     if (rowAVal > rowBVal) {
    //       return 1;
    //     }

    //     return 0;
    //   },
    //   filterFn: (row: Row<ColumnInfo>, columnId: string, filterValue: string): boolean => {
    //     const rowVal = `${row.original.user.firstName} ${row.original.user.lastName}`;

    //     if (rowVal.toLowerCase().includes(filterValue.toLowerCase())) return true;

    //     return false;
    //   },
    // },

    {
      accessorKey: 'question',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnHeaderQuestion')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue('question'),
      enableHiding: false,
    },

    {
      accessorKey: 'creationDate',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnHeaderCreationDate')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const diffDays = moment().diff(moment(row.getValue('creationDate')), 'days');
        return diffDays === 0 ? t('tblCreationDateToday') : `${diffDays} ${t('tblCreationDateDays')}`;
      },
    },

    {
      accessorKey: 'totalRatingScore',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {t('tblColumnHeaderTotalRatingScore')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.getValue('totalRatingScore');
      },
    },
  ];

  if (enableEditing) {
    columns.unshift({
      id: 'edit',
      header: () => {
        return <div className="ml-2">{t('tblColumnHeaderActions')}</div>;
      },
      cell: ({ row }) => (
        <ActionButton
          action={Action.DELETE} // todo: change to Action.EDIT and add context to edit poll
          onClick={() => {
            handleDeletePollClicked(columnData[row.index].pollId);
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

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
      <Toaster richColors />

      <Dialog title={t('dlgAccountDeletePollTitle')} queryParam="delete" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmDeletePollClicked}>
        <p>{t('dlgAccountDeletePollText')}</p>
      </Dialog>

      <div className="mx-2 flex gap-2">
        <Input
          placeholder={t('inputSearchPlaceholder')}
          value={(table.getColumn('question')?.getFilterValue() as string) ?? ''}
          onChange={(event: any) => {
            table.getColumn('question')?.setFilterValue(event.target.value);
          }}
          className="max-w-64"
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
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => {
                        handlePollClicked(columnData[rowIndex].pollId);
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
