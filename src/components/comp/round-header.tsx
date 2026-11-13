'use client';

import moment from 'moment';
import { useLocale, useTranslations } from 'next-intl';
import { IconCalendar, IconHourglassHigh } from '@tabler/icons-react';
import type { Round } from '@/domain/types/round';
import { formatDateLong } from '@/lib/format-date';
import { cn } from '@/lib/utils';

/** Round title with localized day, time-limit chip and match count; shared by schedule, grid and editors. */
export function RoundHeader({ round, actions, className }: { round: Round; actions?: React.ReactNode; className?: string }) {
  const t = useTranslations('global/components/battle-grid');
  const locale = useLocale();
  const date = moment(round.date);

  return (
    <div className={cn('flex min-w-0 items-start justify-between gap-2', className)}>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft px-1.5 text-xs font-bold text-brand-strong">{round.roundIndex + 1}</span>
          <h3 className="min-w-0 truncate text-base font-semibold text-foreground">{round.name}</h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {date.isValid() && (
            <span className="inline-flex items-center gap-1">
              <IconCalendar className="h-3.5 w-3.5" stroke={1.75} aria-hidden />
              {formatDateLong(date.toDate(), locale)}
            </span>
          )}
          <span>{t('labelMatchCount', { count: round.matches.length })}</span>
          {round.timeLimit && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              <IconHourglassHigh className="h-3 w-3" stroke={2} aria-hidden />
              {t('labelTimeLimit')}
            </span>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-1">{actions}</div>}
    </div>
  );
}
