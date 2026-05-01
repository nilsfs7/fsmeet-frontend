'use client';

import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { Event } from '@/domain/types/event';
import { routeEvents } from '@/domain/constants/routes';
import { EventType } from '@/domain/enums/event-type';
import { imgCompetition, imgMeeting } from '@/domain/constants/images';
import { getShortDateString } from '@/functions/time';

export interface FeaturedEventCardProps {
  event: Event;
  /** Localised label shown as a small disclosure (e.g. “Featured”). */
  badgeLabel: string;
  /** Localised CTA under the description (e.g. “View event”). */
  linkLabel: string;
}

const shellClassName = cn(
  'relative overflow-hidden rounded-xl border border-dashed border-border/70',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

/** Instagram-style portrait post (4:5) in a tall, narrow shell beside the event list. */
export function FeaturedEventCard({ event, badgeLabel, linkLabel }: FeaturedEventCardProps) {
  const href = `${routeEvents}/${event.id}`;
  const titleId = `featured-event-title-${event.id}`;
  const poster = event.imageUrlPoster;
  const fallback = event.type === EventType.MEETING ? imgMeeting : imgCompetition;
  const dateLine = moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
    ? getShortDateString(moment(event.dateFrom))
    : `${getShortDateString(moment(event.dateFrom), false)} – ${getShortDateString(moment(event.dateTo))}`;

  const badge = (
    <div className="pointer-events-none absolute right-2 top-2 z-[1] rounded-md bg-muted/90 px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-muted-foreground shadow-xs">
      {badgeLabel}
    </div>
  );

  const visual = (
    <Link
      href={href}
      className={cn(
        'relative block w-full overflow-hidden rounded-lg bg-muted/30 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
        /* Feed portrait (~Instagram 4:5), same ratio as EventCard poster */
        'aspect-[4/5]',
      )}
      aria-label={`${event.name} — ${linkLabel}`}
    >
      {poster ? (
        <Image src={poster} alt="" fill className="object-cover" sizes="(max-width: 1024px) 90vw, 260px" />
      ) : (
        // Static fallback assets (same pattern as EventCard)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallback} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      )}
    </Link>
  );

  const cta = (
    <Link href={href} className="type-body-sm pt-0.5 font-medium text-primary underline-offset-4 hover:underline">
      {linkLabel}
    </Link>
  );

  return (
    <article
      className={cn(
        shellClassName,
        /* Narrow column → vertically elongated “post” silhouette on desktop */
        'mx-auto w-full max-w-lg lg:max-w-[min(100%,15rem)]',
      )}
      aria-labelledby={titleId}
    >
      {badge}
      <div className="flex min-h-0 flex-col gap-2 p-2.5 pt-9 sm:gap-3 sm:p-3 sm:pt-10">
        {visual}
        <div className="flex min-w-0 flex-col gap-2">
          <h3 id={titleId} className="line-clamp-4 text-left text-sm font-semibold leading-tight tracking-tight text-foreground">
            <Link href={href} className="outline-none ring-offset-background focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring">
              {event.name}
            </Link>
          </h3>
          <p className="type-body-sm text-foreground/75">{dateLine}</p>
          {event.description ? <p className="type-body-sm line-clamp-6 text-foreground/85">{event.description}</p> : null}
          {cta}
        </div>
      </div>
    </article>
  );
}
