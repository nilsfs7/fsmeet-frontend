'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import ComboBox from '@/components/common/combo-box';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/domain/types/user';
import { menuJobProfileListingStates } from '@/domain/constants/menus/menu-job-profile-listing-states';
import { JobProfileListingState } from '@/domain/enums/job-profile-listing-state';
import { UserType } from '@/domain/enums/user-type';
import { getUsers, updateJobProfileListingState } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

/** Same glass card as verification / licenses editors; full width for admin tables. */
const PANEL_CLASS = cn(
  'w-full min-w-0 flex flex-col gap-3',
  'rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 sm:p-3 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  'text-sm',
);

const TABLE_WRAP_CLASS = cn('min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/40', 'dark:bg-background/30');

const FILTER_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none text-foreground';
const SECTION_TITLE_CLASS = 'mb-2 text-center text-sm font-semibold leading-tight text-foreground/90';

const TABLE_CLASS = 'table-fixed w-full min-w-[40rem] border-separate border-spacing-x-3 border-spacing-y-0';

const HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const CELL_PAD = 'py-2.5 px-3';

const col = {
  user: 'w-[34%] min-w-[11rem]',
  state: 'w-[42%] min-w-[14rem]',
  actions: 'w-[18%] min-w-[6.5rem]',
} as const;

function matchesUserFilter(user: User, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const u = user.username.toLowerCase();
  const first = (user.firstName ?? '').toLowerCase();
  const last = (user.lastName ?? '').toLowerCase();
  return u.includes(q) || first.includes(q) || last.includes(q) || `${first} ${last}`.trim().includes(q);
}

function sortUsersByUserColumn(users: User[], descending: boolean): User[] {
  const list = [...users];
  list.sort((a, b) => {
    const cmp = a.username.localeCompare(b.username);
    if (cmp !== 0) return descending ? -cmp : cmp;
    return (a.firstName ?? '').localeCompare(b.firstName ?? '');
  });
  return list;
}

function listingStateOf(user: User): JobProfileListingState {
  return user.jobProfileListingState ?? JobProfileListingState.NOT_LISTED;
}

function UserCell({ user }: { user: User }) {
  const profileHref = `${routeUsers}/${user.username}`;
  return (
    <TableCell className={cn(CELL_PAD, 'align-top text-foreground', col.user)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link href={profileHref} className="font-medium text-primary underline-offset-2 hover:underline hover:text-primary/90">
          {user.username}
        </Link>
        <span className="text-sm text-muted-foreground">({user.firstName})</span>
      </div>
    </TableCell>
  );
}

function JobListingTableSection({
  title,
  items,
  draftListingByUsername,
  onDraftStateChange,
  onSave,
  userSortDescending,
  onUserSortClick,
}: {
  title: string;
  items: User[];
  draftListingByUsername: Record<string, JobProfileListingState | undefined>;
  onDraftStateChange: (username: string, listingState: JobProfileListingState) => void;
  onSave: (user: User) => void;
  userSortDescending: boolean;
  onUserSortClick: () => void;
}) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
        <p className="text-center text-sm text-muted-foreground">No entries</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
      <div className={TABLE_WRAP_CLASS}>
        <Table className={TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-foreground', HEAD_PAD, col.user)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left font-medium text-foreground/90 transition-colors hover:text-foreground"
                  onClick={onUserSortClick}
                  title={userSortDescending ? 'Sort user ascending' : 'Sort user descending'}
                >
                  User
                  {userSortDescending ? <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden /> : <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />}
                </button>
              </TableHead>
              <TableHead className={cn('text-foreground/90', HEAD_PAD, col.state)}>Listing state</TableHead>
              <TableHead className={cn('text-right text-foreground/90', HEAD_PAD, col.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(user => {
              const comboValue = draftListingByUsername[user.username] ?? listingStateOf(user);
              return (
                <TableRow key={user.username} className="border-border/30 transition-colors hover:bg-muted/30 dark:hover:bg-muted/20">
                  <UserCell user={user} />
                  <TableCell className={cn(CELL_PAD, 'align-top text-foreground', col.state)}>
                    <ComboBox
                      menus={menuJobProfileListingStates}
                      value={comboValue}
                      searchEnabled={false}
                      onChange={(value: JobProfileListingState) => {
                        onDraftStateChange(user.username, value);
                      }}
                    />
                  </TableCell>
                  <TableCell className={cn(CELL_PAD, 'align-top', col.actions)}>
                    <div className="flex justify-end gap-1">
                      <ActionButton action={Action.SAVE} onClick={() => onSave(user)} />
                    </div>
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

export const JobListingEditor = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  /** Unsaved ComboBox edits; table membership uses `users` only until Save. */
  const [draftListingByUsername, setDraftListingByUsername] = useState<Record<string, JobProfileListingState | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [userSortDescending, setUserSortDescending] = useState(false);

  const loadUsers = useCallback(async (showInitialSpinner: boolean) => {
    if (showInitialSpinner) setLoading(true);
    try {
      const data = await getUsers(UserType.FREESTYLER);
      setUsers(data);
      setDraftListingByUsername({});
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Failed to load users.');
    } finally {
      if (showInitialSpinner) setLoading(false);
    }
  }, []);

  const handleDraftListingStateChanged = (username: string, listingState: JobProfileListingState) => {
    setDraftListingByUsername(prev => ({ ...prev, [username]: listingState }));
  };

  const handleSaveUserClicked = async (user: User) => {
    const nextState = draftListingByUsername[user.username] ?? listingStateOf(user);
    try {
      await updateJobProfileListingState(session, user.username, nextState);
      toast.success(`Listing state for ${user.username} (${user.firstName}) updated.`);
      setUsers(prev => prev.map(usr => (usr.username === user.username ? { ...usr, jobProfileListingState: nextState } : usr)));
      setDraftListingByUsername(prev => {
        const next = { ...prev };
        delete next[user.username];
        return next;
      });
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      await loadUsers(false);
    }
  };

  const handleUserSortClick = useCallback(() => {
    setUserSortDescending(d => !d);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    loadUsers(true);
  }, [status, loadUsers]);

  const filteredUsers = useMemo(() => users.filter(u => matchesUserFilter(u, filterUser)), [users, filterUser]);

  const pending = useMemo(
    () => sortUsersByUserColumn(
      filteredUsers.filter(u => listingStateOf(u) === JobProfileListingState.PENDING),
      userSortDescending,
    ),
    [filteredUsers, userSortDescending],
  );
  const denied = useMemo(
    () => sortUsersByUserColumn(
      filteredUsers.filter(u => listingStateOf(u) === JobProfileListingState.DENIED),
      userSortDescending,
    ),
    [filteredUsers, userSortDescending],
  );
  const notListed = useMemo(
    () => sortUsersByUserColumn(
      filteredUsers.filter(u => listingStateOf(u) === JobProfileListingState.NOT_LISTED),
      userSortDescending,
    ),
    [filteredUsers, userSortDescending],
  );
  const approved = useMemo(
    () => sortUsersByUserColumn(
      filteredUsers.filter(u => listingStateOf(u) === JobProfileListingState.APPROVED),
      userSortDescending,
    ),
    [filteredUsers, userSortDescending],
  );

  if (loading || status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 min-h-0 overflow-y-auto pb-4 scrollbar-none">
        <div className={PANEL_CLASS}>
          {users.length > 0 && (
            <div className="flex flex-col gap-1.5 sm:max-w-sm">
              <span className={FILTER_LABEL_CLASS}>User</span>
              <Input placeholder="Search…" value={filterUser} onChange={e => setFilterUser(e.target.value)} className="w-full" />
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-6">
            <JobListingTableSection
              title="Listing pending"
              items={pending}
              draftListingByUsername={draftListingByUsername}
              onDraftStateChange={handleDraftListingStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <JobListingTableSection
              title="Denied"
              items={denied}
              draftListingByUsername={draftListingByUsername}
              onDraftStateChange={handleDraftListingStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <JobListingTableSection
              title="Not listed"
              items={notListed}
              draftListingByUsername={draftListingByUsername}
              onDraftStateChange={handleDraftListingStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <JobListingTableSection
              title="Approved"
              items={approved}
              draftListingByUsername={draftListingByUsername}
              onDraftStateChange={handleDraftListingStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};
