import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { EventType } from '@/domain/enums/event-type';
import type { Event } from '@/domain/types/event';
import type { User } from '@/domain/types/user';
import { getUserTypeLabels } from '@/functions/user-type';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { getSiteUrl, toAbsoluteUrl, truncateMetaDescription } from '@/lib/site-url';

function absolutePath(path: string): string {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FSMeet',
    url: siteUrl,
    description: 'Freestyle Football community and event platform.',
  };
}

export function buildEventJsonLd(event: Event): Record<string, unknown> {
  const url = absolutePath(`${routeEvents}/${event.id}`);
  const image = toAbsoluteUrl(event.imageUrlPoster);
  const startDate = toIsoDate(event.dateFrom);
  const endDate = toIsoDate(event.dateTo);
  const isOnline = event.type === EventType.COMPETITION_ONLINE;

  const description = event.description?.trim()
    ? truncateMetaDescription(event.description, 300)
    : undefined;

  const location = isOnline
    ? {
        '@type': 'VirtualLocation',
        url,
      }
    : {
        '@type': 'Place',
        name: event.venueName || event.venueCity || 'Event venue',
        address: {
          '@type': 'PostalAddress',
          streetAddress: [event.venueStreet, event.venueHouseNo].filter(Boolean).join(' ') || undefined,
          addressLocality: event.venueCity || undefined,
          postalCode: event.venuePostCode || undefined,
          addressCountry: event.venueCountryCode || undefined,
        },
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    url,
    ...(description ? { description } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(image ? { image: [image] } : {}),
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location,
    organizer: {
      '@type': 'Organization',
      name: 'FSMeet',
      url: getSiteUrl(),
    },
  };
}

function getUserDisplayName(user: User): string {
  if (user.nickName?.trim()) return user.nickName.trim();
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return fullName || user.username;
}

function buildSameAs(user: User): string[] {
  const links: string[] = [];
  if (user.instagramHandle) {
    links.push(`https://www.instagram.com/${user.instagramHandle.replace('@', '')}`);
  }
  if (user.tikTokHandle) {
    links.push(`https://www.tiktok.com/${user.tikTokHandle}`);
  }
  if (user.youTubeHandle) {
    links.push(`https://www.youtube.com/${user.youTubeHandle}`);
  }
  if (user.website) {
    const website = /^https?:\/\//i.test(user.website) ? user.website : `https://${user.website}`;
    links.push(website);
  }
  return links;
}

export function buildPersonJsonLd(user: User): Record<string, unknown> {
  const url = absolutePath(`${routeUsers}/${encodeURIComponent(user.username)}`);
  const image = toAbsoluteUrl(user.imageUrl);
  const typeLabel = getUserTypeLabels(user.type, null);
  const sameAs = buildSameAs(user);
  const countryName =
    user.countryCode && user.countryCode !== '--' ? getCountryNameByCode(user.countryCode) || user.countryCode : undefined;

  // Platform role has no Schema.org equivalent — put it in free-text description (same signal as meta description).
  const description = truncateMetaDescription(
    [typeLabel && `${typeLabel} on FSMeet`, countryName].filter(Boolean).join(' · ') || 'FSMeet profile',
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: getUserDisplayName(user),
    url,
    description,
    ...(image ? { image } : {}),
    ...(countryName
      ? {
          nationality: {
            '@type': 'Country',
            name: countryName,
          },
        }
      : {}),
    ...(user.city
      ? {
          homeLocation: {
            '@type': 'Place',
            name: user.city,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

