'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'sonner';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { PageInset } from '@/components/layout/page-inset';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { AppDataStateListSkeleton } from '@/components/shared/app-data-state-list-skeleton';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { routeAdminOverview, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { User } from '@/domain/types/user';
import { getUsers, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { cn } from '@/lib/utils';

const ALL_STATES = 'all';

const STATE_LABEL: Record<UserVerificationState, string> = {
  [UserVerificationState.VERIFICATION_PENDING]: 'Waiting for verification',
  [UserVerificationState.NOT_VERIFIED]: 'Not verified',
  [UserVerificationState.DENIED]: 'Denied',
  [UserVerificationState.VERIFIED]: 'Verified',
};

const STATE_RANK: Record<UserVerificationState, number> = {
  [UserVerificationState.VERIFICATION_PENDING]: 0,
  [UserVerificationState.NOT_VERIFIED]: 1,
  [UserVerificationState.DENIED]: 2,
  [UserVerificationState.VERIFIED]: 3,
};

type SortKey = 'name' | 'state';

const cardSurface = cn(
  'min-w-0 rounded-xl border border-border/60 bg-secondary-light/85 p-3 shadow-xs sm:p-4',
  'dark:border-border/50 dark:bg-background/60',
);

function displayName(user: User): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
}

function matchesQuery(user: User, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const name = displayName(user).toLowerCase();
  return user.username.toLowerCase().includes(needle) || name.includes(needle) || (user.nickName?.toLowerCase().includes(needle) ?? false);
}

function displayedState(user: User, drafts: Record<string, UserVerificationState>): UserVerificationState | undefined {
  return drafts[user.username] ?? user.verificationState;
}

async function mapWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

function sortUsers(users: User[], sort: SortKey): User[] {
  const list = [...users];
  list.sort((a, b) => {
    if (sort === 'state') {
      const rankA = STATE_RANK[a.verificationState ?? UserVerificationState.NOT_VERIFIED];
      const rankB = STATE_RANK[b.verificationState ?? UserVerificationState.NOT_VERIFIED];
      if (rankA !== rankB) return rankA - rankB;
    }
    const byName = (displayName(a) || a.username).localeCompare(displayName(b) || b.username, undefined, { sensitivity: 'base' });
    return byName !== 0 ? byName : a.username.localeCompare(b.username);
  });
  return list;
}

export const VerificationEditor = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.username === AdministrativeUser.ADMIN;

  const [users, setUsers] = useState<User[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState(ALL_STATES);
  const [sort, setSort] = useState<SortKey>('state');
  const [draftByUsername, setDraftByUsername] = useState<Record<string, UserVerificationState>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'loading' || !isAdmin) return;

    let cancelled = false;
    getUsers()
      .then(data => {
        if (cancelled) return;
        setUsers(data);
        setDraftByUsername({});
        setLoadError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error && error.message ? error.message : 'Users could not be loaded.');
      });

    return () => {
      cancelled = true;
    };
  }, [status, isAdmin, reloadKey]);

  const visibleUsers = useMemo(() => {
    const filtered = (users ?? []).filter(user => {
      if (stateFilter !== ALL_STATES && user.verificationState !== stateFilter) return false;
      return matchesQuery(user, query);
    });
    return sortUsers(filtered, sort);
  }, [users, stateFilter, query, sort]);

  const dirtyUsers = useMemo(
    () => (users ?? []).filter(user => draftByUsername[user.username] && draftByUsername[user.username] !== user.verificationState),
    [users, draftByUsername],
  );

  const handleDraftChanged = (user: User, nextState: UserVerificationState) => {
    if (!isAdmin || saving) return;
    setDraftByUsername(current => {
      const next = { ...current };
      if (nextState === user.verificationState) delete next[user.username];
      else next[user.username] = nextState;
      return next;
    });
  };

  const handleSave = async () => {
    if (!isAdmin || dirtyUsers.length === 0 || saving) return;
    setSaving(true);
    const saved: string[] = [];
    const failed: string[] = [];

    await mapWithConcurrency(dirtyUsers, 4, async user => {
      const nextState = draftByUsername[user.username];
      if (!nextState) return;
      try {
        await updateUserVerificationState(session, user.username, nextState);
        saved.push(user.username);
      } catch {
        failed.push(user.username);
      }
    });

    setUsers(current => (current ?? []).map(user => (saved.includes(user.username) ? { ...user, verificationState: draftByUsername[user.username] } : user)));
    setDraftByUsername(current => {
      const next = { ...current };
      for (const username of saved) delete next[username];
      return next;
    });
    setSaving(false);

    if (failed.length === 0) toast.success(saved.length === 1 ? '1 user updated.' : `${saved.length} users updated.`);
    else toast.error(`Saved ${saved.length}. Could not update ${failed.join(', ')}.`);
  };

  let content: ReactNode;
  if (status !== 'loading' && !isAdmin) {
    content = <AppDataStateError title="Admin only" message="Only the user admin can manage verification." className="max-w-none" />;
  } else if (loadError) {
    content = (
      <AppDataStateError
        title="Could not load users"
        message={loadError}
        onRetry={() => {
          setUsers(null);
          setLoadError('');
          setReloadKey(key => key + 1);
        }}
        className="max-w-none"
      />
    );
  } else if (status === 'loading' || users === null) {
    content = <AppDataStateListSkeleton rows={5} className="max-w-none" />;
  } else {
    content = (
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:max-w-sm">
            <label className="mb-1 block text-xs text-muted-foreground" htmlFor="admin-verification-search">
              Search
            </label>
            <Input id="admin-verification-search" type="search" value={query} placeholder="Name or username" onChange={event => setQuery(event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <div className="min-w-0 sm:w-56">
              <span className="mb-1 block text-xs text-muted-foreground">State</span>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger aria-label="State">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_STATES}>All states</SelectItem>
                  {Object.values(UserVerificationState).map(state => (
                    <SelectItem key={state} value={state}>
                      {STATE_LABEL[state]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 sm:w-40">
              <span className="mb-1 block text-xs text-muted-foreground">Sort</span>
              <Select value={sort} onValueChange={value => setSort(value as SortKey)}>
                <SelectTrigger aria-label="Sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {visibleUsers.length} of {users.length}
        </p>

        {users.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No users" />
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No matching users" description="Change the search or the state filter." />
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visibleUsers.map(user => {
              const state = displayedState(user, draftByUsername);
              const dirty = Boolean(draftByUsername[user.username] && draftByUsername[user.username] !== user.verificationState);
              const name = displayName(user);
              return (
                <li key={user.username} className={cardSurface}>
                  <Link href={`${routeUsers}/${user.username}`} className="wrap-break-word text-base font-semibold leading-snug hover:underline">
                    {user.username}
                  </Link>
                  {name && <p className="mt-0.5 text-xs text-muted-foreground">{name}</p>}

                  <div className="mt-3 max-w-xs">
                    <span className="mb-1 block text-xs text-muted-foreground">Verification</span>
                    <Select value={state ?? ''} disabled={saving} onValueChange={value => handleDraftChanged(user, value as UserVerificationState)}>
                      <SelectTrigger aria-label={`Verification of ${user.username}`} className={cn(dirty && 'border-primary')}>
                        <SelectValue placeholder="Not set" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(UserVerificationState).map(option => (
                          <SelectItem key={option} value={option}>
                            {STATE_LABEL[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Toaster richColors />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset>{content}</PageInset>
      </div>

      <Navigation>
        <ActionButton href={routeAdminOverview} action={Action.BACK} />
        {isAdmin && users && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={dirtyUsers.length === 0 || saving} onClick={() => void handleSave()}>
            {saving ? 'Saving…' : dirtyUsers.length > 0 ? `Save (${dirtyUsers.length})` : 'Save'}
          </Button>
        )}
      </Navigation>
    </div>
  );
};
