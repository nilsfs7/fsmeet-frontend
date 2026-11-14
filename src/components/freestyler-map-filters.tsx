'use client';

import { useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import ReactCountryFlag from 'react-country-flag';
import { IconAdjustmentsHorizontal, IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserTypeIcon } from '@/components/user/user-type-icon';
import { getUserTypeLabels } from '@/functions/user-type';
import { UserType } from '@/domain/enums/user-type';
import { Gender } from '@/domain/enums/gender';
import { cn } from '@/lib/utils';

const FILTER_ALL = '__all__' as const;

export interface MapFilterState {
  name: string;
  countryCode: string;
  genders: Gender[];
  userTypes: UserType[];
}

interface IMapFiltersProps {
  filters: MapFilterState;
  onChange: (next: MapFilterState) => void;
  onReset: () => void;
  defaultUserTypes: UserType[];
  defaultGenders: Gender[];
  countryOptions: { code: string; name: string; count: number }[];
  typeCounts: Partial<Record<UserType, number>>;
  resultCount: number;
  totalCount: number;
}

function sameSet<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every(v => b.includes(v));
}

/** profile types that actually have people on the map; empty types would only add noise */
function getVisibleTypes(defaultUserTypes: UserType[], typeCounts: Partial<Record<UserType, number>>) {
  return defaultUserTypes.filter(type => (typeCounts[type] ?? 0) > 0);
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value];
}

/** sm breakpoint (Tailwind 40rem): popover on larger screens, bottom sheet on phones */
function useIsSmUp() {
  return useSyncExternalStore(
    onStoreChange => {
      const mq = window.matchMedia('(min-width: 640px)');
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(min-width: 640px)').matches,
    () => true,
  );
}

function ChipToggle({ pressed, onClick, children, testId }: { pressed: boolean; onClick: () => void; children: ReactNode; testId?: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      data-testid={testId}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40',
        pressed ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {pressed && <IconCheck className="h-3.5 w-3.5" stroke={2.25} aria-hidden />}
      {children}
    </button>
  );
}

function FilterGroup({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function FilterPanelBody({ filters, onChange, defaultUserTypes, countryOptions, typeCounts }: IMapFiltersProps) {
  const t = useTranslations('/map');
  const visibleTypes = getVisibleTypes(defaultUserTypes, typeCounts);
  const allTypesSelected = visibleTypes.every(type => filters.userTypes.includes(type));

  return (
    <div className="flex flex-col gap-5">
      <FilterGroup
        title={t('filterGroupType')}
        action={
          !allTypesSelected && (
            <button type="button" className="text-xs font-semibold text-brand-strong hover:underline" onClick={() => onChange({ ...filters, userTypes: [...defaultUserTypes] })}>
              {t('filterSelectAll')}
            </button>
          )
        }
      >
        <div className="flex flex-wrap gap-2">
          {visibleTypes.map(type => (
            <ChipToggle key={type} pressed={filters.userTypes.includes(type)} onClick={() => onChange({ ...filters, userTypes: toggle(filters.userTypes, type) })} testId={`map-filter-type-${type}`}>
              <UserTypeIcon userType={type} className="h-4 w-4" />
              {getUserTypeLabels(type, t)}
              <span className="text-xs tabular-nums opacity-60">{typeCounts[type] ?? 0}</span>
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('drpDwnGender')}>
        <div className="flex flex-wrap gap-2">
          {[Gender.FEMALE, Gender.MALE].map(g => (
            <ChipToggle key={g} pressed={filters.genders.includes(g)} onClick={() => onChange({ ...filters, genders: toggle(filters.genders, g) })} testId={`map-filter-gender-${g}`}>
              {g === Gender.FEMALE ? t('filterGenderFemale') : t('filterGenderMale')}
            </ChipToggle>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t('filterGenderHint')}</p>
      </FilterGroup>

      {countryOptions.length > 0 && (
        <FilterGroup title={t('filterUserCountry')}>
          <Select value={filters.countryCode || FILTER_ALL} onValueChange={v => onChange({ ...filters, countryCode: v === FILTER_ALL ? '' : v })}>
            <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-border bg-background text-left" data-testid="map-filter-country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value={FILTER_ALL}>{t('filterAllCountries')}</SelectItem>
              {countryOptions.map(({ code, name, count }) => (
                <SelectItem key={code} value={code}>
                  <span className="inline-flex items-center gap-2">
                    <ReactCountryFlag countryCode={code} svg style={{ width: '1.1rem', height: '0.8rem', borderRadius: '2px' }} aria-hidden />
                    {name}
                    <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterGroup>
      )}
    </div>
  );
}

function PanelFooter({ onReset, onDone, canReset, resultCount }: { onReset: () => void; onDone: () => void; canReset: boolean; resultCount: number }) {
  const t = useTranslations('/map');
  return (
    <div className="flex items-center justify-between gap-2">
      <Button type="button" variant="outline" className="h-10 rounded-xl px-4 text-sm" onClick={onReset} disabled={!canReset} data-testid="map-filters-reset">
        {t('filterClearAll')}
      </Button>
      <Button type="button" variant="action" className={cn(ctaActionButtonClassName, 'h-10 min-w-0! px-5 text-sm')} onClick={onDone} data-testid="map-filters-done">
        {t('btnShowResults', { count: resultCount })}
      </Button>
    </div>
  );
}

export function MapFilters(props: IMapFiltersProps) {
  const { filters, onChange, onReset, defaultUserTypes, defaultGenders, countryOptions, typeCounts, resultCount, totalCount } = props;
  const t = useTranslations('/map');
  const isSmUp = useIsSmUp();
  const [open, setOpen] = useState(false);

  const visibleTypes = getVisibleTypes(defaultUserTypes, typeCounts);
  const selectedVisibleTypes = visibleTypes.filter(type => filters.userTypes.includes(type));
  const typesChanged = selectedVisibleTypes.length !== visibleTypes.length;
  const gendersChanged = !sameSet(filters.genders, defaultGenders);
  const activeCount = (filters.countryCode ? 1 : 0) + (typesChanged ? 1 : 0) + (gendersChanged ? 1 : 0);
  const canReset = activeCount > 0 || Boolean(filters.name.trim());

  // removable chips for what is currently narrowing the map
  const activeChips = useMemo(() => {
    const chips: { key: string; label: ReactNode; clear: () => void }[] = [];
    if (filters.countryCode) {
      const name = countryOptions.find(c => c.code === filters.countryCode)?.name ?? filters.countryCode;
      chips.push({
        key: 'country',
        label: (
          <>
            <ReactCountryFlag countryCode={filters.countryCode} svg style={{ width: '1rem', height: '0.75rem', borderRadius: '2px' }} aria-hidden />
            {name}
          </>
        ),
        clear: () => onChange({ ...filters, countryCode: '' }),
      });
    }
    if (typesChanged) {
      const label =
        selectedVisibleTypes.length > 0 && selectedVisibleTypes.length <= 2
          ? selectedVisibleTypes.map(type => getUserTypeLabels(type, t)).join(', ')
          : t('filterChipTypes', { count: selectedVisibleTypes.length });
      chips.push({ key: 'types', label, clear: () => onChange({ ...filters, userTypes: [...defaultUserTypes] }) });
    }
    if (gendersChanged) {
      const label =
        filters.genders.length === 1 ? (filters.genders[0] === Gender.FEMALE ? t('filterGenderFemale') : t('filterGenderMale')) : t('filterChipNoGender');
      chips.push({ key: 'gender', label, clear: () => onChange({ ...filters, genders: [...defaultGenders] }) });
    }
    return chips;
  }, [filters, countryOptions, typesChanged, selectedVisibleTypes, gendersChanged, defaultUserTypes, defaultGenders, onChange, t]);

  const trigger = (
    <button
      type="button"
      aria-label={t('btnFilters')}
      aria-expanded={open}
      data-testid="map-filters-toggle"
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors',
        open || activeCount > 0 ? 'border-brand/40 bg-brand-soft text-brand-strong' : 'border-border bg-background text-foreground hover:bg-muted',
      )}
    >
      <IconAdjustmentsHorizontal className="h-4 w-4" stroke={1.75} aria-hidden />
      <span className="hidden sm:inline">{t('btnFilters')}</span>
      {activeCount > 0 && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-2xs font-semibold text-brand-foreground">{activeCount}</span>}
    </button>
  );

  return (
    // compact floating toolbar; keeps clear of the fullscreen control (top right) on phones
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-col gap-2 pr-12 sm:inset-x-auto sm:left-4 sm:top-4 sm:w-[24rem] sm:pr-0">
      <div className="pointer-events-auto rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" stroke={1.75} aria-hidden />
            <Input
              type="search"
              placeholder={t('inputSearchPlaceholder')}
              aria-label={t('inputSearchPlaceholder')}
              value={filters.name}
              onChange={event => onChange({ ...filters, name: event.target.value })}
              className="h-10 w-full min-w-0 rounded-xl border-transparent bg-muted/60 pl-9 shadow-none focus-visible:bg-background"
              data-testid="map-search"
            />
          </div>

          {isSmUp ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={10}
                collisionPadding={12}
                className="flex max-h-[min(32rem,var(--radix-popover-content-available-height))] w-[24rem] flex-col gap-4 overflow-y-auto rounded-2xl border-border bg-background p-4 text-foreground shadow-xl"
                data-testid="map-filters-panel"
              >
                <FilterPanelBody {...props} />
                <div className="border-t border-border pt-3">
                  <PanelFooter onReset={onReset} onDone={() => setOpen(false)} canReset={canReset} resultCount={resultCount} />
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
              <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                  className="fixed inset-x-0 bottom-0 z-[200] flex max-h-[85dvh] flex-col rounded-t-3xl border-t border-border bg-background text-foreground shadow-2xl outline-hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10"
                  data-testid="map-filters-panel"
                >
                  <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-border" aria-hidden />
                  <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-3">
                    <DialogPrimitive.Title className="text-lg font-semibold">{t('filterSheetTitle')}</DialogPrimitive.Title>
                    <DialogPrimitive.Close className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted" aria-label={t('btnCloseFilters')}>
                      <IconX className="h-5 w-5" stroke={1.75} />
                    </DialogPrimitive.Close>
                  </div>
                  <DialogPrimitive.Description className="sr-only">{t('resultsCount', { count: resultCount })}</DialogPrimitive.Description>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
                    <FilterPanelBody {...props} />
                  </div>
                  <div className="border-t border-border px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
                    <PanelFooter onReset={onReset} onDone={() => setOpen(false)} canReset={canReset} resultCount={resultCount} />
                  </div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-1.5 pb-0.5 pt-1.5 text-xs text-muted-foreground">
          <span aria-live="polite" data-testid="map-result-count">
            {resultCount === totalCount ? t('resultsCount', { count: resultCount }) : t('resultsCountOf', { count: resultCount, total: totalCount })}
          </span>
          {canReset && (
            <button type="button" onClick={onReset} className="font-semibold text-brand-strong hover:underline">
              {t('filterClearAll')}
            </button>
          )}
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="pointer-events-auto flex flex-wrap gap-1.5" data-testid="map-active-filters">
          {activeChips.map(chip => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              aria-label={t('filterRemoveChip')}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background/95 pl-3 pr-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-md hover:bg-muted"
            >
              {chip.label}
              <IconX className="h-3.5 w-3.5 text-muted-foreground" stroke={2} aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
