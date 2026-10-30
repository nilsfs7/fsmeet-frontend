'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
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
import { License } from '@/domain/types/license';
import { getLicenses, updateLicense } from '@/infrastructure/clients/license.client';
import { getUsers } from '@/infrastructure/clients/user.client';
import { cn } from '@/lib/utils';

const MAX_LICENSES = 99;

type NameMeta = { firstName?: string; lastName?: string };
type SortKey = 'name' | 'amount';

const cardSurface = cn(
  'min-w-0 rounded-xl border border-border/60 bg-secondary-light/85 p-3 shadow-xs sm:p-4',
  'dark:border-border/50 dark:bg-background/60',
);

function displayName(meta?: NameMeta): string {
  return [meta?.firstName, meta?.lastName].filter(Boolean).join(' ').trim();
}

function matchesQuery(license: License, query: string, meta?: NameMeta): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const name = displayName(meta).toLowerCase();
  return license.username.toLowerCase().includes(needle) || name.includes(needle);
}

function displayedAmount(license: License, drafts: Record<string, number>): number {
  return drafts[license.username] ?? license.amountEventLicenses;
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

function sortLicenses(licenses: License[], sort: SortKey, names: Record<string, NameMeta>): License[] {
  const list = [...licenses];
  list.sort((a, b) => {
    if (sort === 'amount' && a.amountEventLicenses !== b.amountEventLicenses) {
      return b.amountEventLicenses - a.amountEventLicenses;
    }
    const nameA = displayName(names[a.username]) || a.username;
    const nameB = displayName(names[b.username]) || b.username;
    const byName = nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    return byName !== 0 ? byName : a.username.localeCompare(b.username);
  });
  return list;
}

export const LicensesEditor = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.username === AdministrativeUser.ADMIN;

  const [licenses, setLicenses] = useState<License[] | null>(null);
  const [names, setNames] = useState<Record<string, NameMeta>>({});
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [draftByUsername, setDraftByUsername] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'loading' || !isAdmin) return;

    let cancelled = false;
    getLicenses(session)
      .then(async data => {
        if (!Array.isArray(data)) throw new Error('Licenses could not be loaded.');
        let meta: Record<string, NameMeta> = {};
        try {
          const users = await getUsers();
          if (Array.isArray(users)) {
            for (const user of users) {
              meta[user.username] = { firstName: user.firstName, lastName: user.lastName };
            }
          }
        } catch {
          meta = {};
        }
        if (cancelled) return;
        setLicenses(data);
        setNames(meta);
        setDraftByUsername({});
        setLoadError('');
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error && error.message ? error.message : 'Licenses could not be loaded.');
      });

    return () => {
      cancelled = true;
    };
  }, [status, isAdmin, session, reloadKey]);

  const visibleLicenses = useMemo(() => {
    const filtered = (licenses ?? []).filter(license => matchesQuery(license, query, names[license.username]));
    return sortLicenses(filtered, sort, names);
  }, [licenses, names, query, sort]);

  const dirtyLicenses = useMemo(
    () => (licenses ?? []).filter(license => draftByUsername[license.username] !== undefined && draftByUsername[license.username] !== license.amountEventLicenses),
    [licenses, draftByUsername],
  );

  const handleAdjust = (license: License, diff: number) => {
    if (!isAdmin || saving) return;
    const nextAmount = displayedAmount(license, draftByUsername) + diff;
    if (nextAmount < 0 || nextAmount > MAX_LICENSES) return;
    setDraftByUsername(current => {
      const next = { ...current };
      if (nextAmount === license.amountEventLicenses) delete next[license.username];
      else next[license.username] = nextAmount;
      return next;
    });
  };

  const handleSave = async () => {
    if (!isAdmin || dirtyLicenses.length === 0 || saving) return;
    setSaving(true);
    const saved: string[] = [];
    const failed: string[] = [];

    await mapWithConcurrency(dirtyLicenses, 4, async license => {
      const amount = draftByUsername[license.username];
      if (amount === undefined) return;
      try {
        await updateLicense(session, { username: license.username, amountEventLicenses: amount });
        saved.push(license.username);
      } catch {
        failed.push(license.username);
      }
    });

    setLicenses(current =>
      (current ?? []).map(license => {
        const amount = draftByUsername[license.username];
        return saved.includes(license.username) && amount !== undefined ? { ...license, amountEventLicenses: amount } : license;
      }),
    );
    setDraftByUsername(current => {
      const next = { ...current };
      for (const username of saved) delete next[username];
      return next;
    });
    setSaving(false);

    if (failed.length === 0) toast.success(saved.length === 1 ? '1 license updated.' : `${saved.length} licenses updated.`);
    else toast.error(`Saved ${saved.length}. Could not update ${failed.join(', ')}.`);
  };

  let content: ReactNode;
  if (status !== 'loading' && !isAdmin) {
    content = <AppDataStateError title="Admin only" message="Only the user admin can manage licenses." className="max-w-none" />;
  } else if (loadError) {
    content = (
      <AppDataStateError
        title="Could not load licenses"
        message={loadError}
        onRetry={() => {
          setLicenses(null);
          setLoadError('');
          setReloadKey(key => key + 1);
        }}
        className="max-w-none"
      />
    );
  } else if (status === 'loading' || licenses === null) {
    content = <AppDataStateListSkeleton rows={5} className="max-w-none" />;
  } else {
    content = (
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:max-w-sm">
            <label className="mb-1 block text-xs text-muted-foreground" htmlFor="admin-licenses-search">
              Search
            </label>
            <Input id="admin-licenses-search" type="search" value={query} placeholder="Name or username" onChange={event => setQuery(event.target.value)} />
          </div>
          <div className="min-w-0 sm:w-40">
            <span className="mb-1 block text-xs text-muted-foreground">Sort</span>
            <Select value={sort} onValueChange={value => setSort(value as SortKey)}>
              <SelectTrigger aria-label="Sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {visibleLicenses.length} of {licenses.length}
        </p>

        {licenses.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No licenses" />
          </div>
        ) : visibleLicenses.length === 0 ? (
          <div className="flex justify-center">
            <AppDataStateEmpty title="No matching licenses" description="Change the search." />
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {visibleLicenses.map(license => {
              const amount = displayedAmount(license, draftByUsername);
              const dirty = draftByUsername[license.username] !== undefined && draftByUsername[license.username] !== license.amountEventLicenses;
              const name = displayName(names[license.username]);
              return (
                <li key={license.username} className={cardSurface}>
                  <Link href={`${routeUsers}/${license.username}`} className="wrap-break-word text-base font-semibold leading-snug hover:underline">
                    {license.username}
                  </Link>
                  {name && <p className="mt-0.5 text-xs text-muted-foreground">{name}</p>}

                  <div className="mt-3">
                    <span className="mb-1 block text-xs text-muted-foreground">Event licenses</span>
                    <div className={cn('inline-flex items-center gap-1 rounded-lg border border-border px-1 py-1', dirty && 'border-primary')}>
                      <Button
                        type="button"
                        variant="actionIcon"
                        size="iconSm"
                        aria-label={`Remove one license from ${license.username}`}
                        disabled={saving || amount <= 0}
                        onClick={() => handleAdjust(license, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center text-base font-semibold tabular-nums">{amount}</span>
                      <Button
                        type="button"
                        variant="actionIcon"
                        size="iconSm"
                        aria-label={`Add one license for ${license.username}`}
                        disabled={saving || amount >= MAX_LICENSES}
                        onClick={() => handleAdjust(license, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
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
        {isAdmin && licenses && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} disabled={dirtyLicenses.length === 0 || saving} onClick={() => void handleSave()}>
            {saving ? 'Saving…' : dirtyLicenses.length > 0 ? `Save (${dirtyLicenses.length})` : 'Save'}
          </Button>
        )}
      </Navigation>
    </div>
  );
};
