import type { MetadataRoute } from 'next';
import {
  routeAbout,
  routeAds,
  routeContributors,
  routeDataProtection,
  routeDonate,
  routeEvents,
  routeHome,
  routeImprint,
  routeMap,
  routeRoadmap,
  routeStatistics,
  routeTermsOfService,
  routeUsers,
  routeVoice,
} from '@/domain/constants/routes';
import { EventState } from '@/domain/enums/event-state';
import { UserType } from '@/domain/enums/user-type';
import { getEvents } from '@/infrastructure/clients/event.client';
import { getUsers } from '@/infrastructure/clients/user.client';
import { getSiteUrl } from '@/lib/site-url';

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: routeHome, changeFrequency: 'daily', priority: 1 },
  { path: routeEvents, changeFrequency: 'daily', priority: 0.9 },
  { path: routeUsers, changeFrequency: 'daily', priority: 0.8 },
  { path: routeMap, changeFrequency: 'weekly', priority: 0.7 },
  { path: routeVoice, changeFrequency: 'weekly', priority: 0.6 },
  { path: routeAbout, changeFrequency: 'monthly', priority: 0.5 },
  { path: routeContributors, changeFrequency: 'monthly', priority: 0.4 },
  { path: routeDonate, changeFrequency: 'monthly', priority: 0.4 },
  { path: routeStatistics, changeFrequency: 'weekly', priority: 0.4 },
  { path: routeRoadmap, changeFrequency: 'monthly', priority: 0.3 },
  { path: routeAds, changeFrequency: 'weekly', priority: 0.3 },
  { path: routeImprint, changeFrequency: 'yearly', priority: 0.2 },
  { path: routeTermsOfService, changeFrequency: 'yearly', priority: 0.2 },
  { path: routeDataProtection, changeFrequency: 'yearly', priority: 0.2 },
];

const PUBLIC_EVENT_STATES = new Set<EventState>([EventState.APPROVED, EventState.ARCHIVED_PUBLIC]);

/** Revalidate sitemap at most once per hour. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const [eventsResult, usersResult] = await Promise.allSettled([getEvents(null, null, null, null, null), getUsers()]);

  const eventEntries: MetadataRoute.Sitemap = [];
  if (eventsResult.status === 'fulfilled' && Array.isArray(eventsResult.value)) {
    for (const event of eventsResult.value) {
      if (!event.id || !PUBLIC_EVENT_STATES.has(event.state)) continue;
      eventEntries.push({
        url: `${siteUrl}${routeEvents}/${encodeURIComponent(event.id)}`,
        lastModified: event.dateTo ? new Date(event.dateTo) : now,
        changeFrequency: 'weekly',
        priority: event.state === EventState.APPROVED ? 0.8 : 0.5,
      });
    }
  } else if (eventsResult.status === 'rejected') {
    console.error('sitemap: failed to load events', eventsResult.reason);
  }

  const userEntries: MetadataRoute.Sitemap = [];
  if (usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)) {
    for (const user of usersResult.value) {
      if (!user.username) continue;
      if (user.type === UserType.ADMINISTRATIVE || user.type === UserType.FAN) continue;
      userEntries.push({
        url: `${siteUrl}${routeUsers}/${encodeURIComponent(user.username)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } else if (usersResult.status === 'rejected') {
    console.error('sitemap: failed to load users', usersResult.reason);
  }

  return [...staticEntries, ...eventEntries, ...userEntries];
}
