import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { getTotalMatchPerformance } from '@/services/fsmeet-backend/get-total-match-performance';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { getUsers } from '@/services/fsmeet-backend/get-users';
import { imgUserDefaultImg, imgWorld } from '@/types/consts/images';
import { routeHome, routeMap, routeUsers } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { TotalMatchPerfromance } from '@/types/total-match-performance';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
// import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import ReactCountryFlag from 'react-country-flag';

export type User = {
  username: string;
  imageUrl: string;
};

export type Name = {
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
  user: User;
  name: Name;
  country: string;
  location: Location;
  socials: Socials;
};

export const columns: ColumnDef<ColumnInfo>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: any) => row.toggleSelected(!!value)} aria-label="Select row" />,
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 lowercase">
        <div className="h-8 w-8">
          <Link href={`${routeUsers}/${(row.getValue('user') as User).username}`}>
            <img src={(row.getValue('user') as User).imageUrl ? (row.getValue('user') as User).imageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-zinc-200 object-cover" />
          </Link>
        </div>

        <Link href={`${routeUsers}/${(row.getValue('user') as User).username}`}>{(row.getValue('user') as User).username}</Link>
      </div>
    ),
  },

  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{`${(row.getValue('name') as Name).firstName} ${(row.getValue('name') as Name).lastName}`}</div>,
  },

  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div>{(row.getValue('country') as string).toUpperCase()}</div>
        {(row.getValue('country') as string) && (
          <ReactCountryFlag
            countryCode={row.getValue('country')}
            svg
            style={{
              width: '2em',
              height: '2em',
            }}
            title={row.getValue('country')}
          />
        )}
      </div>
    ),
  },

  {
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {(row.getValue('location') as Location).city && (
          <Link href={(row.getValue('location') as Location).mapLink}>
            <button>
              <img src={imgWorld} className="mx-1 h-8 w-8 rounded-full object-cover" />
            </button>
          </Link>
        )}
      </div>
    ),
  },

  // {
  //   accessorKey: 'lastName',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => {
  //           column.toggleSorting(column.getIsSorted() === 'asc');
  //         }}
  //       >
  //         Last Name
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className="capitalize">{row.getValue('lastName')}</div>,
  // },

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
  },

  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

const UsersList = (props: any) => {
  const session = props.session;
  const columnInfos: ColumnInfo[] = props.columnInfos;
  const matchStats: TotalMatchPerfromance = props.matchStats;

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
    <div className="absolute inset-0 flex flex-col">
      <div className={`m-2 flex flex-col overflow-hidden`}>
        <div className={'flex flex-col items-center'}>
          <h1 className="mt-2 text-xl">Community Board</h1>
        </div>

        <div className={'my-2 flex justify-center overflow-y-auto p-2'}>
          {/* <div className="flex flex-col items-center justify-center">
          <div className="m-2 text-3xl">{user.username}</div>

          <div>
            <div className="flex h-96 w-64">
              <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
            </div>

            <div className="mx-2 mt-6 ">
              <div className="h-8 flex items-center text-lg">
                {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                {user.isVerifiedAccount && <img className="h-8 p-1 hover:p-0" src={imgVerifiedCheckmark} alt="user verified checkmark" />}
              </div>

              <Accordion type="single" collapsible>
                {(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website) && (
                  <AccordionItem value="item-socials">
                    <AccordionTrigger>{`Socials`}</AccordionTrigger>
                    <AccordionContent>
                      <div className="">
                        {user.instagramHandle && (
                          <div className="mt-1 w-fit">
                            <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
                          </div>
                        )}

                        {user.tikTokHandle && (
                          <div className="mt-1 w-fit">
                            <SocialLink platform={Platform.TIKTOK} path={user.tikTokHandle} />
                          </div>
                        )}

                        {user.youTubeHandle && (
                          <div className="mt-1 w-fit">
                            <SocialLink platform={Platform.YOUTUBE} path={user.youTubeHandle} />
                          </div>
                        )}

                        {user.website && (
                          <div className="mt-1 w-fit">
                            <SocialLink platform={Platform.WEBSITE} path={user.website} />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="item-matches">
                  <AccordionTrigger>{`Battle Statistics`}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2">
                      <div>{`Matches`}</div>
                      <div>{matchStats.matches}</div>

                      {matchStats.matches > 0 && (
                        <>
                          <div>{`Wins`}</div>
                          <div>{`${matchStats.wins} `}</div>

                          <div>{`Win ratio`}</div>
                          <div>{`${(matchStats.ratio * 100).toFixed(2)}%`}</div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div> */}

          {/* {users.map((user, index) => {
          return <div key={`${user}-${index}`}> {user.username}</div>;
        })} */}

          <div className="w-full">
            <div className="flex items-center py-4">
              {/* <Input
                placeholder="Filter by name..."
                value={(table.getColumn('country')?.getFilterValue() as string) ?? ''}
                onChange={(event: any) => {
                  console.log(event.target.value);
                  table.getColumn('country')?.setFilterValue(event.target.value);
                }}
                className="max-w-xs"
              /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => {
                      return (
                        <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value: any) => column.toggleVisibility(!!value)}>
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              {/* <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
              </div> */}
              {/* <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div> */}

              {/* <div className="flex items-center space-x-6 lg:space-x-8">
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
              </div> */}
            </div>
          </div>
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
  const session = await getSession(context);

  const username = context.params?.username;

  // if (username) {
  try {
    const users = await getUsers();

    // const matchStats = await getTotalMatchPerformance(username.toString());

    const columnInfos: ColumnInfo[] = users.map((user, index) => {
      return {
        user: {
          username: user.username,
          imageUrl: user.imageUrl || '',
        },
        name: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        },
        country: user.country || '',
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
      };
    });

    return {
      props: {
        // users: users,
        columnInfos: columnInfos,
        // matchStats: matchStats,
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
