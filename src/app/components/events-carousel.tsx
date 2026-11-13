'use client';

import EventCard from '@/components/events/event-card';
import { routeEvents } from '@/domain/constants/routes';
import Link from 'next/link';
import { Event } from '@/domain/types/event';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface IEventsCarousel {
  upcomingEvents: Event[];
  ongoingEvents: Event[];
  recentEvents: Event[];
  featuredEvents: Event[];
}

type Highlight = { key: string; label: string; event: Event; tone: string };

/**
 * Home highlights: ongoing, upcoming, featured and recent events shown side by side
 * (one column on mobile) so every highlight is visible without waiting for a slide.
 */
export const EventsCarousel = ({ upcomingEvents, ongoingEvents, recentEvents, featuredEvents }: IEventsCarousel) => {
  const t = useTranslations('/');

  const asList = (events: Event[]) => (Array.isArray(events) ? events : []);
  const highlights: Highlight[] = [
    ...asList(ongoingEvents).map(e => ({ key: `ongoing-${e.id}`, label: t('carouselCurrentEvent'), event: e, tone: 'bg-critical text-critical-foreground' })),
    ...asList(upcomingEvents).map(e => ({ key: `upcoming-${e.id}`, label: t('carouselUpcomingEvent'), event: e, tone: 'bg-brand text-brand-foreground' })),
    ...asList(featuredEvents).map(e => ({ key: `featured-${e.id}`, label: t('carouselFeaturedEvent'), event: e, tone: 'bg-amber-400 text-amber-950' })),
    ...asList(recentEvents).map(e => ({ key: `recent-${e.id}`, label: t('carouselRecentEvent'), event: e, tone: 'bg-neutral-200 text-neutral-800' })),
  ];

  if (highlights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {highlights.map(item => (
        <div key={item.key} className="flex flex-col gap-2">
          <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', item.tone)}>
            {item.key.startsWith('ongoing') && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
            {item.label}
          </span>
          <Link href={`${routeEvents}/${item.event.id}`} className="flex-1 rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand">
            <EventCard event={item.event} />
          </Link>
        </div>
      ))}
    </div>
  );
};
