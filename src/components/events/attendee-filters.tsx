'use client';

import { useLocale, useTranslations } from 'next-intl';
import { IconFilterOff, IconSearch, IconX } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toIntlLocale } from '@/lib/format-date';
import type { User } from '@/domain/types/user';

export const FILTER_ALL = 'all';

export type AttendeeFilterOption = { value: string; label: string; count?: number };

export type AttendeeSelectFilter = {
  id: string;
  label: string;
  value: string;
  options: AttendeeFilterOption[];
  onChange: (value: string) => void;
};

interface AttendeeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  /** Dropdown filters; only filters with at least two real options are rendered. */
  filters: AttendeeSelectFilter[];
  shown: number;
  total: number;
  onReset: () => void;
}

/** Case-insensitive match against first/last/nick name and username. */
export function userMatchesSearch(user: Pick<User, 'username' | 'firstName' | 'lastName' | 'nickName'>, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return [user.firstName, user.lastName, user.nickName, user.username, `${user.firstName ?? ''} ${user.lastName ?? ''}`].some(v => (v ?? '').toLowerCase().includes(q));
}

/** Localized country name for an ISO 3166 alpha-2 code. */
export function useCountryName(): (code: string) => string {
  const locale = useLocale();
  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames([toIntlLocale(locale)], { type: 'region' });
  } catch {
    names = undefined;
  }
  return (code: string) => {
    try {
      return names?.of(code.toUpperCase()) ?? code;
    } catch {
      return code;
    }
  };
}

/** Builds options with counts from a list of values, sorted by label. */
export function optionsFromValues(values: (string | undefined | null)[], label: (value: string) => string): AttendeeFilterOption[] {
  const counts = new Map<string, number>();
  values.forEach(v => {
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  return [...counts.entries()].map(([value, count]) => ({ value, label: label(value), count })).sort((a, b) => a.label.localeCompare(b.label));
}

export function AttendeeFilters({ search, onSearchChange, filters, shown, total, onReset }: AttendeeFiltersProps) {
  const t = useTranslations('global/components/attendee-filters');
  const visibleFilters = filters.filter(f => f.options.length > 1);
  const active = search.trim().length > 0 || filters.some(f => f.value !== FILTER_ALL);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 shadow-xs sm:p-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
          <Input value={search} onChange={e => onSearchChange(e.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} className="pl-9 pr-9" />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={t('clearSearch')}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <IconX className="h-4 w-4" stroke={1.75} aria-hidden />
            </button>
          )}
        </div>

        {visibleFilters.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {visibleFilters.map(filter => (
              <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger aria-label={filter.label} className="h-10 min-w-0 sm:w-44">
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <span className="shrink-0 text-muted-foreground">{filter.label}:</span>
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value={FILTER_ALL}>{t('all')}</SelectItem>
                  {filter.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                      {option.count !== undefined && <span className="ml-1.5 text-muted-foreground">({option.count})</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span aria-live="polite">{t('shown', { shown, total })}</span>
        {active && (
          <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={onReset}>
            <IconFilterOff className="h-3.5 w-3.5" stroke={1.75} aria-hidden />
            {t('reset')}
          </Button>
        )}
      </div>
    </div>
  );
}

export function AttendeeFiltersNoMatch() {
  const t = useTranslations('global/components/attendee-filters');
  return <p className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">{t('noMatch')}</p>;
}
