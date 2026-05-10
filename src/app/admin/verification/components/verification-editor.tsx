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
import { menuUserVerificationStates } from '@/domain/constants/menus/menu-user-verification-states';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { getUsers, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

/** Same glass card as `competition-editor` / `licenses-editor`; full width for admin tables. */
const VERIFICATION_PANEL_CLASS = cn(
  'w-full min-w-0 flex flex-col gap-3',
  'rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 sm:p-3 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
  'text-sm',
);

const VERIFICATION_TABLE_WRAP_CLASS = cn(
  'min-w-0 overflow-hidden rounded-lg border border-border/50 bg-background/40',
  'dark:bg-background/30',
);

const FILTER_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none text-foreground';
const SECTION_TITLE_CLASS = 'mb-2 text-center text-sm font-semibold leading-tight text-foreground/90';

/** Align with /wffa/visa and /admin/licenses table layout */
const VERIFICATION_TABLE_CLASS = 'table-fixed w-full min-w-[40rem] border-separate border-spacing-x-3 border-spacing-y-0';

const VERIFICATION_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const VERIFICATION_CELL_PAD = 'py-2.5 px-3';

const verificationCol = {
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

function UserCell({ user }: { user: User }) {
  const profileHref = `${routeUsers}/${user.username}`;
  return (
    <TableCell className={cn(VERIFICATION_CELL_PAD, 'align-top text-foreground', verificationCol.user)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link
          href={profileHref}
          className="font-medium text-primary underline-offset-2 hover:underline hover:text-primary/90"
        >
          {user.username}
        </Link>
        <span className="text-sm text-muted-foreground">({user.firstName})</span>
      </div>
    </TableCell>
  );
}

function VerificationTableSection({
  title,
  items,
  draftVerificationByUsername,
  onDraftStateChange,
  onSave,
  userSortDescending,
  onUserSortClick,
}: {
  title: string;
  items: User[];
  draftVerificationByUsername: Record<string, UserVerificationState | undefined>;
  onDraftStateChange: (username: string, verificationState: UserVerificationState) => void;
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
      <div className={VERIFICATION_TABLE_WRAP_CLASS}>
        <Table className={VERIFICATION_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-foreground', VERIFICATION_HEAD_PAD, verificationCol.user)}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-left font-medium text-foreground/90 transition-colors hover:text-foreground"
                  onClick={onUserSortClick}
                  title={userSortDescending ? 'Sort user ascending' : 'Sort user descending'}
                >
                  User
                  {userSortDescending ? (
                    <ArrowDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  ) : (
                    <ArrowUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  )}
                </button>
              </TableHead>
              <TableHead className={cn('text-foreground/90', VERIFICATION_HEAD_PAD, verificationCol.state)}>Verification state</TableHead>
              <TableHead className={cn('text-right text-foreground/90', VERIFICATION_HEAD_PAD, verificationCol.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(user => {
              const comboValue = draftVerificationByUsername[user.username] ?? user.verificationState ?? '';
              return (
                <TableRow
                  key={user.username}
                  className="border-border/30 transition-colors hover:bg-muted/30 dark:hover:bg-muted/20"
                >
                  <UserCell user={user} />
                  <TableCell className={cn(VERIFICATION_CELL_PAD, 'align-top text-foreground', verificationCol.state)}>
                    <ComboBox
                      menus={menuUserVerificationStates}
                      value={comboValue}
                      searchEnabled={false}
                      onChange={(value: UserVerificationState) => {
                        onDraftStateChange(user.username, value);
                      }}
                    />
                  </TableCell>
                  <TableCell className={cn(VERIFICATION_CELL_PAD, 'align-top', verificationCol.actions)}>
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

export const VerificationEditor = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  /** Unsaved ComboBox edits; table membership uses `users` only until Save. */
  const [draftVerificationByUsername, setDraftVerificationByUsername] = useState<
    Record<string, UserVerificationState | undefined>
  >({});
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [userSortDescending, setUserSortDescending] = useState(false);

  const loadUsers = useCallback(async (showInitialSpinner: boolean) => {
    if (showInitialSpinner) setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setDraftVerificationByUsername({});
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Failed to load users.');
    } finally {
      if (showInitialSpinner) setLoading(false);
    }
  }, []);

  const handleDraftVerificationStateChanged = (username: string, verificationState: UserVerificationState) => {
    setDraftVerificationByUsername(prev => ({ ...prev, [username]: verificationState }));
  };

  const handleSaveUserClicked = async (user: User) => {
    const nextState = draftVerificationByUsername[user.username] ?? user.verificationState;
    try {
      if (nextState) {
        await updateUserVerificationState(session, user.username, nextState);
        toast.success(`Verification state for ${user.username} (${user.firstName}) updated.`);
        setUsers(prev =>
          prev.map(usr => (usr.username === user.username ? { ...usr, verificationState: nextState } : usr)),
        );
        setDraftVerificationByUsername(prev => {
          const next = { ...prev };
          delete next[user.username];
          return next;
        });
      }
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

  const filteredUsers = useMemo(
    () => users.filter(u => matchesUserFilter(u, filterUser)),
    [users, filterUser],
  );

  const pending = useMemo(
    () =>
      sortUsersByUserColumn(
        filteredUsers.filter(u => u.verificationState === UserVerificationState.VERIFICATION_PENDING),
        userSortDescending,
      ),
    [filteredUsers, userSortDescending],
  );
  const denied = useMemo(
    () =>
      sortUsersByUserColumn(
        filteredUsers.filter(u => u.verificationState === UserVerificationState.DENIED),
        userSortDescending,
      ),
    [filteredUsers, userSortDescending],
  );
  const notVerified = useMemo(
    () =>
      sortUsersByUserColumn(
        filteredUsers.filter(u => u.verificationState === UserVerificationState.NOT_VERIFIED),
        userSortDescending,
      ),
    [filteredUsers, userSortDescending],
  );
  const verified = useMemo(
    () =>
      sortUsersByUserColumn(
        filteredUsers.filter(u => u.verificationState === UserVerificationState.VERIFIED),
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
        <div className={VERIFICATION_PANEL_CLASS}>
          {users.length > 0 && (
            <div className="flex flex-col gap-1.5 sm:max-w-sm">
              <span className={FILTER_LABEL_CLASS}>User</span>
              <Input placeholder="Search…" value={filterUser} onChange={e => setFilterUser(e.target.value)} className="w-full" />
            </div>
          )}

          <div className="flex min-w-0 flex-col gap-6">
            <VerificationTableSection
              title="Verification pending"
              items={pending}
              draftVerificationByUsername={draftVerificationByUsername}
              onDraftStateChange={handleDraftVerificationStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <VerificationTableSection
              title="Denied"
              items={denied}
              draftVerificationByUsername={draftVerificationByUsername}
              onDraftStateChange={handleDraftVerificationStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <VerificationTableSection
              title="Not verified"
              items={notVerified}
              draftVerificationByUsername={draftVerificationByUsername}
              onDraftStateChange={handleDraftVerificationStateChanged}
              onSave={handleSaveUserClicked}
              userSortDescending={userSortDescending}
              onUserSortClick={handleUserSortClick}
            />
            <VerificationTableSection
              title="Verified"
              items={verified}
              draftVerificationByUsername={draftVerificationByUsername}
              onDraftStateChange={handleDraftVerificationStateChanged}
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
