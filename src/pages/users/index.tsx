import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg, imgWorld } from '@/types/consts/images';
import { routeHome, routeMap, routeUsers } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { TotalMatchPerformance } from '@/types/total-match-performance';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
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
// import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import ReactCountryFlag from 'react-country-flag';
import { UserType } from '@/types/enums/user-type';
import { Header } from '@/components/Header';
import { User } from '@/types/user';
import PageTitle from '@/components/PageTitle';
import { getUserTypeImages } from '@/types/funcs/user-type';
import { auth } from '@/auth';
import { getUsers } from '@/infrastructure/clients/user.client';

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

export const columns: ColumnDef<ColumnInfo>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {`Name`}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`${routeUsers}/${(row.getValue('user') as UserInfo).username}`}>
          <div className="h-8 w-8">
            <img src={(row.getValue('user') as UserInfo).imageUrl ? (row.getValue('user') as UserInfo).imageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-zinc-200 object-cover" />
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
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {`Country`}
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
            <div className="mx-1 w-8 h-8">
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
      return <>{`Type`}</>;
    },
    cell: ({ row }) => <img src={getUserTypeImages(row.getValue('userType')).path} className="mx-1 h-8 w-8" />,
    enableSorting: false,
  },

  {
    accessorKey: 'location',
    header: ({ column }) => {
      return <>{`Location`}</>;
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {(row.getValue('location') as Location).city && (
          <Link href={(row.getValue('location') as Location).mapLink}>
            <button>
              <img src={imgWorld} className="mx-1 h-8 w-8" />
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
      return <>{`Socials`}</>;
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

const UsersList = (props: any) => {
  const session = props.session;
  const columnInfos: ColumnInfo[] = props.columnInfos;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: columnInfos,
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
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title="Community" />

      <div className="mx-2 flex gap-2">
        <Input
          placeholder="Search name..."
          value={(table.getColumn('user')?.getFilterValue() as string) ?? ''}
          onChange={(event: any) => {
            table.getColumn('user')?.setFilterValue(event.target.value);
          }}
          className="max-w-40"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    disabled={column.id === 'user' ?? true}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
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

          {/* <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
            <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
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
                      {[10, 25, 50, 100].map(pageSize => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    <span className="sr-only">Go to first page</span>
                    <DoubleArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    <span className="sr-only">Go to last page</span>
                    <DoubleArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
          </div> */}
        </div>
      </div>

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default UsersList;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  const username = context.params?.username;

  // if (username) {
  try {
    const users = await getUsers();

    const columnInfos: ColumnInfo[] = [];

    const userSorted = users.sort((a: User, b: User) => {
      const rowAVal = `${a.firstName} ${a.lastName}`;
      const rowBVal = `${b.firstName} ${b.lastName}`;

      if (rowAVal < rowBVal) {
        return -1;
      }
      if (rowAVal > rowBVal) {
        return 1;
      }

      return 0;
    });

    userSorted.forEach((user, index) => {
      if (user.type !== UserType.TECHNICAL) {
        columnInfos.push({
          user: {
            username: user.username,
            imageUrl: user.imageUrl || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
          },
          country: user.country || '',
          userType: user.type,
          location:
            user.city && user.exposeLocation && user.locLatitude && user.locLongitude
              ? { city: user.city, mapLink: `${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}` }
              : { city: '', mapLink: '' },
          socials: {
            fsm: user.username,
            insta: user.instagramHandle || '',
            tikTok: user.tikTokHandle || '',
            youTube: user.youTubeHandle || '',
            website: user.website || '',
          },
        });
      }
    });

    return {
      props: {
        columnInfos: columnInfos,
        session: session,
      },
    };
  } catch (error: any) {
    console.error(error);
  }
  // }

  // return {
  //   redirect: {
  //     permanent: false,
  //     destination: routeUsers,
  //   },
  // };
};
