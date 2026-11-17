'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconSearch, IconSpeakerphone } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import ActionButton from '@/components/common/action-button';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { imgImagePlaceholder, imgUserNoImg } from '@/domain/constants/images';
import { routeAds, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import type { ReadAdvertisementResponseDto } from '@/infrastructure/clients/dtos/advertisement/read-advertisement-response-dto';
import { cn } from '@/lib/utils';

export type AdOwner = { username: string; displayName: string; imageUrl?: string };

type StatusFilter = 'all' | 'active' | 'inactive';
const ALL_OWNERS = '__all__';

interface IAdsAdminListProps {
  advertisements: ReadAdvertisementResponseDto[];
  owners: AdOwner[];
  /** The acting admin; edit / stats stay available for own ads only (the backend allows them for the owner only). */
  currentUsername: string;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Read-only overview of every ad for the app admin: search, owner and status filter, owner info. No reordering. */
export function AdsAdminList({ advertisements, owners, currentUsername }: IAdsAdminListProps) {
  const t = useTranslations('/ads');
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState<string>(ALL_OWNERS);
  const [status, setStatus] = useState<StatusFilter>('all');

  const ownerByName = useMemo(() => new Map(owners.map(o => [o.username, o])), [owners]);
  const ownerNames = useMemo(() => [...new Set(advertisements.map(ad => ad.username))].sort((a, b) => a.localeCompare(b)), [advertisements]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return advertisements
      .filter(ad => owner === ALL_OWNERS || ad.username === owner)
      .filter(ad => status === 'all' || (status === 'active' ? ad.enabled : !ad.enabled))
      .filter(ad => {
        if (!q) return true;
        const o = ownerByName.get(ad.username);
        return [ad.title, ad.description, ad.targetUrl, ad.username, o?.displayName].some(v => v?.toLowerCase().includes(q));
      })
      .sort((a, b) => a.username.localeCompare(b.username) || (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [advertisements, owner, status, query, ownerByName]);

  const hasFilters = query.trim() !== '' || owner !== ALL_OWNERS || status !== 'all';
  const reset = () => {
    setQuery('');
    setOwner(ALL_OWNERS);
    setStatus('all');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-background p-2 shadow-xs">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
            <Input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('adminSearchPlaceholder')} aria-label={t('adminSearchPlaceholder')} className="h-10 w-full rounded-xl pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger className="h-10 min-w-0 rounded-xl sm:w-44" aria-label={t('adminFilterOwner')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OWNERS}>{t('adminFilterOwnerAll')}</SelectItem>
                {ownerNames.map(name => (
                  <SelectItem key={name} value={name}>
                    {ownerByName.get(name)?.displayName && ownerByName.get(name)?.displayName !== name ? `${ownerByName.get(name)?.displayName} (@${name})` : name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={v => setStatus(v as StatusFilter)}>
              <SelectTrigger className="h-10 min-w-0 rounded-xl sm:w-36" aria-label={t('adminFilterStatus')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('adminFilterStatusAll')}</SelectItem>
                <SelectItem value="active">{t('chipActive')}</SelectItem>
                <SelectItem value="inactive">{t('chipInactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <p className="px-1 text-xs text-muted-foreground" data-testid="ads-admin-count">
        {t('adminResultCount', { shown: filtered.length, total: advertisements.length, owners: ownerNames.length })}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<IconSpeakerphone stroke={1.75} aria-hidden />}
          title={t('adminNoMatches')}
          action={
            hasFilters ? (
              <Button type="button" variant="outline" onClick={reset}>
                {t('adminResetFilters')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-3" data-testid="ads-admin-list">
          {filtered.map(ad => {
            const o = ownerByName.get(ad.username);
            const own = ad.username === currentUsername;
            return (
              <li key={ad.id} className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-background p-3 shadow-xs sm:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- remote ad creatives from the backend */}
                <img
                  src={ad.imageUrl || imgImagePlaceholder}
                  alt=""
                  className={cn('h-16 w-16 shrink-0 rounded-xl bg-muted sm:h-20 sm:w-20', ad.imageUrl ? 'object-cover' : 'object-contain p-4 opacity-40 dark:invert')}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate font-semibold text-foreground">{ad.title}</p>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold', ad.enabled ? 'bg-brand-soft text-brand-strong' : 'bg-muted text-muted-foreground')}>
                      {ad.enabled ? t('chipActive') : t('chipInactive')}
                    </span>
                  </div>
                  {ad.description && <p className="line-clamp-2 text-sm text-muted-foreground">{ad.description}</p>}
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                      <Link href={`${routeUsers}/${ad.username}`} className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-border py-0.5 pl-0.5 pr-2 font-medium text-foreground hover:bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element -- avatar from the backend */}
                        <img src={o?.imageUrl || imgUserNoImg} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
                        <span className="truncate">{o?.displayName ?? ad.username}</span>
                        {o && o.displayName !== ad.username && <span className="hidden font-normal text-muted-foreground sm:inline">@{ad.username}</span>}
                      </Link>
                      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate hover:underline">
                        {hostOf(ad.targetUrl)}
                      </a>
                    </div>
                    {own && (
                      <div className="flex shrink-0 items-center gap-1">
                        <ActionButton href={`${routeAds}/${ad.id}/stats`} action={Action.STATISTICS} tooltip={t('tooltipViewStats')} />
                        <ActionButton href={`${routeAds}/${ad.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditAd')} />
                      </div>
                    )}
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
