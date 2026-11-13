'use client';

import Link from 'next/link';
import moment from 'moment';
import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IconCalendarEvent, IconCheck, IconMapPin, IconWorld } from '@tabler/icons-react';
import { Event } from '@/domain/types/event';
import { EventType } from '@/domain/enums/event-type';
import { routeEvents } from '@/domain/constants/routes';
import { EventPosterPlaceholder } from '@/components/events/event-type-icon';
import { formatDateLong, formatDateRange } from '@/lib/format-date';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { LabeledStepper } from '@/components/common/labeled-stepper';

/** Compact event identity shown above every registration step. */
export function RegistrationEventHeader({ event, title, children }: { event: Event; title: string; children?: ReactNode }) {
  const locale = useLocale();
  const tEvent = useTranslations('/events/eventid');
  const from = moment(event.dateFrom);
  const to = moment(event.dateTo);
  const when = from.isSame(to, 'day') ? formatDateLong(from.toDate(), locale) : formatDateRange(from.toDate(), to.toDate(), locale);
  const isOnline = event.type === EventType.COMPETITION_ONLINE;
  const where = isOnline ? null : [event.venueCity, event.venueCountryCode && event.venueCountryCode !== '--' ? getCountryNameByCode(event.venueCountryCode) : undefined].filter(Boolean).join(', ');
  const hasPoster = !!event.imageUrlPoster;

  return (
    <header className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border bg-background p-4 shadow-xs sm:p-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link href={`${routeEvents}/${event.id}`} className="block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted ring-1 ring-border sm:h-20 sm:w-20">
          {hasPoster ? <img src={event.imageUrlPoster} alt="" className="h-full w-full object-cover" /> : <EventPosterPlaceholder eventType={event.type} />}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-strong">{title}</div>
          <Link href={`${routeEvents}/${event.id}`} className="mt-0.5 block truncate text-lg font-bold leading-tight text-foreground hover:underline sm:text-2xl">
            {event.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <IconCalendarEvent className="h-4 w-4" stroke={1.75} aria-hidden />
              {when}
            </span>
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5">
                <IconWorld className="h-4 w-4" stroke={1.75} aria-hidden />
                {tEvent('tabOverviewOnline')}
              </span>
            ) : (
              where && (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <IconMapPin className="h-4 w-4 shrink-0" stroke={1.75} aria-hidden />
                  <span className="truncate">{where}</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
      {children}
    </header>
  );
}

export function RegistrationStepper({ steps, currentIndex }: { steps: string[]; currentIndex: number }) {
  const t = useTranslations('/events/eventid/registration');
  return <LabeledStepper steps={steps} currentIndex={currentIndex} counterLabel={t('stepCounter', { current: currentIndex + 1, total: steps.length })} className="border-t border-border/70 pt-4" />;
}

export interface RegistrationSummaryGroup {
  label: string;
  items: string[];
}

/** Sticky side card summarising what the user picked so far. */
export function RegistrationSummary({ groups }: { groups: RegistrationSummaryGroup[] }) {
  const t = useTranslations('/events/eventid/registration');
  const filled = groups.filter(g => g.items.length > 0);

  return (
    <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-5">
      <h2 className="text-base font-semibold text-foreground">{t('summaryTitle')}</h2>
      {filled.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{t('summaryNone')}</p>
      ) : (
        <dl className="mt-3 flex flex-col gap-3">
          {filled.map(g => (
            <div key={g.label} className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</dt>
              <dd className="mt-1 flex flex-col gap-1">
                {g.items.map((item, i) => (
                  <span key={i} className="flex min-w-0 items-start gap-1.5 text-sm text-foreground">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" stroke={2} aria-hidden />
                    <span className="min-w-0 wrap-break-word">{item}</span>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
