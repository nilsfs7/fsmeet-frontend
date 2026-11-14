'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateLong, formatDateRange } from '@/lib/format-date';
import ReactCountryFlag from 'react-country-flag';
import { IconCalendarEvent, IconMapPin, IconStarFilled, IconWorld } from '@tabler/icons-react';
import { Event } from '@/domain/types/event';
import { User } from '@/domain/types/user';
import { EventType } from '@/domain/enums/event-type';
import { EventCategory } from '@/domain/enums/event-category';
import { routeUsers } from '@/domain/constants/routes';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { isPublicEventState } from '@/functions/event-state';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { NotListedLabel } from '@/components/events/not-listed-label';
import { EventPosterPlaceholder, EventTypeGlyph } from '@/components/events/event-type-icon';
import { ImageLightbox } from '@/components/common/image-lightbox';
import { cn } from '@/lib/utils';

const typeBadgeClass: Record<EventType, string> = {
  [EventType.COMPETITION]: 'bg-brand-soft text-brand-strong',
  [EventType.COMPETITION_ONLINE]: 'bg-sky-50 text-sky-700',
  [EventType.MEETING]: 'bg-amber-50 text-amber-700',
};

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/80 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 wrap-break-word text-sm font-semibold leading-snug text-foreground sm:text-base">{children}</div>
      </div>
    </div>
  );
}

interface IEventHero {
  event: Event;
  eventAdmin?: User;
}

/** Event details header: poster, type/category badges, title and the key facts (when, where, organizer). */
export const EventHero = ({ event, eventAdmin }: IEventHero) => {
  const t = useTranslations('/events/eventid');
  const tEvents = useTranslations('/events');
  const locale = useLocale();
  const [posterPreviewOpen, setPosterPreviewOpen] = useState(false);

  const hasPoster = Boolean(event.imageUrlPoster);
  const from = moment(event.dateFrom);
  const to = moment(event.dateTo);
  const sameDay = from.isSame(to, 'day');
  const when = sameDay ? formatDateLong(from.toDate(), locale) : formatDateRange(from.toDate(), to.toDate(), locale);

  const typeLabel = event.type === EventType.MEETING ? tEvents('eventTypeMeet') : event.type === EventType.COMPETITION_ONLINE ? tEvents('eventTypeCompOnline') : tEvents('eventTypeComp');
  const categoryLabels: Record<EventCategory, string> = {
    [EventCategory.CONTINENTAL]: tEvents('eventCatContinental'),
    [EventCategory.INTERNATIONAL]: tEvents('eventCatInternational'),
    [EventCategory.NATIONAL]: tEvents('eventCatNational'),
    [EventCategory.PULSE]: tEvents('eventCatPulse'),
    [EventCategory.SUPERBALL]: tEvents('eventCatSuperball'),
    [EventCategory.WFFC]: tEvents('eventCatWffc'),
  };
  const categoryLabel = event.type !== EventType.MEETING && event.category ? categoryLabels[event.category] : undefined;

  const isOnline = event.type === EventType.COMPETITION_ONLINE;
  const adminName = eventAdmin ? [eventAdmin.firstName, eventAdmin.lastName].filter(Boolean).join(' ') || eventAdmin.username : event.admin;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-xs">
      {hasPoster && (
        <ImageLightbox open={posterPreviewOpen} onOpenChange={setPosterPreviewOpen} src={event.imageUrlPoster!} title={event.name} alt={event.name ?? ''} />
      )}

      <div className="flex flex-col gap-5 p-4 sm:flex-row sm:gap-6 sm:p-6 md:gap-8">
        {/* poster */}
        <div className="w-full shrink-0 sm:w-40 md:w-44 lg:w-48">
          <button
            type="button"
            disabled={!hasPoster}
            onClick={() => setPosterPreviewOpen(true)}
            aria-label={t('tabOverviewPosterPreview')}
            className={cn(
              'group relative block w-full overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border outline-hidden focus-visible:ring-2 focus-visible:ring-brand',
              hasPoster ? 'aspect-4/5 max-sm:mx-auto max-sm:max-w-56' : 'aspect-[16/7] sm:aspect-4/5',
            )}
          >
            {hasPoster ? (
              <img src={event.imageUrlPoster} alt="" className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]" />
            ) : (
              <EventPosterPlaceholder eventType={event.type} />
            )}
          </button>
        </div>

        {/* title + facts */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', typeBadgeClass[event.type] ?? 'bg-muted text-foreground')}>
                <EventTypeGlyph eventType={event.type} className="h-3.5 w-3.5" />
                {typeLabel}
              </span>
              {categoryLabel && <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-foreground/80">{categoryLabel}</span>}
              {event.isWffaRanked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <IconStarFilled className="h-3 w-3" aria-hidden />
                  {t('tabOverviewPerkWffaRanked')}
                </span>
              )}
              {!isPublicEventState(event.state) && <NotListedLabel />}
            </div>
            <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">{event.name}</h1>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Fact icon={<IconCalendarEvent stroke={1.75} />} label={t('lblWhen')}>
              {when}
            </Fact>

            <Fact icon={isOnline ? <IconWorld stroke={1.75} /> : <IconMapPin stroke={1.75} />} label={t('lblWhere')}>
              {isOnline ? (
                t('tabOverviewOnline')
              ) : (
                <span className="inline-flex flex-wrap items-center gap-x-1.5">
                  {event.venueCountryCode && event.venueCountryCode !== '--' && (
                    <ReactCountryFlag countryCode={event.venueCountryCode} svg style={{ width: '1.1em', height: '0.8em', borderRadius: '2px' }} title={event.venueCountryCode} />
                  )}
                  <span>{[event.venueCity, event.venueCountryCode && event.venueCountryCode !== '--' ? getCountryNameByCode(event.venueCountryCode) : undefined].filter(Boolean).join(', ') || '\u2014'}</span>
                </span>
              )}
            </Fact>

            {event.admin && (
              <Link href={`${routeUsers}/${event.admin}`} className="group -m-1.5 flex min-w-0 items-center gap-3 rounded-2xl p-1.5 transition-colors hover:bg-muted sm:col-span-2">
                <img src={eventAdmin?.imageUrl || imgUserDefaultImg} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border" />
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('lblOrganizer')}</div>
                  <div className="truncate text-sm font-semibold text-foreground group-hover:underline sm:text-base">{adminName}</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
